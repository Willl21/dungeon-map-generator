import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"


def _to_bytes(password: str) -> bytes:
    # bcrypt hanya memproses maksimal 72 byte. Truncate di level BYTE (bukan
    # char) supaya konsisten dengan perilaku bcrypt sekaligus menghindari
    # error di bcrypt >= 4.1 yang menolak input > 72 byte. Dipakai passlib
    # dulu, tapi passlib 1.7.4 (2020) sudah tidak kompatibel dengan bcrypt
    # modern — jadi kita pakai library bcrypt langsung agar tahan versi.
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_to_bytes(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_to_bytes(password), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=2)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
