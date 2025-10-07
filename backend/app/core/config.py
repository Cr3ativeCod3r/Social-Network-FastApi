import os
import sys

from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from pydantic import AnyHttpUrl, EmailStr, validator
from pydantic_settings import BaseSettings
from alembic import context

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))
sys.path.append(BASE_DIR)

class Settings(BaseSettings):
    DATABASE_URL: str  = os.getenv('DATABASE_URL')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SECRET_KEY: str = os.getenv('SECRET_KEY')

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

if __name__ == '__main__':
    print(settings.DATABASE_URL)