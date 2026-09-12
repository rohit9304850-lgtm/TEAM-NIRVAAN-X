from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SWARMIQ — Autonomous Market Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    DEMO_MODE: bool = True
    OPENAI_API_KEY: Optional[str] = None
    DATABASE_URL: str = "sqlite+aiosqlite:///./swarmiq.db"
    GLOBAL_SEED: int = 42
    DEFAULT_POPULATION_SIZE: int = 10000
    DATASET_PATH: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "..", "data", "demo", "indian_urban_consumer_2024.json"
    )
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
