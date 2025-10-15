# app/main.py

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from .routers import api
from .db.init_db import init_db
from .db.base import SessionLocal
from .core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from .routers import websocket


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle events - uruchamiane przy starcie i zatrzymaniu aplikacji
    """
    db = SessionLocal()
    try:
        logger.info(" Inicjalizacja bazy danych...")
        init_db(db)
    except Exception as e:
        logger.error(f" Błąd inicjalizacji bazy danych: {e}")
    finally:
        db.close()
    yield


app = FastAPI(title="FastAPI Auth",
              lifespan=lifespan)
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)

app.include_router(api.api_router, prefix=settings.API_V1_STR)
app.include_router(websocket.router, tags=["websocket"])


@app.get("/api")
def root():
    return {
        "message": "API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}