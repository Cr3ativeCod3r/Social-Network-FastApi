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

class UsersRestrictionsStats(BaseModel):
    without_chat: int
    without_comments: int
    without_posts: int

class ReportsStats(BaseModel):
    total_reports: int
    total_resolved_reports: int
    total_in_progress_reports: int
    total_pending_reports: int
    total_rejected_reports: int

class AdminStatsResponse(BaseModel):
    total_users: int
    verified_users: int
    banned_users: int
    admin_users: int
    users_with_restrictions: UsersRestrictionsStats
    reports_stats: ReportsStats

class AdminFileStatistics(BaseModel):
    """Ogólne statystyki systemu"""
    total_notes: int
    notes_with_files: int
    notes_without_files: int
    total_ratings: int
    total_saved: int
    average_rating: float
    notes_last_30_days: int