import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")


class Settings(BaseSettings):
    """Application settings loaded from environment variables or backend/.env file."""

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "VentureLens Backend"
    llm_mode: str = "mock"  # "mock" or "live"
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-3.5-flash-lite"
    host: str = "127.0.0.1"
    port: int = 8000


settings = Settings()
