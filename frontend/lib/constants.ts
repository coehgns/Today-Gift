import type {
  BudgetRangeOption,
  GiftOptions,
  GiftRecommendation,
  RecommendationFormValues,
  RecommendationRequestPayload,
  RecommendationResult,
} from "@/types/recommendation";

export const DEFAULT_GIFT_OPTIONS: GiftOptions = {
  relationships: [
    { value: "friend", label: "친구", description: "편하게 마음을 전하고 싶은 사이" },
    { value: "lover", label: "연인", description: "감성과 기억이 중요한 관계" },
    { value: "parent", label: "가족", description: "정성과 실용성이 함께 필요한 관계" },
    { value: "coworker", label: "직장 동료", description: "센스 있고 부담 없는 선물이 필요한 관계" },
    { value: "teacher", label: "부모님", description: "감사와 배려를 담고 싶은 관계" },
    { value: "unknown", label: "잘 모름", description: "정보가 부족해도 추천할 수 있어요" },
  ],
  genders: [
    { value: "female", label: "여성" },
    { value: "male", label: "남성" },
    { value: "none", label: "상관없음" },
  ],
  ageGroups: [
    { value: "teens", label: "10대" },
    { value: "twenties", label: "20대" },
    { value: "thirties", label: "30대" },
    { value: "forties", label: "40대" },
    { value: "fifties_plus", label: "50대 이상" },
    { value: "unknown", label: "잘 모름" },
  ],
  mbtis: [
    { value: "ISTJ", label: "ISTJ" },
    { value: "ISFJ", label: "ISFJ" },
    { value: "INFJ", label: "INFJ" },
    { value: "INTJ", label: "INTJ" },
    { value: "ISTP", label: "ISTP" },
    { value: "ISFP", label: "ISFP" },
    { value: "INFP", label: "INFP" },
    { value: "INTP", label: "INTP" },
    { value: "ESTP", label: "ESTP" },
    { value: "ESFP", label: "ESFP" },
    { value: "ENFP", label: "ENFP" },
    { value: "ENTP", label: "ENTP" },
    { value: "ESTJ", label: "ESTJ" },
    { value: "ESFJ", label: "ESFJ" },
    { value: "ENFJ", label: "ENFJ" },
    { value: "ENTJ", label: "ENTJ" },
    { value: "unknown", label: "잘 모름" },
  ],
  personalities: [
    { value: "calm", label: "차분한" },
    { value: "active", label: "활발한" },
    { value: "sentimental", label: "감성적인" },
    { value: "logical", label: "논리적인" },
    { value: "humorous", label: "유머러스한" },
    { value: "delicate", label: "섬세한" },
    { value: "honest", label: "솔직한" },
    { value: "careful", label: "신중한" },
  ],
  hobbies: [
    { value: "reading", label: "독서" },
    { value: "fitness", label: "운동" },
    { value: "travel", label: "여행" },
    { value: "music", label: "음악" },
    { value: "movie", label: "영화" },
    { value: "cooking", label: "요리" },
    { value: "game", label: "게임" },
    { value: "fashion", label: "패션" },
    { value: "coffee", label: "카페" },
    { value: "photo", label: "사진" },
  ],
  occasions: [
    { value: "birthday", label: "생일", description: "특별한 날을 기억하는 선물" },
    { value: "anniversary", label: "기념일", description: "관계의 의미를 담는 선물" },
    { value: "thanks", label: "감사", description: "고마움을 전하는 선물" },
    { value: "comfort", label: "위로", description: "마음을 쉬게 하는 선물" },
    { value: "cheering", label: "응원", description: "힘을 보태는 선물" },
    { value: "casual", label: "그냥", description: "가볍게 건네는 선물" },
  ],
  giftTones: [
    { value: "practical", label: "실용적인" },
    { value: "sentimental", label: "감동적인" },
    { value: "trendy", label: "센스있는" },
    { value: "casual", label: "부담없는" },
  ],
  budgetRanges: [
    { value: "under_10000", label: "1만원 이하", min: 0, max: 10000, display: "1만원 이하", description: "간단하고 부담없는 선물" },
    { value: "10000_30000", label: "1~3만원", min: 10000, max: 30000, display: "1~3만원", description: "데일리 아이템" },
    { value: "30000_50000", label: "3~5만원", min: 30000, max: 50000, display: "3~5만원", description: "센스있는 선물" },
    { value: "50000_100000", label: "5~10만원", min: 50000, max: 100000, display: "5~10만원", description: "특별한 날 선물" },
    { value: "over_100000", label: "10만원 이상", min: 100000, max: null, display: "10만원 이상", description: "프리미엄 선물" },
  ],
};

