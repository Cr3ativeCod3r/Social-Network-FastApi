from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    university = Column(String(255))
    department = Column(String(255))
    profile_picture = Column(String(255))
    bio = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    is_banned = Column(Boolean, default=False)
    ban_expires_at = Column(DateTime(timezone=True))
    comment_permission = Column(Boolean, default=True)
    post_permission = Column(Boolean, default=True)
    chat_permission = Column(Boolean, default=True)
    