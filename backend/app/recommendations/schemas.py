from __future__ import annotations

import re
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.gifts.options import BUDGET_RANGE_MAP

_UNKNOWN_VALUES = {"잘 모름", "상관없음", "선택 안 함", ""}


def _clean_list(values: Optional[list[str]]) -> list[str]:
    if not values:
        return []
    cleaned: list[str] = []
    for value in values:
        text = str(value).strip()
        if text and text not in _UNKNOWN_VALUES and text not in cleaned:
            cleaned.append(text)
    return cleaned


def parse_budget_range(value: str) -> tuple[int, int]:
    text = value.strip()
    if text in BUDGET_RANGE_MAP:
        return BUDGET_RANGE_MAP[text]
    if text in {"상관없음", "무관"}:
        return (0, 300000)
    under_match = re.fullmatch(r"(\d+)\s*만원\s*이하", text)
    if under_match:
        return (0, int(under_match.group(1)) * 10000)
    over_match = re.fullmatch(r"(\d+)\s*만원\s*이상", text)
    if over_match:
        return (int(over_match.group(1)) * 10000, 300000)
    range_match = re.fullmatch(r"(\d+)\s*~\s*(\d+)\s*만원", text)
    if range_match:
        low = int(range_match.group(1)) * 10000
        high = int(range_match.group(2)) * 10000
        if low > high:
            low, high = high, low
        return (low, high)
    raise ValueError("budget_range must be one of the supported labels, e.g. '3~5만원'")


class RecommendationCreate(BaseModel):
    relationship: str = Field(min_length=1)
    gender: str = "선택 안 함"
    age_group: str = Field(min_length=1)
    mbti: str = "잘 모름"
    personality: list[str] = Field(default_factory=list)
    hobbies: list[str] = Field(default_factory=list)
    budget_range: str = Field(min_length=1)
    occasion: str = Field(min_length=1)
    gift_tone: str = Field(min_length=1)
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None

    @model_validator(mode="after")
    def normalize(self) -> "RecommendationCreate":
        self.relationship = self.relationship.strip()
        self.gender = self.gender.strip() or "선택 안 함"
        self.age_group = self.age_group.strip()
        self.mbti = self.mbti.strip() or "잘 모름"
        self.occasion = self.occasion.strip()
        self.gift_tone = self.gift_tone.strip()
        self.personality = _clean_list(self.personality)
        self.hobbies = _clean_list(self.hobbies)
        budget_min, budget_max = parse_budget_range(self.budget_range)
        self.budget_min = budget_min
        self.budget_max = budget_max
        return self


class RecommendedItem(BaseModel):
    gift_name: str
    price_range: str
    reason: str
    delivery_tip: str
    emotional_message: str
    tags: list[str] = Field(default_factory=list)


class RecommendationPayload(BaseModel):
    summary: str
    items: list[RecommendedItem] = Field(min_length=1, max_length=3)


class RecommendationCreateResponse(RecommendationPayload):
    id: int


class RecommendationRequestRead(BaseModel):
    relationship: str
    gender: str
    age_group: str
    mbti: str
    personality: list[str]
    hobbies: list[str]
    budget_range: str
    budget_min: int
    budget_max: int
    occasion: str
    gift_tone: str
    created_at: datetime


class RecommendationDetailResponse(RecommendationCreateResponse):
    request: RecommendationRequestRead
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    candidate_snapshot: list[dict[str, Any]] = Field(default_factory=list)


class RecommendationListItem(BaseModel):
    id: int
    created_at: datetime
    relationship: str
    occasion: str
    budget_range: str
    summary: str
    representative_gift_name: Optional[str] = None
    status: str


class RecommendationResultRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    result_json: dict[str, Any]
    status: str
    error_message: Optional[str] = None
    created_at: datetime
