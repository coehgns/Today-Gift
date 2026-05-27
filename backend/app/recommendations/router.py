from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.schemas import MessageResponse
from app.db.session import get_db
from app.recommendations.schemas import (
    RecommendationCreate,
    RecommendationCreateResponse,
    RecommendationDetailResponse,
    RecommendationListItem,
)
from app.recommendations.service import (
    create_recommendation,
    delete_recommendation_for_user,
    get_recommendation_for_user,
    list_recommendations,
    to_create_response,
    to_detail_response,
)
from app.users.models import User


router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("", response_model=RecommendationCreateResponse)
async def create_recommendation_endpoint(
    payload: RecommendationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationCreateResponse:
    result = await create_recommendation(db, current_user, payload)
    return to_create_response(result)


@router.get("", response_model=list[RecommendationListItem])
def list_recommendations_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[RecommendationListItem]:
    return list_recommendations(db, current_user)


@router.get("/{result_id}", response_model=RecommendationDetailResponse)
def get_recommendation_endpoint(
    result_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationDetailResponse:
    result = get_recommendation_for_user(db, current_user, result_id)
    return to_detail_response(result)


@router.delete("/{result_id}", response_model=MessageResponse)
def delete_recommendation_endpoint(
    result_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    delete_recommendation_for_user(db, current_user, result_id)
    return MessageResponse(message="recommendation deleted")
