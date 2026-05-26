from __future__ import annotations

from sqlalchemy import select

from app.gifts.models import GiftItem
from app.recommendations.filter import select_gift_candidates
from app.recommendations.schemas import RecommendationCreate


def test_select_candidates_respects_budget_and_demo_scenario(db_session):
    request = RecommendationCreate(
        relationship="친구",
        gender="선택 안 함",
        age_group="20대",
        mbti="INFP",
        personality=["감성적인", "차분한"],
        hobbies=["독서", "카페/디저트"],
        budget_range="3~5만원",
        occasion="생일",
        gift_tone="센스있는",
    )
    gifts = db_session.execute(select(GiftItem)).scalars().all()

    candidates = select_gift_candidates(gifts, request)

    assert 5 <= len(candidates) <= 8
    assert all(candidate.gift.min_price <= 50000 for candidate in candidates)
    assert all(candidate.gift.max_price >= 30000 for candidate in candidates)
    assert candidates[0].score >= candidates[-1].score
    assert any("독서" in (candidate.gift.tags_json or []) for candidate in candidates)
    assert any("카페/디저트" in (candidate.gift.tags_json or []) for candidate in candidates)


def test_select_candidates_falls_back_to_at_least_three_when_budget_sparse(db_session):
    request = RecommendationCreate(
        relationship="친구",
        age_group="20대",
        budget_range="10만원 이상",
        occasion="생일",
        gift_tone="실용적인",
    )
    gifts = db_session.execute(select(GiftItem)).scalars().all()

    candidates = select_gift_candidates(gifts, request)

    assert len(candidates) >= 3
