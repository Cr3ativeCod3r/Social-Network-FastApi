from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base


class NoteRating(Base):
    __tablename__ = "note_ratings"

    note_id = Column(Integer, ForeignKey('notes.note_id', ondelete='CASCADE'), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True, index=True)
    rating = Column(Integer, nullable=False)  # np. 1-5
    rated_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="note_ratings")
    note = relationship("Note", back_populates="ratings")
