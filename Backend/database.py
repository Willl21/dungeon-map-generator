import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL wajib di-set lewat environment di production (mis. MySQL di
# Clever Cloud). Fallback ke DB lokal hanya untuk kenyamanan dev di mesin
# sendiri — jangan diandalkan di server.
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
