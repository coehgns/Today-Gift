from __future__ import annotations

from typing import Optional
from dataclasses import dataclass
from typing import Iterable

from app.gifts.models import GiftItem
from app.recommendations.schemas import RecommendationCreate


@dataclass(frozen=True)
class GiftCandidate:
    gift: GiftItem
    score: int
    reasons: list[str]

    def to_snapshot(self) -> dict:
        payload = self.gift.to_snapshot()
        payload["score"] = self.score
        payload["score_reasons"] = self.reasons
        return payload


def _as_set(values: Optional[Iterable[str]]) -> set[str]:
    return {str(value).strip() for value in (values or []) if str(value).strip()}


def _budget_overlaps(gift: GiftItem, budget_min: int, budget_max: int) -> bool:
    return gift.min_price <= budget_max and gift.max_price >= budget_min


def _price_distance(gift: GiftItem, budget_min: int, budget_max: int) -> int:
    if _budget_overlaps(gift, budget_min, budget_max):
        return 0
    if gift.max_price < budget_min:
        return budget_min - gift.max_price
    return gift.min_price - budget_max


def score_gift(gift: GiftItem, request: RecommendationCreate) -> GiftCandidate:
    score = 0
    reasons: list[str] = []

    budget_min = request.budget_min or 0
    budget_max = request.budget_max or 300000
    if _budget_overlaps(gift, budget_min, budget_max):
        score += 30
        reasons.append("예산 범위와 맞음")

    tags = _as_set(gift.tags_json)
    relations = _as_set(gift.suitable_relations_json)
    occasions = _as_set(gift.suitable_occasions_json)
    personalities = _as_set(gift.suitable_personality_json)

    if request.occasion in occasions or request.occasion in tags:
        score += 25
        reasons.append(f"{request.occasion} 상황에 적합")

    hobby_matches = tags.intersection(request.hobbies)
    if hobby_matches:
        points = 15 * len(hobby_matches)
        score += points
        reasons.append("취미 일치: " + ", ".join(sorted(hobby_matches)))

    personality_matches = personalities.intersection(request.personality) or tags.intersection(
        request.personality
    )
    if personality_matches:
        points = 10 * len(personality_matches)
        score += points
        reasons.append("성격 일치: " + ", ".join(sorted(personality_matches)))

    if request.relationship in relations or "기타" in relations:
        score += 10
        reasons.append(f"{request.relationship} 관계에 무난")

    if request.gift_tone in tags:
        score += 5
        reasons.append(f"{request.gift_tone} 톤과 맞음")

    if not reasons:
        reasons.append("무난한 fallback 후보")

    return GiftCandidate(gift=gift, score=score, reasons=reasons)


def select_gift_candidates(
    gifts: Iterable[GiftItem],
    request: RecommendationCreate,
    *,
    min_candidates: int = 3,
    target_min: int = 5,
    target_max: int = 8,
) -> list[GiftCandidate]:
    active_gifts = [gift for gift in gifts if gift.active]
    if not active_gifts:
        return []

    budget_min = request.budget_min or 0
    budget_max = request.budget_max or 300000
    budget_matched = [gift for gift in active_gifts if _budget_overlaps(gift, budget_min, budget_max)]
    primary_pool = budget_matched or sorted(
        active_gifts, key=lambda gift: (_price_distance(gift, budget_min, budget_max), gift.min_price)
    )[: max(target_max, min_candidates)]

    scored = [score_gift(gift, request) for gift in primary_pool]
    scored.sort(
        key=lambda candidate: (
            -candidate.score,
            _price_distance(candidate.gift, budget_min, budget_max),
            candidate.gift.min_price,
            candidate.gift.name,
        )
    )
    selected = scored[:target_max]

    if len(selected) < target_min:
        selected_ids = {candidate.gift.id for candidate in selected}
        fallback_pool = [gift for gift in budget_matched if gift.id not in selected_ids]
        if len(selected) + len(fallback_pool) < min_candidates:
            fallback_pool.extend([gift for gift in active_gifts if gift.id not in selected_ids])
        fallback_scored = [score_gift(gift, request) for gift in fallback_pool]
        fallback_scored.sort(
            key=lambda candidate: (
                _price_distance(candidate.gift, budget_min, budget_max),
                -candidate.score,
                candidate.gift.min_price,
                candidate.gift.name,
            )
        )
        for candidate in fallback_scored:
            if candidate.gift.id in selected_ids:
                continue
            selected.append(candidate)
            selected_ids.add(candidate.gift.id)
            if len(selected) >= target_min:
                break

    return selected[:target_max]
