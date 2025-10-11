from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
import math

from ..core.dependencies import get_current_user, get_current_active_user
from ..db.base import get_db
from ..models.user import User
from ..models.note import Note
from ..models.saved_note import SavedNote
from ..schemas import (
    SavedNoteCreate,
    SavedNoteResponse,
    SavedNoteListResponse,
    PaginatedResponse,
)

router = APIRouter(prefix="/saved-notes", tags=["saved-notes"])


@router.post("/", response_model=SavedNoteResponse, status_code=status.HTTP_201_CREATED)
async def save_note(
        saved_note: SavedNoteCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Zapisz notatkę na profilu"""
    note = db.query(Note).filter(Note.note_id == saved_note.note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    existing = db.query(SavedNote).filter(
        SavedNote.user_id == current_user.user_id,
        SavedNote.note_id == saved_note.note_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note already saved"
        )

    # Zapisz notatkę
    db_saved_note = SavedNote(
        user_id=current_user.user_id,
        note_id=saved_note.note_id
    )

    db.add(db_saved_note)
    db.commit()
    db.refresh(db_saved_note)

    return db_saved_note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_note(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Usuń notatkę z zapisanych"""
    saved_note = db.query(SavedNote).filter(
        SavedNote.user_id == current_user.user_id,
        SavedNote.note_id == note_id
    ).first()

    if not saved_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved note not found"
        )

    db.delete(saved_note)
    db.commit()

    return None


@router.get("/", response_model=PaginatedResponse[SavedNoteListResponse])
async def get_saved_notes(
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Pobierz zapisane notatki użytkownika"""
    query = db.query(
        SavedNote.user_id,
        SavedNote.note_id,
        SavedNote.saved_at,
        Note.title,
        Note.subject,
        Note.created_at,
        Note.average_rating,
        Note.rating_count
    ).join(Note, SavedNote.note_id == Note.note_id).filter(
        SavedNote.user_id == current_user.user_id
    ).order_by(desc(SavedNote.saved_at))

    total = query.count()
    total_pages = math.ceil(total / page_size)

    results = query.offset((page - 1) * page_size).limit(page_size).all()

    items = [
        SavedNoteListResponse(
            user_id=row.user_id,
            note_id=row.note_id,
            saved_at=row.saved_at,
            title=row.title,
            subject=row.subject,
            created_at=row.created_at,
            average_rating=row.average_rating,
            rating_count=row.rating_count
        )
        for row in results
    ]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": items
    }


@router.get("/{note_id}/check", response_model=dict)
async def check_if_saved(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Sprawdź czy notatka jest zapisana"""
    saved_note = db.query(SavedNote).filter(
        SavedNote.user_id == current_user.user_id,
        SavedNote.note_id == note_id
    ).first()

    return {"is_saved": saved_note is not None}