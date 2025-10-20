from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import Optional
import math
import os
import shutil
from datetime import datetime
import uuid
from pathlib import Path

from ..core.dependencies import get_current_user, get_current_active_user
from ..db.base import get_db
from ..models.user import User
from ..models.note import Note
from ..models.subject import Subject as SubjectModel
from ..models.note_rating import NoteRating
from ..models.saved_note import SavedNote
from ..models.note_comment import NoteComment

from ..schemas import (
    NoteCreate,
    NoteUpdate,
    NoteResponse,
    NoteListResponse,
    NoteStatistics,
    UserPublicProfile,
    PaginatedResponse,
    NoteResponseWithOwner,
)

router = APIRouter()

UPLOAD_DIR = "uploads/notes"
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.md', '.ppt', '.pptx'}
MAX_FILE_SIZE = 10 * 1024 * 1024

os.makedirs(UPLOAD_DIR, exist_ok=True)


def validate_file(file: UploadFile) -> None:
    """Walidacja pliku"""
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB"
        )


def save_upload_file(file: UploadFile, note_id: int) -> str:
    """Zapisz plik i zwróć ścieżkę"""
    file_extension = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{note_id}_{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
        title: str = Form(..., max_length=255),
        content: str = Form(...),
        subject_id: int = Form(...),  # Wymagane!
        file: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Utwórz nową notatkę"""
    if not current_user.post_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have permission to create notes"
        )

    subject = db.query(SubjectModel).filter(SubjectModel.subject_id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )

    if file and file.filename:
        validate_file(file)

    db_note = Note(
        title=title,
        content=content,
        subject_id=subject_id,
        user_id=current_user.user_id
    )

    db.add(db_note)
    db.flush()

    if file and file.filename:
        file_path = save_upload_file(file, db_note.note_id)
        db_note.file_path = file_path

    db.commit()
    db.refresh(db_note)

    return db_note


@router.put("/{note_id}/upload", response_model=NoteResponse)
async def upload_or_replace_note_file(
        note_id: int,
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Dodaj lub zamień plik notatki"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if note.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload file to this note"
        )

    if not current_user.post_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have permission to update notes"
        )

    validate_file(file)

    if note.file_path and os.path.exists(note.file_path):
        os.remove(note.file_path)

    file_path = save_upload_file(file, note_id)
    note.file_path = file_path
    note.updated_at = datetime.now()

    db.commit()
    db.refresh(note)

    return note


@router.get("/{note_id}/download")
async def download_note_file(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Pobierz plik notatki"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if not note.file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This note has no file attached"
        )

    if not os.path.exists(note.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )

    download_filename = Path(note.file_path).name
    return FileResponse(
        path=note.file_path,
        filename=download_filename,
        media_type='application/octet-stream'
    )


@router.get("/", response_model=PaginatedResponse[NoteListResponse])
async def get_notes(
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        subject_id: Optional[int] = Query(None), 
        user_id: Optional[int] = Query(None),
        search: Optional[str] = Query(None),
        has_file: Optional[bool] = Query(None),
        sort_by: str = Query("created_at", regex="^(created_at|updated_at|average_rating|rating_count|title)$"),
        order: str = Query("desc", regex="^(asc|desc)$"),
        db: Session = Depends(get_db)
):
    """
    Pobierz listę notatek z filtrowaniem i paginacją
    """
    query = db.query(Note).options(joinedload(Note.subject))

    if subject_id:
        query = query.filter(Note.subject_id == subject_id)

    if user_id:
        query = query.filter(Note.user_id == user_id)

    if search:
        query = query.filter(
            (Note.title.ilike(f"%{search}%")) |
            (Note.content.ilike(f"%{search}%"))
        )

    if has_file is not None:
        if has_file:
            query = query.filter(Note.file_path.isnot(None))
        else:
            query = query.filter(Note.file_path.is_(None))

    sort_column = getattr(Note, sort_by)

    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(sort_column)

    total = query.count()
    total_pages = math.ceil(total / page_size)

    notes = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": notes
    }

@router.get("/{note_id}", response_model=NoteResponseWithOwner)
async def get_note(
        note_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Pobierz szczegóły notatki"""
    note = db.query(Note).options(joinedload(Note.subject)).filter(
        Note.note_id == note_id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    is_owner = note.user_id == current_user.user_id

    return NoteResponseWithOwner(
        note=note,
        is_owner=is_owner
    )


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
        note_id: int,
        title: Optional[str] = Form(None, max_length=255),
        content: Optional[str] = Form(None),
        subject_id: Optional[int] = Form(None),
        file: Optional[UploadFile] = File(None),
        remove_file: bool = Form(False),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Edytuj notatkę"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if note.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this note"
        )

    if not current_user.post_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have permission to update notes"
        )

    if subject_id is not None:
        subject = db.query(SubjectModel).filter(SubjectModel.subject_id == subject_id).first()
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subject not found"
            )

    if title is not None:
        note.title = title
    if content is not None:
        note.content = content
    if subject_id is not None:
        note.subject_id = subject_id

    if remove_file and note.file_path:
        if os.path.exists(note.file_path):
            os.remove(note.file_path)
        note.file_path = None

    if file and file.filename:
        validate_file(file)

        if note.file_path and os.path.exists(note.file_path):
            os.remove(note.file_path)

        file_path = save_upload_file(file, note_id)
        note.file_path = file_path

    note.updated_at = datetime.now()

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Usuń notatkę"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if note.user_id != current_user.user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this note"
        )

    if note.file_path and os.path.exists(note.file_path):
        os.remove(note.file_path)

    db.delete(note)
    db.commit()

    return None


@router.get("/{note_id}/statistics", response_model=NoteStatistics)
async def get_note_statistics(
        note_id: int,
        db: Session = Depends(get_db)
):
    """Pobierz statystyki notatki"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    total_saves = db.query(func.count(SavedNote.user_id)).filter(
        SavedNote.note_id == note_id
    ).scalar()

    total_comments = db.query(func.count(NoteComment.comment_id)).filter(
        NoteComment.note_id == note_id
    ).scalar()

    return {
        "note_id": note.note_id,
        "total_ratings": note.rating_count,
        "average_rating": note.average_rating,
        "total_saves": total_saves,
        "total_comments": total_comments
    }


@router.get("/user/{user_id}", response_model=PaginatedResponse[NoteListResponse])
async def get_user_notes(
        user_id: int,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db)
):
    """Pobierz wszystkie notatki użytkownika"""
    query = db.query(Note).options(joinedload(Note.subject)).filter(
        Note.user_id == user_id
    ).order_by(desc(Note.created_at))

    total = query.count()
    total_pages = math.ceil(total / page_size)

    notes = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": notes
    }


@router.get("/by-subject/{subject_id}", response_model=PaginatedResponse[NoteListResponse])
async def get_notes_by_subject(
        subject_id: int,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db)
):
    """Pobierz wszystkie notatki dla danego przedmiotu"""
    subject = db.query(SubjectModel).filter(SubjectModel.subject_id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )

    query = db.query(Note).options(joinedload(Note.subject)).filter(
        Note.subject_id == subject_id
    ).order_by(desc(Note.created_at))

    total = query.count()
    total_pages = math.ceil(total / page_size)

    notes = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": notes
    }