from __future__ import annotations

from pydantic import BaseModel


class BudgetOption(BaseModel):
    label: str
    min: int
    max: int


class GiftOptionsResponse(BaseModel):
    relationships: list[str]
    genders: list[str]
    age_groups: list[str]
    mbti_types: list[str]
    personalities: list[str]
    hobbies: list[str]
    occasions: list[str]
    gift_tones: list[str]
    budget_ranges: list[BudgetOption]
