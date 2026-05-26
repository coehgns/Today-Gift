from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any, Optional, Union

from app.core.config import get_settings


class TokenError(ValueError):
    pass


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _sign(message: str, secret: str) -> str:
    digest = hmac.new(secret.encode("utf-8"), message.encode("ascii"), hashlib.sha256).digest()
    return _b64url_encode(digest)


def create_access_token(subject: Union[str, int], extra: Optional[dict[str, Any]] = None) -> str:
    settings = get_settings()
    now = int(time.time())
    payload: dict[str, Any] = {
        "sub": str(subject),
        "iat": now,
        "exp": now + settings.jwt_expire_minutes * 60,
        "iss": settings.jwt_issuer,
    }
    if extra:
        payload.update(extra)
    header = {"alg": "HS256", "typ": "JWT"}
    header_part = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_part = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_part}.{payload_part}"
    signature = _sign(signing_input, settings.jwt_secret)
    return f"{signing_input}.{signature}"


def verify_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        header_part, payload_part, signature = token.split(".")
    except ValueError as exc:
        raise TokenError("Malformed token") from exc

    signing_input = f"{header_part}.{payload_part}"
    expected = _sign(signing_input, settings.jwt_secret)
    if not hmac.compare_digest(signature, expected):
        raise TokenError("Invalid token signature")

    try:
        header = json.loads(_b64url_decode(header_part))
        payload = json.loads(_b64url_decode(payload_part))
    except (json.JSONDecodeError, ValueError) as exc:
        raise TokenError("Invalid token payload") from exc

    if header.get("alg") != "HS256":
        raise TokenError("Unsupported token algorithm")
    if payload.get("iss") != settings.jwt_issuer:
        raise TokenError("Invalid token issuer")
    if int(payload.get("exp", 0)) < int(time.time()):
        raise TokenError("Token expired")
    if not payload.get("sub"):
        raise TokenError("Missing token subject")
    return payload


def create_state_token() -> str:
    return secrets.token_urlsafe(32)
