from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class NoteRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")


class NoteRatingResponse(BaseModel):
    note_id: int
    user_id: int
    rating: int
    rated_at: datetime

    model_config = ConfigDict(from_attributes=True)