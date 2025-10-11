from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class NoteCommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class NoteCommentCreate(NoteCommentBase):
    pass


class NoteCommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class CommentAuthor(BaseModel):
    """Minimalne dane autora komentarza"""
    user_id: int
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None


class NoteCommentResponse(NoteCommentBase):
    comment_id: int
    note_id: int
    user_id: int
    created_at: datetime

    author: CommentAuthor

    is_author: bool = False

    model_config = ConfigDict(from_attributes=True)