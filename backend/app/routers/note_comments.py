from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
import math

from ..core.dependencies import get_current_user, get_current_active_user
from ..db.base import get_db
from ..models.user import User
from ..models.note import Note
from ..models.note_comment import NoteComment
from ..schemas.note_comment import (
    NoteCommentCreate,
    NoteCommentUpdate,
    NoteCommentResponse,
    CommentAuthor,
)
from ..schemas import PaginatedResponse

router = APIRouter()

@router.post("/{note_id}/comments", response_model=NoteCommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
        note_id: int,
        comment: NoteCommentCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Dodaj komentarz do notatki

    Wymaga uprawnień comment_permission
    """
    if not current_user.comment_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to comment"
        )

    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    db_comment = NoteComment(
        note_id=note_id,
        user_id=current_user.user_id,
        content=comment.content
    )

    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    return NoteCommentResponse(
        comment_id=db_comment.comment_id,
        note_id=db_comment.note_id,
        user_id=db_comment.user_id,
        content=db_comment.content,
        created_at=db_comment.created_at,
        author=CommentAuthor(
            user_id=current_user.user_id,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            profile_picture=current_user.profile_picture
        ),
        is_author=True
    )


@router.get("/{note_id}/comments", response_model=PaginatedResponse[NoteCommentResponse])
async def get_note_comments(
        note_id: int,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        sort_order: str = Query("desc", regex="^(asc|desc)$", description="asc = oldest first, desc = newest first"),
        db: Session = Depends(get_db),
        current_user: Optional[User] =  Depends(get_current_user)
):
    """
    Pobierz komentarze do notatki

    Publiczny endpoint - nie wymaga logowania
    """
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    query = db.query(
        NoteComment.comment_id,
        NoteComment.note_id,
        NoteComment.user_id,
        NoteComment.content,
        NoteComment.created_at,
        User.first_name,
        User.last_name,
        User.profile_picture
    ).join(User, NoteComment.user_id == User.user_id).filter(
        NoteComment.note_id == note_id
    )

    if sort_order == "desc":
        query = query.order_by(desc(NoteComment.created_at))
    else:
        query = query.order_by(NoteComment.created_at)

    total = query.count()
    total_pages = math.ceil(total / page_size)

    results = query.offset((page - 1) * page_size).limit(page_size).all()

    current_user_id = current_user.user_id if current_user else None

    items = [
        NoteCommentResponse(
            comment_id=row.comment_id,
            note_id=row.note_id,
            user_id=row.user_id,
            content=row.content,
            created_at=row.created_at,
            author=CommentAuthor(
                user_id=row.user_id,
                first_name=row.first_name,
                last_name=row.last_name,
                profile_picture=row.profile_picture
            ),
            is_author=(row.user_id == current_user_id) if current_user_id else False
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


@router.get("/{note_id}/comments/{comment_id}", response_model=NoteCommentResponse)
async def get_comment(
        note_id: int,
        comment_id: int,
        db: Session = Depends(get_db),
        current_user: Optional[User] = Depends(get_current_user)
):
    """
    Pobierz pojedynczy komentarz
    """
    result = db.query(
        NoteComment.comment_id,
        NoteComment.note_id,
        NoteComment.user_id,
        NoteComment.content,
        NoteComment.created_at,
        User.first_name,
        User.last_name,
        User.profile_picture
    ).join(User, NoteComment.user_id == User.user_id).filter(
        NoteComment.note_id == note_id,
        NoteComment.comment_id == comment_id
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    current_user_id = current_user.user_id if current_user else None

    return NoteCommentResponse(
        comment_id=result.comment_id,
        note_id=result.note_id,
        user_id=result.user_id,
        content=result.content,
        created_at=result.created_at,
        author=CommentAuthor(
            user_id=result.user_id,
            first_name=result.first_name,
            last_name=result.last_name,
            profile_picture=result.profile_picture
        ),
        is_author=(result.user_id == current_user_id) if current_user_id else False
    )


@router.put("/{note_id}/comments/{comment_id}", response_model=NoteCommentResponse)
async def update_comment(
        note_id: int,
        comment_id: int,
        comment_update: NoteCommentUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Edytuj swój komentarz

    Tylko autor może edytować swój komentarz
    """
    comment = db.query(NoteComment).filter(
        NoteComment.comment_id == comment_id,
        NoteComment.note_id == note_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    if comment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own comments"
        )

    comment.content = comment_update.content
    db.commit()
    db.refresh(comment)

    return NoteCommentResponse(
        comment_id=comment.comment_id,
        note_id=comment.note_id,
        user_id=comment.user_id,
        content=comment.content,
        created_at=comment.created_at,
        author=CommentAuthor(
            user_id=current_user.user_id,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            profile_picture=current_user.profile_picture
        ),
        is_author=True
    )


@router.delete("/{note_id}/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
        note_id: int,
        comment_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Usuń komentarz

    Autor może usunąć swój komentarz, admin może usunąć każdy komentarz
    """
    comment = db.query(NoteComment).filter(
        NoteComment.comment_id == comment_id,
        NoteComment.note_id == note_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    if comment.user_id != current_user.user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments"
        )

    db.delete(comment)
    db.commit()

    return None


@router.get("/{note_id}/comments/count")
async def get_comments_count(
        note_id: int,
        db: Session = Depends(get_db)
):
    """
    Pobierz liczbę komentarzy pod notatką
    """
    note = db.query(Note).filter(Note.note_id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )

    count = db.query(NoteComment).filter(NoteComment.note_id == note_id).count()

    return {
        "note_id": note_id,
        "comments_count": count
    }