"""
map_service.py
--------------
Service layer untuk menyimpan file PNG map ke Cloudflare R2 (object storage)
dan menyimpan metadata ke tabel generated_maps.

Kenapa R2, bukan disk:
    Filesystem di platform hosting (Railway/Render/dll) bersifat ephemeral —
    semua file yang ditulis ke disk hilang tiap redeploy/restart. Object
    storage bertahan selamanya dan disajikan lewat URL publik (CDN R2), jadi
    gambar map tidak pernah hilang.

Yang disimpan di DB (kolom generated_maps.image_path) sekarang adalah
**object key** R2 (mis. "users/3/map_20250101120000_ab12cd34.png"), bukan
path disk. URL publik dibangun saat dibaca lewat object_key_to_url().
"""

import os
import io
import uuid
from datetime import datetime

import boto3
from botocore.config import Config
from sqlalchemy.orm import Session

from models import GeneratedMap


# ─────────────────────────────────────────────
# R2 CONFIG (dari environment)
# ─────────────────────────────────────────────
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "")
# Public base URL bucket. Bisa berupa:
#   - custom domain (mis. "https://cdn.situskamu.com") → gambar diserve langsung
#     dari R2/CDN (egress gratis), ATAU
#   - URL r2.dev bawaan (mis. "https://pub-xxxx.r2.dev") → beberapa ISP di
#     Indonesia (Biznet, IndiHome) MEMBLOKIR *.r2.dev, jadi ini otomatis
#     di-proxy lewat backend (lihat object_key_to_url).
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "").rstrip("/")
# URL publik backend ini sendiri (mis. "https://xxx.up.railway.app"), dipakai
# untuk mem-proxy gambar lewat endpoint /files/{key} saat serve langsung tidak
# memungkinkan (r2.dev diblokir).
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000").rstrip("/")

_s3_client = None


def _get_client():
    """
    Buat (sekali) dan cache boto3 S3 client yang menunjuk ke R2.
    Lazy: dibuat saat pertama dipakai, supaya import modul ini tidak gagal
    hanya karena env belum ke-load.
    """
    global _s3_client
    if _s3_client is None:
        missing = [
            name
            for name, val in {
                "R2_ACCOUNT_ID": R2_ACCOUNT_ID,
                "R2_ACCESS_KEY_ID": R2_ACCESS_KEY_ID,
                "R2_SECRET_ACCESS_KEY": R2_SECRET_ACCESS_KEY,
                "R2_BUCKET_NAME": R2_BUCKET_NAME,
            }.items()
            if not val
        ]
        if missing:
            raise RuntimeError(
                f"R2 belum dikonfigurasi — env var kosong: {', '.join(missing)}"
            )

        _s3_client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name="auto",
            config=Config(signature_version="s3v4"),
        )
    return _s3_client


def _make_object_key(user_id: int) -> str:
    """
    Object key unik per map:
        users/{user_id}/map_{timestamp}_{rand}.png
    Suffix acak menghindari tabrakan kalau dua map dibuat di detik yang sama.
    """
    stamp = datetime.now().strftime("%Y%m%d%H%M%S")
    rand = uuid.uuid4().hex[:8]
    return f"users/{user_id}/map_{stamp}_{rand}.png"


# ─────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────

def save_map_file(image_bytes: bytes, user_id: int) -> str:
    """
    Upload image_bytes sebagai PNG ke R2.

    Returns:
        Object key R2 (string) — inilah yang disimpan ke DB.image_path.
    """
    key = _make_object_key(user_id)
    _get_client().put_object(
        Bucket=R2_BUCKET_NAME,
        Key=key,
        Body=image_bytes,
        ContentType="image/png",
    )
    return key


def save_map_record(
    db: Session,
    *,
    user_id: int,
    map_type: str,
    environment: str,
    seed: int,
    image_preset: str | None,
    beautify: bool,
    image_path: str,          # object key R2, mis. "users/3/map_xxx.png"
) -> GeneratedMap:
    """
    Insert baris baru ke tabel generated_maps dan kembalikan objek-nya.
    Pemanggil bertanggung jawab memanggil db.close().
    """
    record = GeneratedMap(
        user_id=user_id,
        map_type=map_type,
        environment=environment,
        seed=seed,
        image_preset=image_preset,
        beautify=beautify,
        image_path=image_path,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def delete_map_file(image_path: str) -> bool:
    """
    Hapus object dari R2 berdasarkan key.
    R2 delete_object idempoten (tidak error kalau key tidak ada), jadi selama
    request-nya sukses kita anggap terhapus.
    """
    try:
        _get_client().delete_object(Bucket=R2_BUCKET_NAME, Key=image_path)
        return True
    except Exception as exc:  # noqa: BLE001 — log & lapor gagal, jangan crash
        print(f"[delete_map_file] gagal hapus {image_path}: {exc}")
        return False


def get_map_bytes(image_path: str) -> bytes:
    """Ambil isi object PNG dari R2 (dipakai endpoint /download)."""
    obj = _get_client().get_object(Bucket=R2_BUCKET_NAME, Key=image_path)
    return obj["Body"].read()


def object_key_to_url(image_path: str) -> str:
    """
    Konversi object key ke URL publik yang bisa dibuka frontend.

    - Kalau R2_PUBLIC_URL adalah CUSTOM DOMAIN → serve langsung dari R2/CDN
      (egress gratis, cepat):
        "users/3/map_xxx.png" → "https://cdn.situskamu.com/users/3/map_xxx.png"
    - Kalau masih r2.dev (diblokir sebagian ISP Indonesia) atau kosong →
      proxy lewat backend supaya browser tidak pernah menyentuh r2.dev:
        "users/3/map_xxx.png" → "{PUBLIC_BASE_URL}/files/users/3/map_xxx.png"
    """
    key = image_path.replace("\\", "/").lstrip("/")
    if R2_PUBLIC_URL and "r2.dev" not in R2_PUBLIC_URL:
        return f"{R2_PUBLIC_URL}/{key}"
    return f"{PUBLIC_BASE_URL}/files/{key}"
