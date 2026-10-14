import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Smart Inventory & Procurement Optimizer AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smart-inventory-super-secret-key-2026-softcomputing-aiml")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: SQLite fallback for instant zero-config setup, or PostgreSQL if configured
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'inventory_ai.db'))}"
    )

settings = Settings()
