# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENVIRONMENT: str = "development"
    PRODUCTION_DOMAIN: str = ""
    EXTRA_ALLOWED_ORIGINS: str = ""  # CSV string
    DATABASE_URL: str
    ALGORITHM: str = "HS256"
    ALLOWED_ORIGINS: str = ""        # CSV string (optional explicit override)

    def get_allowed_origins(self) -> List[str]:
        # If ALLOWED_ORIGINS is set, always take that (comma separated)
        if self.ALLOWED_ORIGINS:
            return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

        if self.ENVIRONMENT == "development":
            return [
                "http://localhost",
                "http://127.0.0.1",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",        # <— Vite
                "http://127.0.0.1:5173",        # <— Vite
            ]

        origins = []
        if self.PRODUCTION_DOMAIN:
            origins += [
                f"https://{self.PRODUCTION_DOMAIN}",
                f"https://www.{self.PRODUCTION_DOMAIN}",
            ]
        if self.EXTRA_ALLOWED_ORIGINS:
            origins += [o.strip() for o in self.EXTRA_ALLOWED_ORIGINS.split(",") if o.strip()]
        return origins

    class Config:
        env_file = ".env"

settings = Settings()
