from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal

from ..helpers.status_enum import StatusEnum

class ReportCreate(BaseModel):
    """Schema do tworzenia zgłoszenia """
    title: str = Field(...,min_length=5, max_length=100)
    description: str = Field(..., min_length=10, max_length=2000)

class ReportUpdateStatus(BaseModel):
    status: StatusEnum = Field(..., description="New status of the report")

class ReportResponse(BaseModel):
    report_id: int
    title: str
    email: str
    description: str
    status: StatusEnum
    reported_at: datetime
    user_id: int

    model_config = {
        "from_attributes": True
    }

class ReportListResponse(BaseModel):
    report_id: int
    title: str
    status: StatusEnum
    reported_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)