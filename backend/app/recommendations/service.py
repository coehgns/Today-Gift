from __future__ import annotations

import json
import time
from typing import Any, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.gifts.models import GiftItem
from app.recommendations.claude_client import request_claude_json
from app.recommendations.fallback import build_fallback_result
from app.recommendations.filter import GiftCandidate, select_gift_candidates
from app.recommendations.models import RecommendationRequest, RecommendationResult
from app.recommendations.prompt import build_recommendation_prompt
from app.recommendations.schemas import (
    RecommendationCreate,
    RecommendationCreateResponse,
    RecommendationDetailResponse,
    RecommendationListItem,
    RecommendationPayload,
    RecommendationRequestRead,
)
from app.users.models import User


def _extract_json_object(text: str) -> dict[str, Any]:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = stripped.strip("`")
        if stripped.lower().startswith("json"):
            stripped = stripped[4:].strip()
    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("No JSON object found in Claude response")
    return json.loads(stripped[start : end + 1])


def _validate_candidate_boundaries(
    payload: RecommendationPayload, candidates: list[GiftCandidate]
) -> RecommendationPayload:
    allowed_names = {candidate.gift.name for candidate in candidates}
    unknown_names = [item.gift_name for item in payload.items if item.gift_name not in allowed_names]
    if unknown_names:
        raise ValueError(f"Claude recommended gifts outside candidate list: {unknown_names}")
    return payload


def _parse_ai_payload(text: str, candidates: list[GiftCandidate]) -> RecommendationPayload:
    raw_payload = _extract_json_object(text)
    payload = RecommendationPayload.model_validate(raw_payload)
    return _validate_candidate_boundaries(payload, candidates)


def _augment_to_three(
    payload: RecommendationPayload,
    request: RecommendationCreate,
    candidates: list[GiftCandidate],
) -> tuple[RecommendationPayload, bool]:
    if len(payload.items) >= 3:
        return payload, False
    exclude_names = {item.gift_name for item in payload.items}
    fallback = build_fallback_result(request, candidates, exclude_names=exclude_names)
    combined_items = [*payload.items, *fallback.items]
    payload = RecommendationPayload(summary=payload.summary, items=combined_items[:3])
    return payload, True


def _create_request_row(
    db: Session, user: User, request: RecommendationCreate
) -> RecommendationRequest:
    row = RecommendationRequest(
        user_id=user.id,
        relationship=request.relationship,
        gender=request.gender,
        age_group=request.age_group,
        mbti=request.mbti,
        personality_json=request.personality,
        hobbies_json=request.hobbies,
        budget_min=request.budget_min or 0,
        budget_max=request.budget_max or 300000,
        budget_range=request.budget_range,
        occasion=request.occasion,
        gift_tone=request.gift_tone,
    )
    db.add(row)
    db.flush()
    return row


def _active_gifts(db: Session) -> list[GiftItem]:
    return list(db.execute(select(GiftItem).where(GiftItem.active.is_(True))).scalars().all())


async def create_recommendation(
    db: Session, user: User, request: RecommendationCreate
) -> RecommendationResult:
    request_row = _create_request_row(db, user, request)
    gifts = _active_gifts(db)
    candidates = select_gift_candidates(gifts, request)
    if not candidates:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No active gift candidates are available. Seed gift data first.",
        )

    started = time.perf_counter()
    status_value = "success"
    error_message: Optional[str] = None
    ai_model = get_settings().anthropic_model

    try:
        prompt = build_recommendation_prompt(request, candidates)
        ai_text = await request_claude_json(prompt)
        payload = _parse_ai_payload(ai_text, candidates)
        payload, augmented = _augment_to_three(payload, request, candidates)
        if augmented:
            status_value = "partial_fallback"
            error_message = "Claude returned fewer than 3 valid items; fallback filled the rest."
    except Exception as exc:  # noqa: BLE001 - failure must degrade to fallback for demo stability.
        payload = build_fallback_result(request, candidates)
        status_value = "fallback"
        error_message = str(exc)[:1000]
        ai_model = "fallback"

    latency_ms = int((time.perf_counter() - started) * 1000)
    result = RecommendationResult(
        request_id=request_row.id,
        ai_model=ai_model,
        result_json=payload.model_dump(),
        candidate_snapshot_json=[candidate.to_snapshot() for candidate in candidates],
        status=status_value,
        error_message=error_message,
        latency_ms=latency_ms,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def to_create_response(result: RecommendationResult) -> RecommendationCreateResponse:
    payload = RecommendationPayload.model_validate(result.result_json)
    return RecommendationCreateResponse(id=result.id, summary=payload.summary, items=payload.items)


def _request_read(row: RecommendationRequest) -> RecommendationRequestRead:
    return RecommendationRequestRead(
        relationship=row.relationship,
        gender=row.gender,
        age_group=row.age_group,
        mbti=row.mbti,
        personality=row.personality_json or [],
        hobbies=row.hobbies_json or [],
        budget_range=row.budget_range,
        budget_min=row.budget_min,
        budget_max=row.budget_max,
        occasion=row.occasion,
        gift_tone=row.gift_tone,
        created_at=row.created_at,
    )


def to_detail_response(result: RecommendationResult) -> RecommendationDetailResponse:
    payload = RecommendationPayload.model_validate(result.result_json)
    request_row = result.request
    return RecommendationDetailResponse(
        id=result.id,
        summary=payload.summary,
        items=payload.items,
        request=_request_read(request_row),
        status=result.status,
        error_message=result.error_message,
        created_at=result.created_at,
        candidate_snapshot=result.candidate_snapshot_json or [],
    )


def list_recommendations(db: Session, user: User) -> list[RecommendationListItem]:
    rows = (
        db.execute(
            select(RecommendationResult)
            .join(RecommendationRequest)
            .where(RecommendationRequest.user_id == user.id)
            .order_by(RecommendationResult.created_at.desc(), RecommendationResult.id.desc())
        )
        .scalars()
        .all()
    )
    response: list[RecommendationListItem] = []
    for result in rows:
        payload = RecommendationPayload.model_validate(result.result_json)
        first_item = payload.items[0] if payload.items else None
        request_row = result.request
        response.append(
            RecommendationListItem(
                id=result.id,
                created_at=result.created_at,
                relationship=request_row.relationship,
                occasion=request_row.occasion,
                budget_range=request_row.budget_range,
                summary=payload.summary,
                representative_gift_name=first_item.gift_name if first_item else None,
                status=result.status,
            )
        )
    return response


def get_recommendation_for_user(db: Session, user: User, result_id: int) -> RecommendationResult:
    result = (
        db.execute(
            select(RecommendationResult)
            .join(RecommendationRequest)
            .where(RecommendationResult.id == result_id, RecommendationRequest.user_id == user.id)
        )
        .scalars()
        .one_or_none()
    )
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")
    return result


def delete_recommendation_for_user(db: Session, user: User, result_id: int) -> None:
    result = get_recommendation_for_user(db, user, result_id)
    request_row = result.request
    db.delete(result)
    db.flush()
    db.delete(request_row)
    db.commit()
