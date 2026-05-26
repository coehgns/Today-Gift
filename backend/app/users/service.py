from __future__ import annotations

from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.users.models import User


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.get(User, user_id)


def get_user_by_google_sub(db: Session, google_sub: str) -> Optional[User]:
    return db.execute(select(User).where(User.google_sub == google_sub)).scalar_one_or_none()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def upsert_google_user(
    db: Session,
    *,
    google_sub: str,
    email: str,
    name: str,
    profile_image_url: Optional[str],
) -> User:
    user = get_user_by_google_sub(db, google_sub)
    if user is None:
        user = get_user_by_email(db, email)
    if user is None:
        user = User(
            google_sub=google_sub,
            email=email,
            name=name,
            profile_image_url=profile_image_url,
        )
        db.add(user)
    else:
        user.google_sub = google_sub
        user.email = email
        user.name = name
        user.profile_image_url = profile_image_url
    db.commit()
    db.refresh(user)
    return user


def upsert_dev_user(db: Session) -> User:
    return upsert_google_user(
        db,
        google_sub="dev-local-user",
        email="dev@today-gift.local",
        name="개발용 사용자",
        profile_image_url=None,
    )
