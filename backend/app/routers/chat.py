from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Query,
)
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, List
from datetime import datetime
from .websocket import manager

from ..core.dependencies import get_current_user
from ..db.base import get_db
from ..models.user import User
from ..models.chat_message import ChatMessage
from ..schemas.chat_message import (
    ChatMessageCreate,
    ChatMessageUpdate,
    ChatMessageResponse,
    MessageAuthor,
    ChatStats,
)


router = APIRouter()


@router.post(
    "/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED
)
async def send_message(
    message: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.chat_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie masz uprawnień do korzystania z czatu",
        )

    db_message = ChatMessage(user_id=current_user.user_id, content=message.content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    response = ChatMessageResponse(
        message_id=db_message.message_id,
        user_id=db_message.user_id,
        content=db_message.content,
        created_at=db_message.created_at,
        is_edited=db_message.is_edited,
        author=MessageAuthor(
            user_id=current_user.user_id,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            is_admin=current_user.is_admin,
        ),
        is_author=True,
    )

    await manager.broadcast(
        {"type": "new_message", "data": response.model_dump(mode="json")}
    )

    return response


@router.get("/messages", response_model=List[ChatMessageResponse])
async def get_messages(
        limit: int = Query(50, ge=1, le=100, description="Liczba wiadomości do pobrania"),
        before_message_id: Optional[int] = Query(None,
                                                 description="Pobierz wiadomości przed tym ID (dla infinite scroll)"),
        db: Session = Depends(get_db),
        current_user: Optional[User] = Depends(get_current_user)
):
    """
    Pobierz wiadomości z chatu (infinite scroll)

    - limit: liczba wiadomości do pobrania (domyślnie 50)
    - before_message_id: pobierz wiadomości starsze niż ta wiadomość (dla scroll w górę)

    Wiadomości są zwracane od najstarszej do najnowszej w zakresie.
    Przy pierwszym załadowaniu (bez before_message_id) zwraca najnowsze wiadomości.
    """
    query = db.query(
        ChatMessage.message_id,
        ChatMessage.user_id,
        ChatMessage.content,
        ChatMessage.created_at,
        ChatMessage.is_edited,
        User.first_name,
        User.last_name,
        User.is_admin
    ).join(User, ChatMessage.user_id == User.user_id)

    if before_message_id:
        query = query.filter(ChatMessage.message_id < before_message_id)

    query = query.order_by(desc(ChatMessage.created_at))
    results = query.limit(limit).all()

    results = list(reversed(results))

    current_user_id = current_user.user_id if current_user else None

    items = [
        ChatMessageResponse(
            message_id=row.message_id,
            user_id=row.user_id,
            content=row.content,
            created_at=row.created_at,
            is_edited=row.is_edited,
            author=MessageAuthor(
                user_id=row.user_id,
                first_name=row.first_name,
                last_name=row.last_name,
                is_admin=row.is_admin
            ),
            is_author=(row.user_id == current_user_id) if current_user_id else False
        )
        for row in results
    ]

    return items



@router.put("/messages/{message_id}", response_model=ChatMessageResponse)
async def update_message(
    message_id: int,
    message_update: ChatMessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Edytuj swoją wiadomość

    Tylko autor może edytować swoją wiadomość
    """
    message = db.query(ChatMessage).filter(ChatMessage.message_id == message_id).first()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )

    if message.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own messages",
        )

    message.content = message_update.content
    message.is_edited = True
    db.commit()
    db.refresh(message)

    response = ChatMessageResponse(
        message_id=message.message_id,
        user_id=message.user_id,
        content=message.content,
        created_at=message.created_at,
        is_edited=message.is_edited,
        author=MessageAuthor(
            user_id=current_user.user_id,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            is_admin=current_user.is_admin,
        ),
        is_author=True,
    )

    await manager.broadcast(
        {"type": "message_edited", "data": response.model_dump(mode="json")}
    )

    return response


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Usuń wiadomość

    Autor może usunąć swoją wiadomość, admin może usunąć każdą wiadomość
    """
    message = db.query(ChatMessage).filter(ChatMessage.message_id == message_id).first()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )

    if message.user_id != current_user.user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own messages",
        )

    message_id_to_delete = message.message_id
    db.delete(message)
    db.commit()

    await manager.broadcast(
        {"type": "message_deleted", "message_id": message_id_to_delete}
    )

    return None


@router.get("/stats", response_model=ChatStats)
async def get_chat_stats(db: Session = Depends(get_db)):
    """
    Pobierz statystyki chatu
    """

    active_users = db.query(func.count(func.distinct(ChatMessage.user_id))).scalar()

    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    messages_today = (
        db.query(func.count(ChatMessage.message_id))
        .filter(ChatMessage.created_at >= today)
        .scalar()
    )

    return {"active_users": active_users, "messages_today": messages_today}


