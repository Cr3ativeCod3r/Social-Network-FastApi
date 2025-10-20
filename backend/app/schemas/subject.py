from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class Subject(BaseModel):
    name: str = Field(...,min_length=5, max_length=100,description="nazwa przedmiotu")

class SubjectResponse(Subject):
    subject_id: int
    name: str


    class Config:
        from_attributes = True

class SubjectList(BaseModel):
    subjects: list[SubjectResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)