export const EMPTY_RECOMMENDATION_FORM: RecommendationFormValues = {
  relationship: "",
  gender: "",
  ageGroup: "",
  mbti: "",
  personalities: [],
  hobbies: [],
  occasion: "",
  giftTone: "",
  budgetRange: "",
};

type CatalogGift = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  min: number;
  max: number | null;
  tags: string[];
  relations: string[];
  occasions: string[];
  personalities: string[];
  hobbies: string[];
  tones: string[];
  reason: string;
  tip: string;
  message: string;
  imageHint: string;
};

export const FALLBACK_GIFT_CATALOG: CatalogGift[] = [
  {
    id: "drip-coffee-set",
    name: "싱글오리진 드립백 커피 세트",
    category: "디저트/커피",
    priceRange: "28,000~42,000원",
    min: 28000,
    max: 42000,
    tags: ["coffee", "practical", "warm"],
    relations: ["friend", "coworker", "teacher", "parent"],
    occasions: ["thanks", "birthday", "cheering", "holiday"],
    personalities: ["calm", "practical", "homebody"],
    hobbies: ["coffee", "reading"],
    tones: ["warm", "practical", "calm"],
    reason: "하루 루틴에 바로 스며드는 선물이라 취향을 크게 타지 않으면서도 정성이 느껴져요.",
    tip: "첫 잔은 함께 마실 수 있는 시간 제안과 같이 건네면 선물의 온도가 올라갑니다.",
    message: "잠깐의 향으로도 오늘이 조금 부드러워졌으면 좋겠어요.",
    imageHint: "matte coffee sachets with paper band",
  },
  {
    id: "room-fragrance",
    name: "오브제 룸 프래그런스",
    category: "뷰티/향기",
    priceRange: "36,000~68,000원",
    min: 36000,
    max: 68000,
    tags: ["beauty", "homebody", "sentimental"],
    relations: ["lover", "friend", "sibling"],
    occasions: ["birthday", "anniversary", "housewarming", "cheering"],
    personalities: ["sentimental", "calm", "trendy", "homebody"],
    hobbies: ["beauty", "plants", "reading"],
    tones: ["warm", "premium", "calm"],
    reason: "공간에 오래 남는 향은 매일 반복해서 선물한 사람을 떠올리게 만드는 힘이 있어요.",
    tip: "향 설명 카드에 상대를 떠올린 이유를 한 줄 적어 함께 넣어보세요.",
    message: "당신의 공간에 좋은 계절이 오래 머물렀으면 해서 골랐어요.",
    imageHint: "amber glass diffuser on linen cloth",
  },
  {
    id: "daily-journal",
    name: "날짜 없는 데일리 저널과 펜 세트",
    category: "문구/독서",
    priceRange: "24,000~39,000원",
    min: 24000,
    max: 39000,
    tags: ["stationery", "reading", "creative"],
    relations: ["friend", "sibling", "teacher", "lover"],
    occasions: ["graduation", "birthday", "cheering", "thanks"],
    personalities: ["sentimental", "creative", "minimal", "calm"],
    hobbies: ["reading", "stationery", "music"],
    tones: ["warm", "calm", "practical"],
    reason: "부담 없는 가격대지만 새 출발과 마음 정리에 잘 어울려 의미를 담기 좋습니다.",
    tip: "첫 페이지에 짧은 응원 문장을 적어두면 평범한 문구가 개인적인 선물이 됩니다.",
    message: "앞으로의 날들이 당신의 문장으로 천천히 채워지길 바라요.",
    imageHint: "cream journal with brass pen",
  },
  {
    id: "wireless-charger",
    name: "우드톤 3-in-1 무선 충전 스탠드",
    category: "테크/가젯",
    priceRange: "49,000~89,000원",
    min: 49000,
    max: 89000,
    tags: ["tech", "practical", "minimal"],
    relations: ["lover", "friend", "sibling", "coworker"],
    occasions: ["birthday", "graduation", "thanks", "holiday"],
    personalities: ["practical", "minimal", "trendy"],
    hobbies: ["tech", "travel", "music"],
    tones: ["practical", "premium", "surprising"],
    reason: "책상이나 침대 옆에서 매일 쓰기 좋아 실용성이 강하고, 우드톤이면 차가운 가젯 느낌도 줄어듭니다.",
    tip: "상대가 쓰는 기기와 호환되는지 한 번만 확인하면 실패 확률이 크게 낮아져요.",
    message: "매일 충전되는 것처럼 당신의 하루도 조금씩 가벼워졌으면 해요.",
    imageHint: "wooden wireless charging stand",
  },
  {
    id: "tea-and-honey",
    name: "허브티와 미니 꿀 큐레이션 박스",
    category: "디저트/간식",
    priceRange: "32,000~55,000원",
    min: 32000,
    max: 55000,
    tags: ["coffee", "warm", "homebody"],
    relations: ["parent", "teacher", "coworker", "friend"],
    occasions: ["thanks", "cheering", "holiday", "birthday"],
    personalities: ["calm", "sentimental", "homebody"],
    hobbies: ["coffee", "cooking", "reading"],
    tones: ["warm", "calm", "premium"],
    reason: "몸과 마음을 쉬게 하는 인상이 있어 감사나 위로의 맥락에서 특히 자연스럽습니다.",
    tip: "카페인 없는 블렌드를 섞으면 나이대와 생활 패턴을 덜 타는 안전한 구성이 됩니다.",
    message: "바쁜 날 끝에 잠깐이라도 다정한 쉼이 생기길 바라요.",
    imageHint: "herbal tea tins and honey jars",
  },
  {
    id: "mini-plant",
    name: "관리 쉬운 테이블 플랜트 키트",
    category: "홈/인테리어",
    priceRange: "22,000~45,000원",
    min: 22000,
    max: 45000,
    tags: ["plants", "homebody", "warm"],
    relations: ["friend", "coworker", "sibling", "teacher"],
    occasions: ["housewarming", "graduation", "cheering", "thanks"],
    personalities: ["calm", "sentimental", "minimal"],
    hobbies: ["plants", "reading", "pet"],
    tones: ["warm", "cute", "calm"],
    reason: "오래 두고 볼 수 있지만 크기가 작아 부담이 적고, 새 공간이나 새 시작에 잘 어울립니다.",
    tip: "물 주는 주기 카드까지 같이 챙기면 센스 있는 선물이 됩니다.",
    message: "작은 초록이 당신의 책상 위에서 조용히 응원해주면 좋겠어요.",
    imageHint: "small potted plant in ceramic cup",
  },
  {
    id: "premium-handcream",
    name: "프리미엄 핸드크림 트리오",
    category: "뷰티/향기",
    priceRange: "45,000~78,000원",
    min: 45000,
    max: 78000,
    tags: ["beauty", "premium", "practical"],
    relations: ["lover", "friend", "parent", "teacher"],
    occasions: ["birthday", "thanks", "holiday", "anniversary"],
    personalities: ["trendy", "sentimental", "practical"],
    hobbies: ["beauty", "travel"],
    tones: ["premium", "warm", "practical"],
    reason: "작지만 매일 쓰는 물건이라 고급스러운 인상을 주면서도 과하게 부담스럽지 않습니다.",
    tip: "무향 또는 은은한 향을 섞은 구성으로 고르면 취향 리스크를 줄일 수 있어요.",
    message: "당신의 손끝에 닿는 하루들이 조금 더 부드럽길 바라요.",
    imageHint: "three elegant hand cream tubes",
  },
  {
    id: "fitness-recovery-kit",
    name: "운동 회복 미니 케어 키트",
    category: "건강/운동",
    priceRange: "39,000~72,000원",
    min: 39000,
    max: 72000,
    tags: ["fitness", "active", "practical"],
    relations: ["friend", "sibling", "lover", "coworker"],
    occasions: ["birthday", "cheering", "graduation"],
    personalities: ["active", "practical"],
    hobbies: ["fitness", "travel"],
    tones: ["practical", "surprising", "warm"],
    reason: "운동을 좋아하는 사람에게는 쓰임이 분명하고, 컨디션까지 챙기는 느낌을 줄 수 있어요.",
    tip: "마사지볼, 쿨링 패치, 단백질 스낵처럼 소모품 위주로 구성하면 부담 없이 쓰기 좋습니다.",
    message: "열심히 움직인 만큼 회복하는 시간도 충분히 다정했으면 해요.",
    imageHint: "fitness recovery essentials kit",
  },
  {
    id: "home-dessert-box",
    name: "수제 구움과자 셀렉션 박스",
    category: "디저트/간식",
    priceRange: "25,000~58,000원",
    min: 25000,
    max: 58000,
    tags: ["foodie", "warm", "cute"],
    relations: ["friend", "lover", "coworker", "sibling"],
    occasions: ["birthday", "thanks", "cheering", "holiday"],
    personalities: ["sentimental", "trendy", "homebody"],
    hobbies: ["coffee", "cooking"],
    tones: ["warm", "cute", "surprising"],
    reason: "함께 나누기 쉬운 선물이라 분위기를 부드럽게 만들고, 포장에 따라 감성도 살릴 수 있습니다.",
    tip: "알레르기와 단맛 선호만 확인하면 실패 가능성이 낮습니다.",
    message: "오늘만큼은 작고 달콤한 것들이 당신 편이었으면 해요.",
    imageHint: "assorted baked cookies gift box",
  },
  {
    id: "travel-pouch",
    name: "압축 트래블 파우치 세트",
    category: "여행/생활",
    priceRange: "31,000~64,000원",
    min: 31000,
    max: 64000,
    tags: ["travel", "practical", "minimal"],
    relations: ["friend", "sibling", "lover", "coworker"],
    occasions: ["graduation", "birthday", "cheering", "holiday"],
    personalities: ["practical", "minimal", "active"],
    hobbies: ["travel", "fitness"],
    tones: ["practical", "surprising"],
    reason: "여행을 좋아하거나 이동이 잦은 사람에게 즉시 쓸모가 있고 정리 취향까지 만족시킵니다.",
    tip: "상대가 좋아하는 색보다 오래 질리지 않는 뉴트럴 컬러를 고르면 안전합니다.",
    message: "다음 여정이 조금 더 가볍고 단정하게 시작되길 바라요.",
    imageHint: "neutral compression travel pouches",
  },
];

