from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas import user
from ..db.base import get_db
from ..models.user import User
from ..core.security import create_access_token, verify_password, get_password_hash
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()
@router.post("/register", response_model=user.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: user.UserRegister, db: Session = Depends(get_db)):
    """
    Rejestracja nowego użytkownika
    """

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik z tym adresem email już istnieje"
        )

    hashed_password = get_password_hash(user_data.password)

    db_user = User(
        email=user_data.email,
        password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        university=user_data.university,
        department=user_data.department,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=user.TokenResponse)
def login(credentials: user.UserLogin, db: Session = Depends(get_db)):
    """
    Logowanie użytkownika
    """
    user_obj = db.query(User).filter(User.email == credentials.email).first()
    
    if not user_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(credentials.password, user_obj.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nieprawidłowy email lub hasło",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user_obj.is_banned:
        if user_obj.ban_expires_at and user_obj.ban_expires_at.astimezone() < datetime.now().astimezone():
            user_obj.is_banned = False
            user_obj.ban_expires_at = None
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Twoje konto zostało zablokowane"
            )
    
    access_token = create_access_token(subject=user_obj.user_id)
    
    response = JSONResponse(
        content={
            "token_type": "bearer",
            "user": jsonable_encoder(user_obj) 
        }
    )
    
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=True,  
        samesite="None",
        max_age=3600 * 24 * 7
    )
    
    return response