from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db.base import Base


class NoteComment(Base):
    __tablename__ = "note_comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey('notes.note_id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="note_comments")
    note = relationship("Note", back_populates="comments")