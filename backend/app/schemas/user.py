from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
import re



class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    university: Optional[str] = Field(None, max_length=255)
    department: Optional[str] = Field(None, max_length=255)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Hasło musi mieć minimum 8 znaków')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Hasło musi zawierać minimum jedną wielką literę')
        if not re.search(r'[a-z]', v):
            raise ValueError('Hasło musi zawierać minimum jedną małą literę')
        if not re.search(r'\d', v):
            raise ValueError('Hasło musi zawierać minimum jedną cyfrę')
        return v

    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Imię/nazwisko nie może być puste')
        return v.strip()



class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)



class UserResponse(BaseModel):
    user_id: int
    email: EmailStr
    first_name: str
    last_name: str
    university: Optional[str] = None
    department: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    is_verified: bool
    is_admin: bool
    is_banned: bool
    comment_permission: bool
    post_permission: bool
    chat_permission: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    university: Optional[str] = Field(None, max_length=255)
    department: Optional[str] = Field(None, max_length=255)
    profile_picture: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = None


class UserPublicProfile(BaseModel):
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    university: Optional[str] = None
    department: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"



class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


