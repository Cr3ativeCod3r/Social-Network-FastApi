from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import get_password_hash
from ..core.config import settings



def init_db(db: Session) -> None:
    """
    Inicjalizacja bazy danych - stwórz domyślnego admina jeśli nie istnieje
    """
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()

        if not admin:

            admin = User(
                email=settings.ADMIN_EMAIL,
                password=get_password_hash(settings.ADMIN_PASSWORD),
                first_name='admin',
                last_name='system',
                is_admin=True,
                is_verified=True,
                comment_permission=True,
                post_permission=True,
                chat_permission=True
            )

            db.add(admin)
            db.commit()
            db.refresh(admin)

    except Exception as e:
        db.rollback()
        raise