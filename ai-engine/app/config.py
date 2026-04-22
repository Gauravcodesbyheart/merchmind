from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "MerchMind AI Engine"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5000"]
    DATABASE_URL: str = "postgresql://merchmind:password@localhost:5432/merchmind"
    MONGODB_URL: str = "mongodb://localhost:27017/merchmind"
    REDIS_URL: str = "redis://localhost:6379"
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    OPENAI_API_KEY: str = ""  # Optional — LangChain can use local models
    MODEL_CACHE_DIR: str = "./models"

    class Config:
        env_file = ".env"

settings = Settings()
