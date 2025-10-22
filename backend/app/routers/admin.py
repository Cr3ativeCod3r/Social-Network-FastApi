from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc
from datetime import datetime, timedelta
from typing import Optional
import math
import os

from ..schemas import user
from ..schemas.admin import AdminNoteListResponse, AdminStatistics
from ..db.base import get_db
from ..core.dependencies import get_current_admin_user
from ..models.user import User
from ..models.note import Note
from ..models.note_rating import NoteRating
from ..models.saved_note import SavedNote
from ..models.report import Report

router = APIRouter()

@router.get("/users", response_model=user.UserListResponse)
def get_all_users(
        page: int = Query(1, ge=1, description="Numer strony"),
        page_size: int = Query(20, ge=1, le=100, description="Rozmiar strony"),
        search: Optional[str] = Query(None, description="Wyszukaj po email, imieniu lub nazwisku"),
        is_banned: Optional[bool] = Query(None, description="Filtruj po statusie bana"),
        is_verified: Optional[bool] = Query(None, description="Filtruj po weryfikacji"),
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Pobierz listę wszystkich użytkowników z paginacją i filtrowaniem
    """
    query = db.query(User)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                User.email.ilike(search_filter),
                User.first_name.ilike(search_filter),
                User.last_name.ilike(search_filter)
            )
        )

    if is_banned is not None:
        query = query.filter(User.is_banned == is_banned)

    if is_verified is not None:
        query = query.filter(User.is_verified == is_verified)

    total = query.count()

    skip = (page - 1) * page_size
    users = query.offset(skip).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "users": users
    }


@router.get("/users/{user_id}", response_model=user.UserAdminResponse)
def get_user_details(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Pobierz szczegółowe informacje o użytkowniku
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )
    return user


@router.post("/users/{user_id}/ban")
def ban_user(
        user_id: int,
        ban_data: user.UserBan,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Zbanuj użytkownika na określony czas lub permanentnie
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.user_id == current_admin.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie możesz zbanować samego siebie"
        )

    if user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie możesz zbanować administratora"
        )

    user.is_banned = True
    user.ban_reason = ban_data.reason

    if ban_data.duration_days:
        user.ban_expires_at = datetime.utcnow() + timedelta(days=ban_data.duration_days)
    else:
        user.ban_expires_at = None

    db.commit()
    db.refresh(user)

    return {
        "message": f"Użytkownik {user.email} został zbanowany",
        "user_id": user.user_id,
        "ban_expires_at": user.ban_expires_at,
        "is_permanent": user.ban_expires_at is None
    }


@router.post("/users/{user_id}/unban")
def unban_user(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Odbanuj użytkownika
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if not user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik nie jest zbanowany"
        )

    user.is_banned = False
    user.ban_expires_at = None
    user.ban_reason = None

    db.commit()
    db.refresh(user)

    return {
        "message": f"Użytkownik {user.email} został odbanowany",
        "user_id": user.user_id
    }


@router.patch("/users/{user_id}/permissions")
def update_user_permissions(
        user_id: int,
        permissions: user.UserPermissionUpdate,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Zaktualizuj uprawnienia użytkownika (chat, komentarze, posty)
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.user_id == current_admin.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie możesz zmieniać własnych uprawnień"
        )

    update_data = permissions.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {
        "message": "Uprawnienia użytkownika zostały zaktualizowane",
        "user_id": user.user_id,
        "permissions": {
            "comment_permission": user.comment_permission,
            "post_permission": user.post_permission,
            "chat_permission": user.chat_permission
        }
    }


@router.patch("/users/{user_id}/verify")
def verify_user(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Zweryfikuj użytkownika
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik jest już zweryfikowany"
        )

    user.is_verified = True
    db.commit()
    db.refresh(user)

    return {
        "message": f"Użytkownik {user.email} został zweryfikowany",
        "user_id": user.user_id
    }


@router.patch("/users/{user_id}/make-admin")
def make_user_admin(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Nadaj użytkownikowi uprawnienia administratora
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik jest już administratorem"
        )

    user.is_admin = True
    db.commit()
    db.refresh(user)

    return {
        "message": f"Użytkownik {user.email} został administratorem",
        "user_id": user.user_id
    }


@router.patch("/users/{user_id}/remove-admin")
def remove_admin_rights(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Odbierz użytkownikowi uprawnienia administratora
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.user_id == current_admin.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie możesz odebrać sobie uprawnień administratora"
        )

    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik nie jest administratorem"
        )

    user.is_admin = False
    db.commit()
    db.refresh(user)

    return {
        "message": f"Użytkownikowi {user.email} odebrano uprawnienia administratora",
        "user_id": user.user_id
    }


@router.delete("/users/{user_id}")
def delete_user(
        user_id: int,
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Usuń użytkownika
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Użytkownik nie znaleziony"
        )

    if user.user_id == current_admin.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nie możesz usunąć samego siebie"
        )

    email = user.email
    db.delete(user)
    db.commit()

    return {
        "message": f"Użytkownik {email} został usunięty",
        "user_id": user_id
    }


@router.get("/stats")
def get_admin_stats(
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Pobierz statystyki systemu
    """
    total_users = db.query(func.count(User.user_id)).scalar()
    verified_users = db.query(func.count(User.user_id)).filter(User.is_verified == True).scalar()
    banned_users = db.query(func.count(User.user_id)).filter(User.is_banned == True).scalar()
    admin_users = db.query(func.count(User.user_id)).filter(User.is_admin == True).scalar()

    users_without_chat = db.query(func.count(User.user_id)).filter(User.chat_permission == False).scalar()
    users_without_comments = db.query(func.count(User.user_id)).filter(User.comment_permission == False).scalar()
    users_without_posts = db.query(func.count(User.user_id)).filter(User.post_permission == False).scalar()

    total_notes = db.query(func.count(Note.note_id)).scalar()
    total_ratings = db.query(func.count(NoteRating.note_id)).scalar()
    total_saved_notes = db.query(func.count(SavedNote.user_id)).scalar()

    total_reports = db.query(func.count(Report.report_id)).scalar()
    total_resolved_reports = db.query(func.count(Report.report_id)).filter(Report.status == "resolved").scalar()
    total_in_progress_reports = db.query(func.count(Report.report_id)).filter(Report.status == "in_progress").scalar()
    total_pending_reports = db.query(func.count(Report.report_id)).filter(Report.status == "pending").scalar()
    total_rejected_reports = db.query(func.count(Report.report_id)).filter(Report.status == "rejected").scalar()


    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "banned_users": banned_users,
        "admin_users": admin_users,
        "users_with_restrictions": {
            "without_chat": users_without_chat,
            "without_comments": users_without_comments,
            "without_posts": users_without_posts
        },
        "notes_stats": {
            "total_notes": total_notes,
            "total_ratings": total_ratings,
            "total_saved_notes": total_saved_notes
        },
        "reports_stats":{
            "total_reports": total_reports,
            "total_resolved_reports": total_resolved_reports,
            "total_in_progress_reports": total_in_progress_reports,
            "total_pending_reports": total_pending_reports,
            "total_rejected_reports": total_rejected_reports,
        }
    }