export function findOptionLabel(options: GiftOptions, group: keyof GiftOptions, value: string) {
  const list = options[group];
  const found = list.find((item) => item.value === value);
  return found?.label ?? value;
}

export function getBudgetOption(value: string, options = DEFAULT_GIFT_OPTIONS): BudgetRangeOption {
  return (
    options.budgetRanges.find((item) => item.value === value) ??
    DEFAULT_GIFT_OPTIONS.budgetRanges[1]
  );
}

export function buildRecommendationPayload(
  values: RecommendationFormValues,
  options = DEFAULT_GIFT_OPTIONS,
): RecommendationRequestPayload {
  const budget = getBudgetOption(values.budgetRange, options);

  const personality = values.personalities.filter((value) => value !== "any");
  const hobbies = values.hobbies.filter((value) => value !== "any");

  return {
    relationship: values.relationship,
    gender: values.gender,
    age_group: values.ageGroup,
    mbti: values.mbti || "잘 모름",
    personality,
    personalities: personality,
    hobbies,
    budget_range: budget.label,
    budget_min: budget.min,
    budget_max: budget.max,
    occasion: values.occasion,
    gift_tone: values.giftTone,
  };
}

function overlaps(left: string[], right: string[]) {
  if (left.includes("any") || right.includes("any")) return 0;
  return left.filter((item) => right.includes(item)).length;
}

