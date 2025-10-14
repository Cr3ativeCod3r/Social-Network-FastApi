from fastapi import Depends, HTTPException, status, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from .config import settings
from ..db.base import get_db
from ..models.user import User

security = HTTPBearer()

ALGORITHM = "HS256"


def get_token_from_cookie(token: Optional[str] = Cookie(None)) -> str:
    """
    Pobierz token JWT z HttpOnly cookie
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nie znaleziono tokena",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


def get_current_user(
        token: str = Depends(get_token_from_cookie),
        db: Session = Depends(get_db)
) -> User:
    """
    Pobierz aktualnie zalogowanego użytkownika z tokena JWT w cookie
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nie można zweryfikować danych uwierzytelniających",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.user_id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    if user.is_banned:
        if user.ban_expires_at and user.ban_expires_at < datetime.now():
            user.is_banned = False
            user.ban_expires_at = None
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Twoje konto zostało zablokowane"
            )

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Sprawdź czy użytkownik jest aktywny i zweryfikowany
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Twoje konto nie zostało zweryfikowane"
        )
    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Sprawdź czy użytkownik jest administratorem
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie masz uprawnień administratora"
        )
    return current_user


def verify_ws_token(token: str, db: Session) -> User:
    return token