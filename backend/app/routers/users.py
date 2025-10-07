from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException

from ..schemas import user
from ..db.base import get_db
from ..core.dependencies import get_current_user, get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=user.UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Pobierz informacje o zalogowanym użytkowniku
    """
    return current_user


@router.patch("/me", response_model=user.UserResponse)
def update_profile(
        user_data: user.UserUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Aktualizuj profil zalogowanego użytkownika
    """
    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=user.UserPublicProfile)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Pobierz publiczny profil użytkownika
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")
    return user