function fitsBudget(gift: CatalogGift, budget: BudgetRangeOption) {
  const budgetMax = budget.max ?? Number.POSITIVE_INFINITY;
  const giftMax = gift.max ?? Number.POSITIVE_INFINITY;
  return gift.min <= budgetMax && giftMax >= budget.min;
}

function selectFallbackGifts(values: RecommendationFormValues) {
  const budget = getBudgetOption(values.budgetRange);
  const scored = FALLBACK_GIFT_CATALOG.map((gift) => {
    let score = fitsBudget(gift, budget) ? 30 : -18;
    if (gift.occasions.includes(values.occasion)) score += 25;
    if (gift.relations.includes(values.relationship)) score += 14;
    if (gift.tones.includes(values.giftTone)) score += 12;
    score += overlaps(gift.hobbies, values.hobbies) * 15;
    score += overlaps(gift.personalities, values.personalities) * 10;

    return { gift, score };
  });

  scored.sort((a, b) => b.score - a.score || a.gift.name.localeCompare(b.gift.name, "ko-KR"));

  const selected = scored.slice(0, 3).map(({ gift }) => gift);
  if (selected.length >= 3) return selected;

  const selectedIds = new Set(selected.map((gift) => gift.id));
  for (const gift of FALLBACK_GIFT_CATALOG) {
    if (!selectedIds.has(gift.id)) selected.push(gift);
    if (selected.length >= 3) break;
  }
  return selected;
}

