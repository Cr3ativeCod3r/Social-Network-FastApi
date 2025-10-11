from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from .routers import auth, users,admin,notes,saved_notes,note_ratings,note_comments
from .db.init_db import init_db
from .db.base import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

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
    "http://127.0.0.1:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,       
    allow_methods=["*"],          
    allow_headers=["*"], 
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(notes.router)
app.include_router(saved_notes.router)
app.include_router(note_ratings.router)
app.include_router(note_comments.router)

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