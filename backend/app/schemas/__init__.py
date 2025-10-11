from ..schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token,
    TokenResponse,
    UserPublicProfile,
    UserPasswordChange,
    UserAdminUpdate,
    UserBan,
    UserPermissionUpdate,
    UserListResponse,
    UserAdminResponse,
)

from ..schemas.note import (
    NoteBase,
    NoteCreate,
    NoteUpdate,
    NoteResponse,
    NoteListResponse,
    NoteStatistics,
)
from ..schemas.note_rating import (
    NoteRatingCreate,
    NoteRatingResponse,
)
from ..schemas.saved_note import (
    SavedNoteCreate,
    SavedNoteResponse,
    SavedNoteListResponse,
    SavedNoteWithDetails,
)
from ..schemas.admin import (
    AdminStatistics,
    AdminNoteListResponse
)
from ..schemas.common import PaginatedResponse

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenResponse",
    "UserPublicProfile",
    "UserPasswordChange",
    "UserAdminUpdate",
    "UserBan",
    "UserPermissionUpdate",
    "UserListResponse",
    "UserAdminResponse",
    # Note
    "NoteBase",
    "NoteCreate",
    "NoteUpdate",
    "NoteResponse",
    "NoteListResponse",
    "NoteStatistics",
    # Note Rating
    "NoteRatingCreate",
    "NoteRatingResponse",
    # Saved Note
    "SavedNoteCreate",
    "SavedNoteResponse",
    "SavedNoteListResponse",
    "SavedNoteWithDetails",
    # Admin
    "AdminStatistics",
    "AdminNoteListResponse",
    #pagination
    "PaginatedResponse",
]