export function createDemoRecommendation(values: RecommendationFormValues): RecommendationResult {
  const normalizedValues: RecommendationFormValues = {
    ...EMPTY_RECOMMENDATION_FORM,
    ...values,
    gender: values.gender || "none",
    mbti: values.mbti || "unknown",
  };
  const selected = selectFallbackGifts(normalizedValues);
  const relationshipLabel = findOptionLabel(DEFAULT_GIFT_OPTIONS, "relationships", normalizedValues.relationship);
  const occasionLabel = findOptionLabel(DEFAULT_GIFT_OPTIONS, "occasions", normalizedValues.occasion);
  const giftToneLabel = findOptionLabel(DEFAULT_GIFT_OPTIONS, "giftTones", normalizedValues.giftTone);
  const budgetLabel = getBudgetOption(normalizedValues.budgetRange).label;
  const now = new Date().toISOString();

  const items: GiftRecommendation[] = selected.map((gift, index) => ({
    id: gift.id,
    name: gift.name,
    category: gift.category,
    priceRange: gift.priceRange,
    reason: gift.reason,
    deliveryTip: gift.tip,
    message: gift.message,
    tags: gift.tags.slice(0, 4),
    imageHint: gift.imageHint,
    confidenceLabel: index === 0 ? "가장 잘 맞는 선택" : index === 1 ? "센스 있는 대안" : "부담 없는 후보",
  }));

  const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    summary: `${relationshipLabel}에게 ${occasionLabel} 선물로 어울리는 ${giftToneLabel} 무드의 추천을 준비했어요.`,
    recipientLabel: relationshipLabel,
    occasionLabel,
    budgetLabel,
    giftToneLabel,
    items,
    emotionalMessage: items[0]?.message ?? "당신의 마음이 좋은 방식으로 전해지길 바라요.",
    request: normalizedValues,
    createdAt: now,
    source: "local-fallback",
  };
}
