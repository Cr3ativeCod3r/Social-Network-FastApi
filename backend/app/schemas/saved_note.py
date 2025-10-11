from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal


class SavedNoteCreate(BaseModel):
    note_id: int


class SavedNoteResponse(BaseModel):
    user_id: int
    note_id: int
    saved_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SavedNoteWithDetails(BaseModel):
    """Zapisana notatka z podstawowymi szczegółami"""
    user_id: int
    note_id: int
    saved_at: datetime

    note_title: str
    note_subject: Optional[str]
    note_created_at: datetime
    note_average_rating: Optional[Decimal]
    note_rating_count: int

    model_config = ConfigDict(from_attributes=True)


class SavedNoteListResponse(BaseModel):
    """Lista zapisanych notatek użytkownika - bez zagnieżdżonych obiektów"""
    user_id: int
    note_id: int
    saved_at: datetime

    title: str
    subject: Optional[str]
    created_at: datetime
    average_rating: Optional[Decimal]
    rating_count: int

    model_config = ConfigDict(from_attributes=True)