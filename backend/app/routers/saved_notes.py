from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session,joinedload
from sqlalchemy import desc
import math

from ..core.dependencies import get_current_user, get_current_active_user
from ..db.base import get_db
from ..models.user import User
from ..models.subject import Subject as SubjectModel
from ..models.note import Note
from ..models.saved_note import SavedNote
from ..schemas import (
    SavedNoteCreate,
    SavedNoteResponse,
    SavedNoteListResponse,
    PaginatedResponse,
)


router = APIRouter()

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
    query = db.query(SavedNote).options(
        joinedload(SavedNote.note).joinedload(Note.subject)
    ).filter(
        SavedNote.user_id == current_user.user_id
    ).order_by(desc(SavedNote.saved_at))

    total = query.count()
    total_pages = math.ceil(total / page_size)

    saved_notes = query.offset((page - 1) * page_size).limit(page_size).all()

    items = [
        SavedNoteListResponse(
            user_id=sn.user_id,
            note_id=sn.note_id,
            saved_at=sn.saved_at,
            title=sn.note.title,
            subject_id=sn.note.subject_id,
            subject=sn.note.subject,
            created_at=sn.note.created_at,
            average_rating=sn.note.average_rating,
            rating_count=sn.note.rating_count
        )
        for sn in saved_notes
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