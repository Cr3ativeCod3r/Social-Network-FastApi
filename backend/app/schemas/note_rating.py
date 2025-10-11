from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class NoteRatingBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")


class NoteRatingCreate(NoteRatingBase):
    note_id: int


class NoteRatingUpdate(NoteRatingBase):
    pass


class NoteRatingResponse(NoteRatingBase):
    note_id: int
    user_id: int
    rated_at: datetime

    model_config = ConfigDict(from_attributes=True)