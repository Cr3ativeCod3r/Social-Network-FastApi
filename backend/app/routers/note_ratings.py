from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..core.dependencies import get_current_user, get_current_active_user
from ..db.base import get_db
from ..models.user import User
from ..models.note import Note
from ..models.note_rating import NoteRating
from ..schemas import (
    NoteRatingCreate,
    NoteRatingResponse,
)

router = APIRouter()

@router.post("/{note_id}/rate", response_model=NoteRatingResponse)
async def rate_note(
        note_id: int,
        rating_data: NoteRatingCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Oceń notatkę (1-5 gwiazdek)

    - Jeśli użytkownik jeszcze nie ocenił - tworzy nową ocenę
    - Jeśli użytkownik już ocenił - aktualizuje istniejącą ocenę
    - Automatycznie przelicza średnią
    """
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    if note.user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie możesz ocenić własnej notatki"
        )

    existing_rating = db.query(NoteRating).filter(
        NoteRating.note_id == note_id,
        NoteRating.user_id == current_user.user_id
    ).first()

    if existing_rating:
        old_rating = existing_rating.rating
        existing_rating.rating = rating_data.rating
        db_rating = existing_rating
        action = "updated"
        print(
            f"[RATING] User {current_user.user_id} updated rating for note {note_id}: {old_rating} -> {rating_data.rating}")
    else:
        db_rating = NoteRating(
            note_id=note_id,
            user_id=current_user.user_id,
            rating=rating_data.rating
        )
        db.add(db_rating)
        action = "created"
        print(f"[RATING] User {current_user.user_id} rated note {note_id}: {rating_data.rating}")

    db.commit()

    update_note_rating_stats(db, note_id)

    db.refresh(db_rating)

    return {
        "note_id": db_rating.note_id,
        "user_id": db_rating.user_id,
        "rating": db_rating.rating,
        "rated_at": db_rating.rated_at
    }


@router.delete("/{note_id}/rate", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note_rating(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Usuń swoją ocenę notatki (opcjonalne - jeśli chcesz pozwolić użytkownikom usuwać oceny)
    """
    rating = db.query(NoteRating).filter(
        NoteRating.note_id == note_id,
        NoteRating.user_id == current_user.user_id
    ).first()

    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating not found"
        )

    db.delete(rating)
    db.commit()

    update_note_rating_stats(db, note_id)

    print(f"[RATING] User {current_user.user_id} deleted rating for note {note_id}")

    return None


@router.get("/{note_id}/my-rating")
async def get_my_note_rating(
        note_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Pobierz swoją ocenę notatki

    Zwraca null jeśli nie oceniłeś tej notatki
    """
    rating = db.query(NoteRating).filter(
        NoteRating.note_id == note_id,
        NoteRating.user_id == current_user.user_id
    ).first()

    if not rating:
        return {"rating": None}

    return {
        "rating": rating.rating,
        "rated_at": rating.rated_at
    }


@router.get("/{note_id}/ratings")
async def get_note_ratings(
        note_id: int,
        db: Session = Depends(get_db)
):
    """
    Pobierz statystyki ocen notatki (publiczne)

    Zwraca:
    - Średnią ocenę
    - Liczbę ocen
    - Rozkład ocen (ile osób dało 1, 2, 3, 4, 5 gwiazdek)
    """
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    ratings = db.query(NoteRating).filter(NoteRating.note_id == note_id).all()

    rating_distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    }

    for rating in ratings:
        rating_distribution[str(rating.rating)] += 1

    total_ratings = len(ratings)
    rating_percentages = {}
    if total_ratings > 0:
        for rating_value, count in rating_distribution.items():
            rating_percentages[rating_value] = round((count / total_ratings) * 100, 1)
    else:
        rating_percentages = {str(i): 0.0 for i in range(1, 6)}

    return {
        "note_id": note_id,
        "average_rating": float(note.average_rating) if note.average_rating else None,
        "total_ratings": note.rating_count,
        "rating_distribution": rating_distribution,
        "rating_percentages": rating_percentages
    }


def update_note_rating_stats(db: Session, note_id: int):
    """
    Helper function do przeliczania statystyk ocen
    """
    stats = db.query(
        func.avg(NoteRating.rating).label('avg_rating'),
        func.count(NoteRating.rating).label('count_rating')
    ).filter(NoteRating.note_id == note_id).first()

    note = db.query(Note).filter(Note.note_id == note_id).first()
    if note:
        note.average_rating = stats.avg_rating
        note.rating_count = stats.count_rating if stats.count_rating else 0
        db.commit()

        print(f"[RATING STATS] Note {note_id}: avg={note.average_rating}, count={note.rating_count}")