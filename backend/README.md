# Backend Setup Instructions
```
docker-compose up -d
docker-compose exec app bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```
# api endpoint w docs
http://127.0.0.1:8000/docs
