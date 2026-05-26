from __future__ import annotations

from fastapi import APIRouter

from app.gifts import options
from app.gifts.schemas import GiftOptionsResponse


router = APIRouter(prefix="/gifts", tags=["gifts"])


@router.get("/options", response_model=GiftOptionsResponse)
def get_gift_options() -> GiftOptionsResponse:
    return GiftOptionsResponse(
        relationships=options.RELATIONSHIPS,
        genders=options.GENDERS,
        age_groups=options.AGE_GROUPS,
        mbti_types=options.MBTI_TYPES,
        personalities=options.PERSONALITIES,
        hobbies=options.HOBBIES,
        occasions=options.OCCASIONS,
        gift_tones=options.GIFT_TONES,
        budget_ranges=options.BUDGET_RANGES,
    )
