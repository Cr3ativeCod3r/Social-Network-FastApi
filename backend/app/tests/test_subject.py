from fastapi.testclient import TestClient
from app.main import app
from app.db.base import SessionLocal
from app.models.subject import Subject
from app.models.user import User
from app.core.dependencies import get_current_admin_user

client = TestClient(app)

def test_create_subject_duplicate():
    db = SessionLocal()

    admin_user = db.query(User).filter(User.is_admin == True).first()
    assert admin_user, "Brak admina w bazie!"

    if not db.query(Subject).filter(Subject.name == "Matematyka").first():
        db.add(Subject(name="Matematyka"))
        db.commit()

    app.dependency_overrides[get_current_admin_user] = lambda: admin_user

    response = client.post("/api/v1/subjects/", json={"name": "Matematyka"})

    assert response.status_code == 400
    assert response.json()["detail"] == "Subject with this name already exists"

    app.dependency_overrides.clear()