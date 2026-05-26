from __future__ import annotations

from typing import Optional
from app.recommendations.filter import GiftCandidate
from app.recommendations.schemas import RecommendationCreate, RecommendationPayload, RecommendedItem


def _reason(candidate: GiftCandidate, request: RecommendationCreate) -> str:
    reason_text = ", ".join(candidate.reasons[:2])
    if reason_text:
        return f"{reason_text}이라서 {request.relationship}에게 부담 없이 어울립니다."
    return f"{request.relationship}에게 무난하게 전달하기 좋은 선물입니다."


def build_fallback_result(
    request: RecommendationCreate,
    candidates: list[GiftCandidate],
    *,
    exclude_names: Optional[set[str]] = None,
) -> RecommendationPayload:
    exclude_names = exclude_names or set()
    items: list[RecommendedItem] = []
    for candidate in candidates:
        gift = candidate.gift
        if gift.name in exclude_names:
            continue
        items.append(
            RecommendedItem(
                gift_name=gift.name,
                price_range=f"{gift.min_price // 10000}~{gift.max_price // 10000}만원",
                reason=_reason(candidate, request),
                delivery_tip="작은 카드에 고른 이유를 한 줄로 적어 함께 전달해보세요.",
                emotional_message="네 하루에 작지만 기분 좋은 순간이 되었으면 좋겠어.",
                tags=(gift.tags_json or [])[:5],
            )
        )
        if len(items) >= 3:
            break

    summary = f"{request.age_group} {request.relationship}의 {request.occasion}을 위한 {request.gift_tone} 선물 추천"
    return RecommendationPayload(summary=summary, items=items)
