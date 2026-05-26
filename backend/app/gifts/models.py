from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class GiftItem(Base):
    __tablename__ = "gift_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(Text)
    min_price: Mapped[int] = mapped_column(Integer)
    max_price: Mapped[int] = mapped_column(Integer)
    tags_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    suitable_relations_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    suitable_occasions_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    suitable_personality_json: Mapped[list[str]] = mapped_column(JSON, default=list)
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def to_snapshot(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "min_price": self.min_price,
            "max_price": self.max_price,
            "price_range": f"{self.min_price // 10000}~{self.max_price // 10000}만원"
            if self.max_price >= 10000
            else f"{self.max_price}원 이하",
            "tags": self.tags_json or [],
            "suitable_relations": self.suitable_relations_json or [],
            "suitable_occasions": self.suitable_occasions_json or [],
            "suitable_personality": self.suitable_personality_json or [],
        }
