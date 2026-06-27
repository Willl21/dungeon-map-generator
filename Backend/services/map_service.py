"""
map_service.py
--------------
Service layer untuk menyimpan file PNG map ke disk
dan menyimpan metadata ke tabel generated_maps.
"""

from pathlib import Path
from datetime import datetime
from sqlalchemy.orm import Session

from models import GeneratedMap


# ─────────────────────────────────────────────
# ROOT UPLOAD DIR  (relatif terhadap lokasi server dijalankan)
# ─────────────────────────────────────────────
UPLOAD_ROOT = Path("uploads")


def _ensure_user_dir(user_id: int) -> Path:
    """Buat folder uploads/users/{user_id}/ jika belum ada."""
    user_dir = UPLOAD_ROOT / "users" / str(user_id)
    user_dir.mkdir(parents=True, exist_ok=True)
    return user_dir


def _make_filename() -> str:
    """Nama file unik berdasarkan timestamp: map_YYYYMMDDHHmmss.png"""
    return f"map_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"


# ─────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────

def save_map_file(image_bytes: bytes, user_id: int) -> Path:
    """
    Simpan image_bytes sebagai PNG ke:
        uploads/users/{user_id}/map_{timestamp}.png

    Returns:
        Path objek absolut ke file yang disimpan.
    """
    user_dir = _ensure_user_dir(user_id)
    filename = _make_filename()
    file_path = user_dir / filename
    file_path.write_bytes(image_bytes)
    return file_path


def save_map_record(
    db: Session,
    *,
    user_id: int,
    map_type: str,
    environment: str,
    seed: int,
    image_preset: str | None,
    beautify: bool,
    image_path: str,          # relative path string, e.g. "uploads/users/3/map_xxx.png"
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
    Hapus file PNG dari disk berdasarkan relative path.
    Returns True jika file berhasil dihapus, False jika tidak ditemukan.
    """
    file_path = Path(image_path)
    if file_path.exists():
        file_path.unlink()
        return True
    return False


def image_path_to_url(image_path: str, base_url: str = "http://localhost:8000") -> str:
    """
    Konversi relative path ke URL yang dapat diakses:
    "uploads/users/3/map_xxx.png" → "http://localhost:8000/uploads/users/3/map_xxx.png"
    Gunakan forward slash agar kompatibel di Windows.
    """
    clean_path = image_path.replace("\\", "/")
    return f"{base_url}/{clean_path}"
