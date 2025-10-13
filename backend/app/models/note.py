from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base


class Note(Base):
    __tablename__ = "notes"

    note_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String(255))
    subject = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    average_rating = Column(DECIMAL(2, 1))
    rating_count = Column(Integer, default=0)

    user = relationship("User", back_populates="notes")
    ratings = relationship("NoteRating", back_populates="note", cascade="all, delete-orphan")
    saved_by_users = relationship("SavedNote", back_populates="note", cascade="all, delete-orphan")
    comments = relationship("NoteComment", back_populates="note", cascade="all, delete-orphan")

   