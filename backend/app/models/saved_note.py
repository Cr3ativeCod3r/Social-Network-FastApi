from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base


class SavedNote(Base):
    __tablename__ = "saved_notes"

    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey('notes.note_id', ondelete='CASCADE'), primary_key=True, index=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="saved_notes")
    note = relationship("Note", back_populates="saved_by_users")

    __table_args__ = (
        UniqueConstraint('user_id', 'note_id', name='uq_user_saved_note'),
    )