from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Iterable, Optional


BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_DIR.parent


def _load_env_file(path: Path) -> None:
    """Tiny .env loader to avoid an extra runtime dependency."""
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_env_file(PROJECT_ROOT / ".env")
_load_env_file(BACKEND_DIR / ".env")


def _get_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


def _get_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return int(value)


def _get_float(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return float(value)


def _split_csv(value: Optional[str], default: Iterable[str]) -> list[str]:
    if not value:
        return list(default)
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    app_name: str
    environment: str
    database_url: str
    frontend_url: str
    backend_url: str
    cors_origins: list[str]
    jwt_secret: str
    jwt_issuer: str
    jwt_expire_minutes: int
    cookie_name: str
    cookie_secure: bool
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str
    enable_dev_login: bool
    anthropic_api_key: str
    anthropic_model: str
    anthropic_version: str
    anthropic_timeout_seconds: float

    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "Today Gift API")
        self.environment = os.getenv("ENVIRONMENT", "local").lower()
        self.database_url = os.getenv(
            "DATABASE_URL",
            "mysql+pymysql://today_gift:today_gift@127.0.0.1:3306/today_gift",
        )
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")
        self.cors_origins = _split_csv(
            os.getenv("CORS_ORIGINS"),
            ["http://localhost:3000", "http://127.0.0.1:3000"],
        )
        self.jwt_secret = os.getenv("JWT_SECRET", "dev-only-change-me")
        self.jwt_issuer = os.getenv("JWT_ISSUER", "today-gift-api")
        self.jwt_expire_minutes = _get_int("JWT_EXPIRE_MINUTES", 60 * 24 * 7)
        self.cookie_name = os.getenv("COOKIE_NAME", "today_gift_token")
        self.cookie_secure = _get_bool("COOKIE_SECURE", False)
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "")
        self.google_redirect_uri = os.getenv(
            "GOOGLE_REDIRECT_URI", f"{self.backend_url}/auth/google/callback"
        )
        self.enable_dev_login = _get_bool(
            "ENABLE_DEV_LOGIN", self.environment in {"local", "development", "test"}
        )
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.anthropic_model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
        self.anthropic_version = os.getenv("ANTHROPIC_VERSION", "2023-06-01")
        self.anthropic_timeout_seconds = _get_float("ANTHROPIC_TIMEOUT_SECONDS", 12.0)

    @property
    def is_local(self) -> bool:
        return self.environment in {"local", "development", "test"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
