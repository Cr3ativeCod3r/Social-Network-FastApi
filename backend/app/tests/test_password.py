from fastapi.testclient import TestClient
from app.main import app
from app.db.base import SessionLocal
from app.models.user import User
from app.schemas.user import UserPasswordChange
from app.core.dependencies import get_current_user

client = TestClient(app)


def test_change_password_incorrect_old():
    """Test: próba zmiany hasła z niepoprawnym starym hasłem"""
    db = SessionLocal()
    admin_user = db.query(User).filter(User.is_admin == True).first()
    assert admin_user is not None, "Brak użytkownika admina w bazie!"

    app.dependency_overrides[get_current_user] = lambda: admin_user

    payload = {
        "old_password": "wrongOldPass1",
        "new_password": "NewPassword1"
    }

    response = client.post("/api/v1/users/me/change-password", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Nieprawidłowe stare hasło"

    app.dependency_overrides.clear()


def test_change_password_same_as_old():
    """Test: próba zmiany hasła na takie samo jak stare"""
    db = SessionLocal()
    admin_user = db.query(User).filter(User.is_admin == True).first()
    assert admin_user is not None

    app.dependency_overrides[get_current_user] = lambda: admin_user

    payload = {
        "old_password": "Admin1234",
        "new_password": "Admin1234"
    }

    response = client.post("/api/v1/users/me/change-password", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Nowe hasło musi być inne niż stare"

    app.dependency_overrides.clear()