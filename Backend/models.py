from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey, func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    email = Column(String(100), unique=True)
    password_hash = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())


class GeneratedMap(Base):
    __tablename__ = "generated_maps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    map_type = Column(String(50), nullable=False)
    environment = Column(String(50), nullable=False)
    seed = Column(Integer, nullable=False)
    image_preset = Column(String(50), nullable=True)
    beautify = Column(Boolean, default=True)
    image_path = Column(String(500), nullable=False)   # relative path: uploads/users/{id}/map_xxx.png
    created_at = Column(TIMESTAMP, server_default=func.now())