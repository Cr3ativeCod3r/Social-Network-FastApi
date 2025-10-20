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
    profile_picture = Column(String(255))
    bio = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    is_banned = Column(Boolean, default=False)
    ban_reason = Column(String(500))
    ban_expires_at = Column(DateTime(timezone=True))
    comment_permission = Column(Boolean, default=True)
    post_permission = Column(Boolean, default=True)
    chat_permission = Column(Boolean, default=True)

    #Relations
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    note_ratings = relationship("NoteRating", back_populates="user", cascade="all, delete-orphan")
    saved_notes = relationship("SavedNote", back_populates="user", cascade="all, delete-orphan")
    note_comments = relationship("NoteComment", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
