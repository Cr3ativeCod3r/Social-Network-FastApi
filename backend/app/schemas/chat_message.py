from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class ChatMessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class MessageAuthor(BaseModel):
    """Dane autora wiadomości"""
    user_id: int
    first_name: str
    last_name: str
    is_admin: bool = False


class ChatMessageResponse(ChatMessageBase):
    message_id: int
    user_id: int
    created_at: datetime
    is_edited: bool

    author: MessageAuthor

    is_author: bool = False

    model_config = ConfigDict(from_attributes=True)


class ChatStats(BaseModel):
    """Statystyki chatu"""
    active_users: int
    messages_today: int