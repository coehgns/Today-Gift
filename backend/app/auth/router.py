from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.schemas import LoginResponse, MessageResponse
from app.auth.service import build_google_authorization_url, exchange_google_code_for_userinfo
from app.auth.dependencies import get_current_user
from app.core.config import get_settings
from app.core.security import create_access_token, create_state_token
from app.db.session import get_db
from app.users.models import User
from app.users.schemas import UserRead
from app.users.service import upsert_dev_user, upsert_google_user


router = APIRouter(tags=["auth"])
OAUTH_STATE_COOKIE = "today_gift_oauth_state"


def _set_auth_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        settings.cookie_name,
        token,
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
    )


@router.get("/auth/google/login")
def google_login() -> RedirectResponse:
    state = create_state_token()
    auth_url = build_google_authorization_url(state)
    response = RedirectResponse(auth_url, status_code=status.HTTP_302_FOUND)
    response.set_cookie(
        OAUTH_STATE_COOKIE,
        state,
        max_age=600,
        httponly=True,
        secure=get_settings().cookie_secure,
        samesite="lax",
    )
    return response


@router.get("/auth/google/callback")
async def google_callback(
    request: Request,
    code: str,
    state: str,
    db: Session = Depends(get_db),
) -> RedirectResponse:
    state_cookie = request.cookies.get(OAUTH_STATE_COOKIE)
    if not state_cookie or state_cookie != state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OAuth state")

    userinfo = await exchange_google_code_for_userinfo(code)
    user = upsert_google_user(db, **userinfo)
    token = create_access_token(user.id)
    response = RedirectResponse(get_settings().frontend_url, status_code=status.HTTP_302_FOUND)
    _set_auth_cookie(response, token)
    response.delete_cookie(OAUTH_STATE_COOKIE)
    return response


@router.post("/auth/dev-login", response_model=LoginResponse)
def dev_login(response: Response, db: Session = Depends(get_db)) -> LoginResponse:
    settings = get_settings()
    if not settings.is_local or not settings.enable_dev_login:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    user = upsert_dev_user(db)
    token = create_access_token(user.id)
    _set_auth_cookie(response, token)
    return LoginResponse(user=UserRead.model_validate(user), access_token=token)


@router.post("/auth/logout", response_model=MessageResponse)
def logout(response: Response) -> MessageResponse:
    response.delete_cookie(get_settings().cookie_name)
    return MessageResponse(message="logged out")


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)
