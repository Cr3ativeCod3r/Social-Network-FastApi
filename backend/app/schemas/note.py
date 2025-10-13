from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal

class NoteBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    subject: Optional[str] = Field(None, max_length=255)

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    subject: Optional[str] = Field(None, max_length=255)

class NoteResponse(NoteBase):
    note_id: int
    file_path: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: int
    average_rating: Optional[Decimal]
    rating_count: int

    model_config = ConfigDict(from_attributes=True)

class NoteResponseWithOwner(BaseModel):
    note: NoteResponse
    is_owner: bool

    model_config = ConfigDict(from_attributes=True)

class NoteListResponse(BaseModel):
    note_id: int
    title: str
    subject: Optional[str]
    created_at: datetime
    user_id: int
    average_rating: Optional[Decimal]
    rating_count: int

    model_config = ConfigDict(from_attributes=True)

class NoteStatistics(BaseModel):
    note_id: int
    total_ratings: int
    average_rating: Optional[Decimal]
    total_saves: int
    total_comments: int


    model_config = ConfigDict(from_attributes=True)