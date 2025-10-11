from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal


class AdminNoteListResponse(BaseModel):
    """Notatka w panelu admina z dodatkowymi informacjami"""
    note_id: int
    title: str
    subject: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: int
    average_rating: Optional[float]
    rating_count: int
    has_file: bool
    user_email: str
    user_first_name: str
    user_last_name: str

    model_config = ConfigDict(from_attributes=True)


class AdminStatistics(BaseModel):
    """Ogólne statystyki systemu"""
    total_notes: int
    notes_with_files: int
    notes_without_files: int
    total_ratings: int
    total_saved: int
    average_rating: float
    notes_last_30_days: int