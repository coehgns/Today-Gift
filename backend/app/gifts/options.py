from __future__ import annotations

RELATIONSHIPS = ["친구", "연인", "가족", "동료", "선생님", "기타"]
GENDERS = ["여성", "남성", "선택 안 함"]
AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대 이상", "잘 모름"]
MBTI_TYPES = [
    "ISTJ",
    "ISFJ",
    "INFJ",
    "INTJ",
    "ISTP",
    "ISFP",
    "INFP",
    "INTP",
    "ESTP",
    "ESFP",
    "ENFP",
    "ENTP",
    "ESTJ",
    "ESFJ",
    "ENFJ",
    "ENTJ",
    "잘 모름",
]
PERSONALITIES = [
    "감성적인",
    "차분한",
    "활동적인",
    "실용적인",
    "트렌디한",
    "꼼꼼한",
    "귀여운 것을 좋아하는",
    "미니멀한",
    "새로운 경험을 좋아하는",
    "상관없음",
]
HOBBIES = [
    "독서",
    "카페/디저트",
    "운동",
    "요리",
    "음악",
    "영화/드라마",
    "게임",
    "여행",
    "문구",
    "인테리어",
    "뷰티",
    "테크",
    "반려동물",
    "잘 모름",
]
OCCASIONS = ["생일", "기념일", "축하", "응원", "감사", "집들이", "가벼운 선물", "기타"]
GIFT_TONES = ["센스있는", "감동적인", "실용적인", "귀여운", "고급스러운", "부담없는"]
BUDGET_RANGES = [
    {"label": "1만원 이하", "min": 0, "max": 10000},
    {"label": "1~3만원", "min": 10000, "max": 30000},
    {"label": "3~5만원", "min": 30000, "max": 50000},
    {"label": "5~10만원", "min": 50000, "max": 100000},
    {"label": "10만원 이상", "min": 100000, "max": 300000},
    {"label": "상관없음", "min": 0, "max": 300000},
]

BUDGET_RANGE_MAP = {item["label"]: (item["min"], item["max"]) for item in BUDGET_RANGES}
