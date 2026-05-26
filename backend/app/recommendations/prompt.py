from __future__ import annotations

import json

from app.recommendations.filter import GiftCandidate
from app.recommendations.schemas import RecommendationCreate


def build_recommendation_prompt(request: RecommendationCreate, candidates: list[GiftCandidate]) -> str:
    input_payload = {
        "relationship": request.relationship,
        "gender": request.gender,
        "age_group": request.age_group,
        "mbti": request.mbti,
        "personality": request.personality,
        "hobbies": request.hobbies,
        "budget_range": request.budget_range,
        "occasion": request.occasion,
        "gift_tone": request.gift_tone,
    }
    candidate_payload = [candidate.to_snapshot() for candidate in candidates]
    return f"""
너는 한국어 선물 추천 서비스 '오늘의 선물'의 추천 설명 작성자다.
서버가 이미 검증한 후보 선물 목록 안에서만 최종 추천 3개를 골라라.

절대 규칙:
- candidate_gifts에 없는 상품명은 절대 만들거나 추천하지 않는다.
- gift_name은 candidate_gifts의 name 값을 정확히 그대로 사용한다.
- 출력은 JSON object 하나만 반환한다. 마크다운 코드블록, 설명 문장, 주석을 붙이지 않는다.
- 과장된 광고 문구를 피하고, 자연스러운 한국어로 쓴다.
- reason, delivery_tip, emotional_message는 각각 1~2문장으로 짧게 쓴다.

사용자 입력:
{json.dumps(input_payload, ensure_ascii=False, indent=2)}

candidate_gifts:
{json.dumps(candidate_payload, ensure_ascii=False, indent=2)}

반환 JSON schema:
{{
  "summary": "추천 요약 한 문장",
  "items": [
    {{
      "gift_name": "candidate_gifts 중 정확한 name",
      "price_range": "예: 3~5만원",
      "reason": "추천 이유",
      "delivery_tip": "전달 팁",
      "emotional_message": "상대에게 보낼 수 있는 감성 메시지",
      "tags": ["태그1", "태그2"]
    }}
  ]
}}
""".strip()
