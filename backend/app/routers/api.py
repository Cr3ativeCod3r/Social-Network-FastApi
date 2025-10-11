from fastapi import APIRouter

from ..routers import(
    auth,
    users,
    admin,
    notes,
    saved_notes,
    note_ratings,
    note_comments
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(saved_notes.router, prefix="/saved-notes", tags=["saved-notes"])
api_router.include_router(note_ratings.router, prefix="/note-ratings", tags=["note-ratings"])
api_router.include_router(note_comments.router, prefix="/note-comments", tags=["note-comments"])