from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
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
from ..models.note_rating import NoteRating
from ..models.saved_note import SavedNote
from ..schemas import (
    NoteCreate,
    NoteUpdate,
    NoteResponse,
    NoteListResponse,
    NoteStatistics,
    UserPublicProfile,
    PaginatedResponse
)

router = APIRouter(prefix="/notes", tags=["notes"])

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
        subject: Optional[str] = Form(None, max_length=255),
        group_id: Optional[int] = Form(None),
        file: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):

    file_path = None
    if file and file.filename:
        validate_file(file)

    db_note = Note(
        title=title,
        content=content,
        subject=subject,
        group_id=group_id,
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
    """
    Pobierz plik notatki

    Zwraca plik do pobrania. Jeśli notatka nie ma pliku, zwraca 404.
    """
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

    original_filename = Path(note.file_path).name
    file_extension = Path(note.file_path).suffix

    safe_title = "".join(c for c in note.title if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_title = safe_title[:50]  # Ogranicz długość
    download_filename = f"{safe_title}{file_extension}" if safe_title else original_filename

    return FileResponse(
        path=note.file_path,
        filename=download_filename,
        media_type='application/octet-stream'
    )

@router.delete("/{note_id}/file", response_model=NoteResponse)
async def delete_note_file(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Usuń plik z notatki (notatka zostaje)"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if note.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete file from this note"
        )

    if not note.file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note has no file attached"
        )

    if os.path.exists(note.file_path):
        os.remove(note.file_path)

    note.file_path = None
    note.updated_at = datetime.now()

    db.commit()
    db.refresh(note)

    return note


@router.get("/", response_model=PaginatedResponse[NoteListResponse])
async def get_notes(
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        subject: Optional[str] = None,
        user_id: Optional[int] = None,
        search: Optional[str] = None,
        has_file: Optional[bool] = None,
        sort_by: str = Query("created_at", regex="^(created_at|updated_at|average_rating|rating_count|title)$"),
        order: str = Query("desc", regex="^(asc|desc)$"),
        db: Session = Depends(get_db)
):
    """
    Pobierz listę notatek z filtrowaniem i paginacją

    - **page**: Numer strony
    - **page_size**: Rozmiar strony (max 100)
    - **subject**: Filtruj po przedmiocie
    - **user_id**: Filtruj po użytkowniku
    - **search**: Szukaj w tytule i treści
    - **has_file**: Filtruj notatki z/bez pliku
    - **sort_by**: Sortuj po: created_at, updated_at, average_rating, rating_count, title
    - **order**: asc lub desc
    """
    query = db.query(Note)

    if subject:
        query = query.filter(Note.subject == subject)

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


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
        note_id: int,
        db: Session = Depends(get_db)
):
    """Pobierz szczegóły notatki"""
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    return note


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
        note_id: int,
        title: Optional[str] = Form(None, max_length=255),
        content: Optional[str] = Form(None),
        subject: Optional[str] = Form(None, max_length=255),
        group_id: Optional[int] = Form(None),
        file: Optional[UploadFile] = File(None),
        remove_file: bool = Form(False),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Edytuj notatkę

    - **title**: Nowy tytuł (opcjonalne)
    - **content**: Nowa treść (opcjonalne)
    - **subject**: Nowy przedmiot (opcjonalne)
    - **group_id**: Nowe ID grupy (opcjonalne)
    - **file**: Nowy plik (opcjonalne)
    - **remove_file**: Usuń istniejący plik (opcjonalne)
    """
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

    if title is not None:
        note.title = title
    if content is not None:
        note.content = content
    if subject is not None:
        note.subject = subject
    if group_id is not None:
        note.group_id = group_id

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

    return {
        "note_id": note.note_id,
        "total_ratings": note.rating_count,
        "average_rating": note.average_rating,
        "total_saves": total_saves
    }


@router.get("/user/{user_id}", response_model=PaginatedResponse[NoteListResponse])
async def get_user_notes(
        user_id: int,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db)
):
    """Pobierz wszystkie notatki użytkownika"""
    query = db.query(Note).filter(Note.user_id == user_id).order_by(desc(Note.created_at))

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


@router.get("/subjects/list", response_model=list[str])
async def get_subjects(
        db: Session = Depends(get_db)
):
    """Pobierz listę wszystkich unikalnych przedmiotów"""
    subjects = db.query(Note.subject).filter(
        Note.subject.isnot(None)
    ).distinct().all()

    return [subject[0] for subject in subjects if subject[0]]

