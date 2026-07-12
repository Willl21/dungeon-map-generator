import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL wajib di-set lewat environment di production.
# Supabase (PostgreSQL) — pakai driver psycopg2, format:
#   postgresql+psycopg2://USER:PASSWORD@HOST:5432/postgres
# (ambil dari Supabase → Settings → Database → "Session pooler" agar
#  kompatibel IPv4 di host seperti Railway).
# Fallback di bawah hanya untuk dev lokal; jangan diandalkan di server.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:@localhost/dnd",
)

# pool_pre_ping: managed DB (Clever Cloud) kadang memutus koneksi idle;
# ini mem-validasi koneksi sebelum dipakai supaya tidak error "server has
# gone away" setelah aplikasi diam beberapa saat.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
