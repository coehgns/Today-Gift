export type OptionItem = {
  value: string;
  label: string;
  description?: string;
};

export type BudgetRangeOption = OptionItem & {
  min: number;
  max: number | null;
  display: string;
};

export type GiftOptions = {
  relationships: OptionItem[];
  genders: OptionItem[];
  ageGroups: OptionItem[];
  mbtis: OptionItem[];
  personalities: OptionItem[];
  hobbies: OptionItem[];
  occasions: OptionItem[];
  giftTones: OptionItem[];
  budgetRanges: BudgetRangeOption[];
};

export type RecommendationFormValues = {
  relationship: string;
  gender: string;
  ageGroup: string;
  mbti: string;
  personalities: string[];
  hobbies: string[];
  occasion: string;
  giftTone: string;
  budgetRange: string;
};

export type RecommendationRequestPayload = {
  relationship: string;
  gender: string;
  age_group: string;
  mbti: string;
  personality: string[];
  personalities: string[];
  hobbies: string[];
  budget_range: string;
  budget_min: number;
  budget_max: number | null;
  occasion: string;
  gift_tone: string;
};

export type GiftRecommendation = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  reason: string;
  deliveryTip: string;
  message: string;
  tags?: string[];
  imageHint?: string;
  confidenceLabel?: string;
};

export type RecommendationResult = {
  id: string;
  summary: string;
  recipientLabel: string;
  occasionLabel: string;
  budgetLabel: string;
  giftToneLabel: string;
  items: GiftRecommendation[];
  emotionalMessage: string;
  request: RecommendationFormValues;
  createdAt: string;
  source: "api" | "local-fallback";
};

export type RecommendationHistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  createdAt: string;
  occasionLabel: string;
  budgetLabel: string;
  itemCount: number;
};
