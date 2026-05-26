from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def import_models() -> None:
    # Imported for SQLAlchemy metadata side effects.
    import app.gifts.models  # noqa: F401
    import app.recommendations.models  # noqa: F401
    import app.users.models  # noqa: F401
