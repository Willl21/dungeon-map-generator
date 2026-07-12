from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import io
import base64
from datetime import datetime

from pydantic import BaseModel
from typing import Optional

from jose import jwt, JWTError
from sqlalchemy.exc import IntegrityError

from database import SessionLocal, engine
from models import User, GeneratedMap
import models
from auth_utils import hash_password, verify_password, create_token, SECRET_KEY, ALGORITHM

from generators.dungeon import DungeonGenerator
from generators.world import generate_world
from generators.city import generate_city
from generators.cave import generate_cave
from generators.sky import generate_sky

from generators.environments.forest import ForestEnvironment
from generators.environments.desert import DesertEnvironment
from generators.environments.ice import IceEnvironment
from generators.environments.swamp import SwampEnvironment

from renderers.base_renderer import render_to_image
from services.sd_service import beautify_map
from services.map_service import (
    save_map_file,
    save_map_record,
    delete_map_file,
    get_map_bytes,
    object_key_to_url,
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="D&D Map Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Map images now live in Cloudflare R2 (object storage), not on local disk —
# no StaticFiles mount needed. Images are served straight from R2's public URL
# (see object_key_to_url), which survives redeploys and offloads bandwidth.

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(401, "Invalid token")

        return user_id

    except JWTError:
        raise HTTPException(401, "Invalid or expired token")


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class MapRequest(BaseModel):
    map_type: str
    environment: str = "forest"
    seed: int = 42
    image_preset: Optional[str] = None
    beautify: bool = True


class MapResponse(BaseModel):
    id: int
    seed: int
    map_type: str
    environment: str
    width: int
    height: int
    tiles: list[list[str]]
    objects: list[dict]
    image_url: Optional[str] = None


class MapMeta(BaseModel):
    """Metadata ringkas untuk list /my-maps."""
    id: int
    map_type: str
    environment: str
    seed: int
    image_preset: Optional[str]
    beautify: bool
    image_url: str
    created_at: str


GENERATORS = {
    "world": generate_world,
    "city": generate_city,
    "cave": generate_cave,
    "sky": generate_sky,
}

ENVIRONMENTS = {
    "forest": ForestEnvironment,
    "desert": DesertEnvironment,
    "ice": IceEnvironment,
    "swamp": SwampEnvironment,
}

MAP_TILE_SIZES = {
    "world": (80, 50),
    "city": (50, 40),
    "dungeon": (40, 30),
    "cave": (35, 25),
    "sky": (60, 35),
}

IMAGE_PRESETS = {
    "square": (1024, 1024),
    "landscape": (1024, 768),
    "wide": (1280, 768),
}

DEFAULT_PRESET_BY_MAP = {
    "world": "wide",
    "city": "square",
    "dungeon": "square",
    "cave": "square",
    "sky": "landscape",
}


def get_map_size(map_type):
    return MAP_TILE_SIZES.get(map_type, (40, 30))


def get_output_size(map_type, preset):
    selected = preset or DEFAULT_PRESET_BY_MAP.get(map_type, "square")
    return IMAGE_PRESETS[selected]


async def build_map(req: MapRequest):
    width, height = get_map_size(req.map_type)

    if req.map_type == "dungeon":
        gen = DungeonGenerator(seed=req.seed)
        result = gen.generate(width, height)
    else:
        result = GENERATORS[req.map_type](
            seed=req.seed,
            width=width,
            height=height
        )

    env = ENVIRONMENTS[req.environment]()
    result = env.apply(result)

    output_size = get_output_size(req.map_type, req.image_preset)

    base_img = render_to_image(
        result["tiles"],
        result["objects"],
        output_size
    )

    final_bytes = base_img

    if req.beautify:
        beauty_result = await beautify_map(
            base_img,
            req.map_type,
            req.environment
        )
        if beauty_result and beauty_result.startswith("data:image"):
            b64 = beauty_result.split(",")[1]
            final_bytes = base64.b64decode(b64)

    return result, final_bytes


@app.post("/register")
def register(req: RegisterRequest):
    db = SessionLocal()

    try:
        existing_email = db.query(User).filter(User.email == req.email).first()
        if existing_email:
            raise HTTPException(400, "Email already exists")

        existing_username = db.query(User).filter(User.username == req.username).first()
        if existing_username:
            raise HTTPException(400, "Username already exists")

        user = User(
            username=req.username,
            email=req.email,
            password_hash=hash_password(req.password)
        )

        db.add(user)
        db.commit()

        return {"message": "User created"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Username or Email already exists")

    finally:
        db.close()


@app.post("/login")
def login(req: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(User.email == req.email).first()

    if not user:
        db.close()
        raise HTTPException(401, "Invalid email")

    if not verify_password(req.password, user.password_hash):
        db.close()
        raise HTTPException(401, "Wrong password")

    token = create_token({
        "user_id": user.id
    })

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/me")
def get_me(user_id: int = Depends(get_current_user)):
    """Kembalikan data user yang sedang login."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(404, "User not found")
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.isoformat() if user.created_at else "",
        }
    finally:
        db.close()


@app.post("/generate", response_model=MapResponse)
async def generate_map(
    req: MapRequest,
    user_id: int = Depends(get_current_user)
):
    if req.map_type not in GENERATORS and req.map_type != "dungeon":
        raise HTTPException(400, "invalid map_type")

    if req.environment not in ENVIRONMENTS:
        raise HTTPException(400, "invalid environment")

    result, final_bytes = await build_map(req)
    object_key = save_map_file(final_bytes, user_id)
    db = SessionLocal()
    try:
        record = save_map_record(
            db,
            user_id=user_id,
            map_type=req.map_type,
            environment=req.environment,
            seed=req.seed,
            image_preset=req.image_preset,
            beautify=req.beautify,
            image_path=object_key,
        )
        record_id = record.id
    finally:
        db.close()

    image_url = object_key_to_url(object_key)
    width, height = get_map_size(req.map_type)
    print(f"[generate] user={user_id} map_id={record_id} key={object_key}")
    return MapResponse(
        id=record_id,
        seed=req.seed,
        map_type=req.map_type,
        environment=req.environment,
        width=width,
        height=height,
        tiles=result["tiles"],
        objects=result["objects"],
        image_url=image_url,
    )

@app.get("/my-maps", response_model=list[MapMeta])
def my_maps(user_id: int = Depends(get_current_user)):
    db = SessionLocal()
    try:
        maps = (
            db.query(GeneratedMap)
            .filter(GeneratedMap.user_id == user_id)
            .order_by(GeneratedMap.created_at.desc())
            .all()
        )

        result = []
        for m in maps:
            result.append(MapMeta(
                id=m.id,
                map_type=m.map_type,
                environment=m.environment,
                seed=m.seed,
                image_preset=m.image_preset,
                beautify=m.beautify,
                image_url=object_key_to_url(m.image_path),
                created_at=m.created_at.isoformat() if m.created_at else "",
            ))

        return result
    finally:
        db.close()


# =====================
# MAP DETAIL (🔒 PROTECTED)
# =====================

@app.get("/maps/{map_id}", response_model=MapMeta)
def get_map(map_id: int, user_id: int = Depends(get_current_user)):
    """Ambil detail satu map. Hanya pemilik yang bisa mengakses."""
    db = SessionLocal()
    try:
        m = db.query(GeneratedMap).filter(GeneratedMap.id == map_id).first()

        if not m:
            raise HTTPException(404, "Map not found")

        if m.user_id != user_id:
            raise HTTPException(403, "Forbidden")

        return MapMeta(
            id=m.id,
            map_type=m.map_type,
            environment=m.environment,
            seed=m.seed,
            image_preset=m.image_preset,
            beautify=m.beautify,
            image_url=object_key_to_url(m.image_path),
            created_at=m.created_at.isoformat() if m.created_at else "",
        )
    finally:
        db.close()


# =====================
# DELETE MAP (🔒 PROTECTED)
# =====================

@app.delete("/maps/{map_id}")
def delete_map(map_id: int, user_id: int = Depends(get_current_user)):
    """
    Hapus map:
    1. Pastikan map milik user ini
    2. Hapus file PNG dari disk
    3. Hapus record dari DB
    """
    db = SessionLocal()
    try:
        m = db.query(GeneratedMap).filter(GeneratedMap.id == map_id).first()

        if not m:
            raise HTTPException(404, "Map not found")

        if m.user_id != user_id:
            raise HTTPException(403, "Forbidden")

        image_path = m.image_path

        db.delete(m)
        db.commit()

        # Hapus file setelah commit DB berhasil
        deleted = delete_map_file(image_path)
        if not deleted:
            print(f"[delete_map] File tidak ditemukan di disk: {image_path}")

        return {"message": "Map deleted", "id": map_id}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Delete failed: {str(e)}")
    finally:
        db.close()


# =====================
# DOWNLOAD BY ID (🔒 PROTECTED)
# =====================

@app.get("/download/{map_id}")
def download_map_by_id(map_id: int, user_id: int = Depends(get_current_user)):
    """
    Ambil PNG dari R2 lalu stream ke client sebagai attachment.
    Hanya pemilik yang dapat mendownload.
    """
    db = SessionLocal()
    try:
        m = db.query(GeneratedMap).filter(GeneratedMap.id == map_id).first()

        if not m:
            raise HTTPException(404, "Map not found")

        if m.user_id != user_id:
            raise HTTPException(403, "Forbidden")

        try:
            image_bytes = get_map_bytes(m.image_path)
        except Exception:
            raise HTTPException(404, "File not found in storage")

        filename = f"map_{m.map_type}_{m.environment}_{m.seed}.png"

        return StreamingResponse(
            io.BytesIO(image_bytes),
            media_type="image/png",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    finally:
        db.close()


# =====================
# PUBLIC IMAGE PROXY
# =====================

@app.get("/files/{key:path}")
def serve_map_image(key: str):
    """
    Proxy publik untuk menampilkan gambar map lewat <img src>.

    Kenapa perlu: URL r2.dev bawaan Cloudflare diblokir sebagian ISP Indonesia
    (Biznet/IndiHome menyajikan sertifikat block-page → ERR_CERT_COMMON_NAME_INVALID).
    Backend mengambil object dari R2 via S3 API (yang tidak diblokir) lalu
    men-stream-nya, jadi browser hanya bicara ke domain backend ini.

    Publik & tanpa auth — sama seperti perilaku URL r2.dev sebelumnya; object
    key mengandung suffix acak sehingga tidak mudah ditebak. (Endpoint
    /download/{id} yang owner-only tetap dipakai untuk unduh dengan nama file.)
    """
    try:
        image_bytes = get_map_bytes(key)
    except Exception:
        raise HTTPException(404, "Image not found")

    return StreamingResponse(
        io.BytesIO(image_bytes),
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


# =====================
# LEGACY ENDPOINTS (backward compat — deprecated)
# =====================

@app.get("/preview")
async def preview_map_legacy():
    """
    DEPRECATED — dipertahankan agar tidak merusak client lama.
    Gunakan GET /uploads/users/{id}/map_xxx.png atau GET /maps/{id}
    """
    raise HTTPException(410, "Endpoint /preview sudah tidak digunakan. Gunakan image_url dari /generate.")


@app.get("/download")
async def download_map_legacy():
    """
    DEPRECATED — dipertahankan agar tidak merusak client lama.
    Gunakan GET /download/{id}
    """
    raise HTTPException(410, "Endpoint /download sudah tidak digunakan. Gunakan /download/{id}.")


# =====================
# HEALTH
# =====================

@app.get("/health")
def health():
    return {"status": "ok"}