@router.get("/notes/stats", response_model=AdminStatistics)
def get_notes_statistics(
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    Pobierz statystyki notatek
    """
    total_notes = db.query(func.count(Note.note_id)).scalar()
    notes_with_files = db.query(func.count(Note.note_id)).filter(Note.file_path.isnot(None)).scalar()
    total_ratings = db.query(func.count(NoteRating.note_id)).scalar()
    total_saved = db.query(func.count(SavedNote.user_id)).scalar()
    avg_rating = db.query(func.avg(Note.average_rating)).scalar()


    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    notes_last_30_days = db.query(func.count(Note.note_id)).filter(
        Note.created_at >= thirty_days_ago
    ).scalar()

    return {
        "total_notes": total_notes,
        "notes_with_files": notes_with_files,
        "notes_without_files": total_notes - notes_with_files,
        "total_ratings": total_ratings,
        "total_saved": total_saved,
        "average_rating": float(avg_rating) if avg_rating else 0.0,
        "notes_last_30_days": notes_last_30_days
    }

@router.delete("/notes/{note_id}")
def delete_note(
        note_id: int,
        reason: Optional[str] = Query(None, max_length=500, description="Powód usunięcia"),
        current_admin: User = Depends(get_current_admin_user),
        db: Session = Depends(get_db)
):
    """
    """
    note = db.query(Note).filter(Note.note_id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notatka nie znaleziona"
        )

    print(
        f"[ADMIN DELETE] Admin {current_admin.email} (ID: {current_admin.user_id}) usunął notatkę {note_id}. Powód: {reason or 'Brak powodu'}")

    if note.file_path and os.path.exists(note.file_path):
        try:
            os.remove(note.file_path)
            print(f"[ADMIN DELETE] Plik usunięty: {note.file_path}")
        except Exception as e:
            print(f"[ADMIN DELETE] Błąd usuwania pliku: {e}")

    note_title = note.title
    db.delete(note)
    db.commit()

    return {
        "message": f"Notatka '{note_title}' została usunięta",
        "note_id": note_id,
        "reason": reason
    }