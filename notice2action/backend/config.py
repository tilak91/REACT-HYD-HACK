import os
from pydantic_settings import BaseSettings
from typing import Optional

# Resolve .env path — check backend dir first, then parent dir
_backend_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_backend_dir)
_env_path = os.path.join(_backend_dir, ".env")
if not os.path.exists(_env_path):
    _env_path = os.path.join(_parent_dir, ".env")


class Settings(BaseSettings):
    # Gemini API Configuration
    gemini_api_key: str = ""
    gemma_model: str = "gemini-1.5-flash"  # Default, will be overridden by env var

    # Groq API Configuration
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-70b-versatile"  # Default Groq model

    # Server Configuration
    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    # File Upload Configuration
    max_upload_size_mb: int = 10
    allowed_mime_types: list = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"]

    # API Configuration
    api_timeout_seconds: int = 60

    class Config:
        env_file = _env_path
        env_file_encoding = "utf-8"
        extra = "ignore"



def get_settings() -> Settings:
    """Get application settings."""
    s = Settings()
    print(f"[Config] Loaded .env from: {_env_path}")
    print(f"[Config] GEMINI_API_KEY present: {bool(s.gemini_api_key and s.gemini_api_key not in ('your_gemini_key','your_key_here',''))}")
    print(f"[Config] GROQ_API_KEY present: {bool(s.groq_api_key and s.groq_api_key not in ('your_groq_key',''))}")
    print(f"[Config] GEMMA_MODEL: {s.gemma_model}")
    print(f"[Config] GROQ_MODEL: {s.groq_model}")
    return s