import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AI_API_KEY: str = os.getenv("AI_API_KEY", "catcham_ai_internal_token")
    CATCHAM_API_BASE: str = os.getenv("CATCHAM_API_BASE", "http://localhost:4000/api/v1")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        env_file = ".env"

settings = Settings()
