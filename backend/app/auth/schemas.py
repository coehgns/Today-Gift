from __future__ import annotations

from pydantic import BaseModel

from app.users.schemas import UserRead


class LoginResponse(BaseModel):
    user: UserRead
    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    message: str
