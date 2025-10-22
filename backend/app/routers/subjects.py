from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..core.dependencies import get_current_user, get_current_admin_user
from ..db.base import get_db
from ..models.subject import Subject as SubjectModel
from ..models.user import User
from ..models.note import Note

from ..schemas import (
    Subject,
    SubjectResponse,
    SubjectList
)

router = APIRouter()

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
        subject: Subject,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_admin_user)
):
    """Utwórz nowy przedmiot (admin only)"""
    existing_subject = db.query(SubjectModel).filter(
        func.lower(SubjectModel.name) == subject.name.lower()
    ).first()
    if existing_subject:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject with this name already exists"
        )

    db_subject = SubjectModel(
        name=subject.name,
    )

    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)

    return db_subject

@router.get("/", response_model=SubjectList)
async def list_subjects(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Pobierz listę wszystkich przedmiotów"""
    subjects = db.query(SubjectModel).all()
    return SubjectList(
        subjects=subjects,
        total=len(subjects)
    )

@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(
        subject_id: int,
        subject: Subject,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_admin_user)
):
    """Zaktualizuj przedmiot (admin only)"""
    db_subject = db.query(SubjectModel).filter(SubjectModel.subject_id == subject_id).first()
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )

    existing_subject = db.query(SubjectModel).filter(
        func.lower(SubjectModel.name) == subject.name.lower(),
        SubjectModel.subject_id != subject_id
    ).first()
    if existing_subject:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Przedmiot o takiej nazwie już istnieje"
        )

    db_subject.name = subject.name

    db.commit()
    db.refresh(db_subject)

    return db_subject


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
        subject_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Usuń przedmiot

    Tylko administratorzy mogą usuwać przedmioty.
    Notatki przypisane do przedmiotu będą miały subject_id ustawione na NULL.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete subjects"
        )

    subject = db.query(SubjectModel).filter(SubjectModel.subject_id == subject_id).first()

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )

    notes_count = db.query(func.count(Note.note_id)).filter(
        Note.subject_id == subject_id
    ).scalar()

    if notes_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Nie można usunąc przedmiotu z notatkami: {notes_count}  "
        )

    db.delete(subject)
    db.commit()

    return None