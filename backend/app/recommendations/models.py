from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship as orm_relationship

from app.db.base import Base


class RecommendationRequest(Base):
    __tablename__ = "recommendation_requests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    relationship: Mapped[str] = mapped_column(String(50))
    gender: Mapped[str] = mapped_column(String(50), default="선택 안 함")
    age_group: Mapped[str] = mapped_column(String(50))
    mbti: Mapped[str] = mapped_column(String(20), default="잘 모름")
    personality_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    hobbies_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    budget_min: Mapped[int] = mapped_column(Integer)
    budget_max: Mapped[int] = mapped_column(Integer)
    budget_range: Mapped[str] = mapped_column(String(50))
    occasion: Mapped[str] = mapped_column(String(50))
    gift_tone: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = orm_relationship("User", back_populates="recommendation_requests")
    result = orm_relationship("RecommendationResult", back_populates="request", uselist=False)


class RecommendationResult(Base):
    __tablename__ = "recommendation_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    request_id: Mapped[int] = mapped_column(
        ForeignKey("recommendation_requests.id"), unique=True, index=True
    )
    ai_model: Mapped[str] = mapped_column(String(100), default="fallback")
    result_json: Mapped[dict[str, Any]] = mapped_column(JSON)
    candidate_snapshot_json: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(50), default="success", index=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    request = orm_relationship("RecommendationRequest", back_populates="result")
