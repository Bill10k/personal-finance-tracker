from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENVIRONMENT: str = "development"
    PRODUCTION_DOMAIN: str = ""
    EXTRA_ALLOWED_ORIGINS: str = ""
    
    def get_allowed_origins(self) -> List[str]:
        if self.ENVIRONMENT == "development":
            return [
                "http://localhost",
                "http://localhost:3000",
                "http://127.0.0.1",
                "http://127.0.0.1:3000",
            ]
        
        origins = [
            f"https://{self.PRODUCTION_DOMAIN}",
            f"https://www.{self.PRODUCTION_DOMAIN}",
        ]
        if self.EXTRA_ALLOWED_ORIGINS:
            origins.extend(origin.strip() for origin in self.EXTRA_ALLOWED_ORIGINS.split(","))
        return origins

    class Config:
        env_file = ".env"

settings = Settings()