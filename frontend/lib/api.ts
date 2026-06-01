import {
  DEFAULT_GIFT_OPTIONS,
  EMPTY_RECOMMENDATION_FORM,
  buildRecommendationPayload,
  createDemoRecommendation,
  findOptionLabel,
  getBudgetOption,
} from "@/lib/constants";
import type {
  BudgetRangeOption,
  GiftOptions,
  GiftRecommendation,
  OptionItem,
  RecommendationFormValues,
  RecommendationHistoryItem,
  RecommendationResult,
} from "@/types/recommendation";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");
const LOCAL_RESULTS_KEY = "today-gift:recommendation-results";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => readString(item)).filter(Boolean);
}

const TEXT_LABEL_REPLACEMENTS: Record<string, string> = {
  none: "모름",
  unknown: "모름",
  casual: "부담없는",
};

for (const option of [
  ...DEFAULT_GIFT_OPTIONS.relationships,
  ...DEFAULT_GIFT_OPTIONS.genders,
  ...DEFAULT_GIFT_OPTIONS.ageGroups,
  ...DEFAULT_GIFT_OPTIONS.personalities,
  ...DEFAULT_GIFT_OPTIONS.hobbies,
  ...DEFAULT_GIFT_OPTIONS.occasions,
  ...DEFAULT_GIFT_OPTIONS.giftTones,
  ...DEFAULT_GIFT_OPTIONS.budgetRanges,
]) {
  TEXT_LABEL_REPLACEMENTS[option.value] = option.label;
}

function replaceOptionCodes(value: string) {
  let next = value;
  for (const [code, label] of Object.entries(TEXT_LABEL_REPLACEMENTS)) {
    if (!code || code === label) continue;
    next = next.replace(new RegExp(`(^|[^A-Za-z0-9_])${escapeRegExp(code)}(?=$|[^A-Za-z0-9_])`, "g"), `$1${label}`);
  }
  return next;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function recordFrom(value: unknown): JsonRecord {
  const parsed = parseMaybeJson(value);
  return isRecord(parsed) ? parsed : {};
}

function arrayFrom(value: unknown): unknown[] {
  const parsed = parseMaybeJson(value);
  return Array.isArray(parsed) ? parsed : [];
}

function optionFrom(value: unknown): OptionItem | null {
  if (typeof value === "string") return { value, label: value };
  if (!isRecord(value)) return null;

  const label = readString(value.label ?? value.name ?? value.title);
  const optionValue = readString(value.value ?? value.key ?? value.id ?? value.code, label);
  if (!optionValue) return null;

  return {
    value: optionValue,
    label: label || optionValue,
    description: readString(value.description ?? value.help_text) || undefined,
  };
}

function toOptionArray(value: unknown, fallback: OptionItem[]) {
  const options = arrayFrom(value).map(optionFrom).filter((item): item is OptionItem => item !== null);
  return options.length > 0 ? options : fallback;
}

function toBudgetArray(value: unknown, fallback: BudgetRangeOption[]) {
  const options = arrayFrom(value)
    .map((item) => {
      const option = optionFrom(item);
      if (!option) return null;
      const record = recordFrom(item);
      const min = readNumber(record.min ?? record.budget_min, 0);
      const rawMax = record.max ?? record.budget_max;
      const max = rawMax === null ? null : readNumber(rawMax, fallback[0]?.max ?? 30000);
      return {
        ...option,
        min,
        max,
        display: readString(record.display, option.label),
      } satisfies BudgetRangeOption;
    })
    .filter((item): item is BudgetRangeOption => item !== null);

  return options.length > 0 ? options : fallback;
}

export function apiUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? ((await response.json()) as unknown) : await response.text();

  if (!response.ok) {
    const message = isRecord(payload)
      ? readString(payload.message ?? payload.detail ?? payload.error, `API 요청 실패 (${response.status})`)
      : `API 요청 실패 (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export async function getHealth() {
  return apiRequest<{ status: string }>("/health");
}

export async function getGiftOptions(): Promise<{ options: GiftOptions; source: "api" | "local-fallback" }> {
  try {
    const raw = await apiRequest<unknown>("/gifts/options");
    const record = recordFrom(raw);
    return {
      source: "api",
      options: {
        relationships: toOptionArray(record.relationships ?? record.relationship_options, DEFAULT_GIFT_OPTIONS.relationships),
        genders: toOptionArray(record.genders ?? record.gender_options, DEFAULT_GIFT_OPTIONS.genders),
        ageGroups: toOptionArray(record.ageGroups ?? record.age_groups ?? record.age_group_options, DEFAULT_GIFT_OPTIONS.ageGroups),
        mbtis: toOptionArray(record.mbtis ?? record.mbti_types ?? record.mbti_options, DEFAULT_GIFT_OPTIONS.mbtis),
        personalities: toOptionArray(record.personalities ?? record.personality_options, DEFAULT_GIFT_OPTIONS.personalities),
        hobbies: toOptionArray(record.hobbies ?? record.hobby_options, DEFAULT_GIFT_OPTIONS.hobbies),
        occasions: toOptionArray(record.occasions ?? record.occasion_options, DEFAULT_GIFT_OPTIONS.occasions),
        giftTones: toOptionArray(record.giftTones ?? record.gift_tones ?? record.gift_tone_options, DEFAULT_GIFT_OPTIONS.giftTones),
        budgetRanges: toBudgetArray(record.budgetRanges ?? record.budget_ranges ?? record.budget_options, DEFAULT_GIFT_OPTIONS.budgetRanges),
      },
    };
  } catch {
    return { source: "local-fallback", options: DEFAULT_GIFT_OPTIONS };
  }
}

function getLocalResults(): RecommendationResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_RESULTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as RecommendationResult[]) : [];
  } catch {
    return [];
  }
}

function storeLocalResult(result: RecommendationResult) {
  if (typeof window === "undefined") return;
  const next = [result, ...getLocalResults().filter((item) => item.id !== result.id)].slice(0, 30);
  window.localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(next));
}

function removeLocalResult(id: string) {
  if (typeof window === "undefined") return false;
  const current = getLocalResults();
  const next = current.filter((item) => item.id !== id);
  window.localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(next));
  return next.length !== current.length;
}

function normalizeFormValues(raw: unknown): RecommendationFormValues {
  const record = recordFrom(raw);
  const budgetMin = record.budget_min ?? record.budgetMin;
  const budgetMax = record.budget_max ?? record.budgetMax;
  const budgetRange = readString(record.budgetRange ?? record.budget_range);
  const matchedBudget = budgetRange
    ? budgetRange
    : DEFAULT_GIFT_OPTIONS.budgetRanges.find((option) => {
        const min = readNumber(budgetMin, -1);
        const max = budgetMax === null ? null : readNumber(budgetMax, -1);
        return option.min === min && option.max === max;
      })?.value ?? "";

  return {
    relationship: readString(record.relationship, EMPTY_RECOMMENDATION_FORM.relationship),
    gender: readString(record.gender, EMPTY_RECOMMENDATION_FORM.gender),
    ageGroup: readString(record.ageGroup ?? record.age_group, EMPTY_RECOMMENDATION_FORM.ageGroup),
    mbti: readString(record.mbti, EMPTY_RECOMMENDATION_FORM.mbti),
    personalities: readStringArray(record.personalities ?? record.personality_json ?? record.personality),
    hobbies: readStringArray(record.hobbies ?? record.hobbies_json ?? record.hobby),
    occasion: readString(record.occasion, EMPTY_RECOMMENDATION_FORM.occasion),
    giftTone: readString(record.giftTone ?? record.gift_tone, EMPTY_RECOMMENDATION_FORM.giftTone),
    budgetRange: matchedBudget,
  };
}

function normalizeItem(raw: unknown, index: number): GiftRecommendation | null {
  const record = recordFrom(raw);
  const name = readString(record.name ?? record.gift_name ?? record.title);
  if (!name) return null;

  return {
    id: readString(record.id ?? record.gift_id, `gift-${index + 1}`),
    name,
    category: readString(record.category, "추천 선물"),
    priceRange: readString(record.priceRange ?? record.price_range ?? record.price, "예산 내"),
    reason: replaceOptionCodes(readString(record.reason ?? record.recommendation_reason, "입력 조건과 잘 맞는 후보예요.")),
    deliveryTip: replaceOptionCodes(readString(record.deliveryTip ?? record.delivery_tip ?? record.tip, "짧은 손편지와 함께 전달해보세요.")),
    message: replaceOptionCodes(readString(record.message ?? record.emotional_message, "당신의 마음이 잘 전해지길 바라요.")),
    tags: readStringArray(record.tags).slice(0, 4),
    imageHint: readString(record.imageHint ?? record.image_hint) || undefined,
    confidenceLabel: readString(record.confidenceLabel ?? record.confidence_label) || undefined,
  };
}

function normalizeRecommendation(raw: unknown, fallbackValues?: RecommendationFormValues): RecommendationResult {
  const record = recordFrom(raw);
  const resultRecord = recordFrom(record.result_json ?? record.result ?? record.data ?? raw);
  const request = normalizeFormValues(record.request ?? record.recommendation_request ?? resultRecord.request ?? fallbackValues ?? EMPTY_RECOMMENDATION_FORM);
  const generatedFallback = createDemoRecommendation(request);
  const itemCandidates =
    arrayFrom(resultRecord.items).length > 0
      ? arrayFrom(resultRecord.items)
      : arrayFrom(resultRecord.recommendations).length > 0
        ? arrayFrom(resultRecord.recommendations)
        : arrayFrom(record.items);
  const items = itemCandidates.map(normalizeItem).filter((item): item is GiftRecommendation => item !== null).slice(0, 3);

  return {
    ...generatedFallback,
    id: readString(record.id ?? resultRecord.id, generatedFallback.id),
    summary: readString(resultRecord.summary ?? record.summary, generatedFallback.summary),
    emotionalMessage: readString(
      resultRecord.emotionalMessage ?? resultRecord.emotional_message ?? resultRecord.message ?? record.emotional_message,
      generatedFallback.emotionalMessage,
    ),
    request,
    items: items.length >= 3 ? items : generatedFallback.items,
    recipientLabel: readString(resultRecord.recipientLabel, findOptionLabel(DEFAULT_GIFT_OPTIONS, "relationships", request.relationship)),
    occasionLabel: readString(resultRecord.occasionLabel, findOptionLabel(DEFAULT_GIFT_OPTIONS, "occasions", request.occasion)),
    budgetLabel: readString(resultRecord.budgetLabel, getBudgetOption(request.budgetRange).label),
    giftToneLabel: readString(resultRecord.giftToneLabel, findOptionLabel(DEFAULT_GIFT_OPTIONS, "giftTones", request.giftTone)),
    createdAt: readString(record.created_at ?? record.createdAt ?? resultRecord.createdAt, new Date().toISOString()),
    source: "api",
  };
}

export async function createRecommendation(values: RecommendationFormValues): Promise<RecommendationResult> {
  const payload = buildRecommendationPayload(values);
  try {
    const raw = await apiRequest<unknown>("/recommendations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const normalized = normalizeRecommendation(raw, values);
    storeLocalResult(normalized);
    return normalized;
  } catch {
    const fallback = createDemoRecommendation(values);
    storeLocalResult(fallback);
    return fallback;
  }
}


function getSampleRecommendation(id: string): RecommendationResult | null {
  const base: RecommendationFormValues = {
    relationship: "friend",
    gender: "none",
    ageGroup: "twenties",
    mbti: "unknown",
    personalities: ["sentimental"],
    hobbies: ["photo"],
    occasion: "birthday",
    giftTone: "trendy",
    budgetRange: "30000_50000",
  };

  const samples: Record<string, RecommendationResult> = {
    "sample-birthday": {
      id: "sample-birthday",
      summary: "20대 친구의 생일을 위한 센스있는 선물 추천",
      recipientLabel: "친구",
      occasionLabel: "생일",
      budgetLabel: "3~5만원",
      giftToneLabel: "센스있는",
      request: base,
      createdAt: "2023-10-24T00:00:00.000Z",
      source: "local-fallback",
      emotionalMessage: "요즘 많이 바쁘고 힘들지? 이 향초 켜두고 잠시나마 푹 쉬었으면 좋겠어. 항상 응원하고 있어, 생일 축하해!",
      items: [
        {
          id: "sample-candle",
          name: "핸드메이드 향초 세트",
          category: "향기/휴식",
          priceRange: "3~5만원",
          reason: "최근 스트레스가 많다고 했던 친구에게 따뜻한 위로가 될 수 있어요. 은은한 향이 마음을 편안하게 해주고, 인테리어 소품으로도 훌륭합니다.",
          deliveryTip: "친구가 평소 좋아하는 향(우디, 플로럴 등)을 미리 알아두면 좋아요. 예쁜 성냥이나 캔들 워머를 함께 선물하면 센스가 돋보여요.",
          message: "요즘 많이 바쁘고 힘들지? 이 향초 켜두고 잠시나마 푹 쉬었으면 좋겠어. 항상 응원하고 있어, 생일 축하해!",
          tags: ["trendy", "sentimental", "homebody"],
          confidenceLabel: "추천 1",
        },
        {
          id: "sample-wallet",
          name: "미니멀 가죽 카드지갑",
          category: "패션소품",
          priceRange: "3~5만원",
          reason: "항상 카드를 주머니에 넣고 다니는 친구에게 꼭 필요한 실용적인 아이템이에요. 매일 사용하면서 선물한 사람을 떠올릴 수 있습니다.",
          deliveryTip: "친구의 평소 옷차림에 잘 어울리는 무난한 색상(블랙, 브라운 등)을 추천해요. 이니셜 각인 서비스가 있다면 활용해보세요.",
          message: "매일 들고 다니는 작은 물건도 너답게 깔끔했으면 해서 골랐어. 생일 축하해!",
          tags: ["practical", "minimal", "daily"],
          confidenceLabel: "추천 2",
        },
        {
          id: "sample-polaroid",
          name: "감성 폴라로이드 카메라",
          category: "추억/취미",
          priceRange: "10만원 이상",
          reason: "사진 찍는 걸 좋아하는 친구에게 완벽한 선물이에요. 스마트폰 사진과는 다른 아날로그 감성으로 특별한 순간을 기록할 수 있습니다.",
          deliveryTip: "필름 1~2팩을 꼭 함께 선물하세요. 바로 찍어볼 수 있게요. 선물 전달하는 날, 첫 장을 함께 찍어보세요.",
          message: "우리 앞으로 더 많은 좋은 추억 남기자. 오늘 너의 가장 예쁜 모습부터 이 카메라에 담아줄게. 생일 정말 축하해!",
          tags: ["special", "memory", "sentimental"],
          confidenceLabel: "추천 3",
        },
      ],
    },
  };

  return samples[id] ?? null;
}

export async function getRecommendation(
  id: string,
  { allowLocalFallback = true }: { allowLocalFallback?: boolean } = {},
): Promise<RecommendationResult> {
  try {
    const raw = await apiRequest<unknown>(`/recommendations/${encodeURIComponent(id)}`);
    const normalized = normalizeRecommendation(raw);
    storeLocalResult(normalized);
    return normalized;
  } catch (error) {
    if (!allowLocalFallback) {
      throw error;
    }
    const sample = getSampleRecommendation(id);
    if (sample) return sample;
    const local = getLocalResults().find((item) => item.id === id);
    if (local) return local;
    throw new ApiError("추천 결과를 찾을 수 없습니다.", 404);
  }
}

function normalizeHistoryItem(raw: unknown): RecommendationHistoryItem | null {
  const record = recordFrom(raw);
  const id = readString(record.id);
  if (!id) return null;

  const relationship = readString(record.relationship, "추천 대상");
  const occasion = readString(record.occasion, "상황");
  const budgetRange = readString(record.budget_range ?? record.budgetRange, "예산");
  const relationshipLabel = findOptionLabel(DEFAULT_GIFT_OPTIONS, "relationships", relationship);
  const occasionLabel = findOptionLabel(DEFAULT_GIFT_OPTIONS, "occasions", occasion);
  const budgetLabel = formatBudgetLabel(budgetRange);

  return {
    id,
    title: `${relationshipLabel} · ${budgetLabel}`,
    subtitle: readString(record.representative_gift_name, "추천 결과"),
    summary: readString(record.summary, "추천 결과를 확인해보세요."),
    createdAt: readString(record.created_at ?? record.createdAt, new Date().toISOString()),
    occasionLabel,
    budgetLabel,
    itemCount: 3,
  };
}

function formatBudgetLabel(value: string) {
  if (!value) return "예산";
  const matched = DEFAULT_GIFT_OPTIONS.budgetRanges.find((item) => item.value === value || item.label === value);
  return matched?.label ?? value;
}

export async function listRecommendations({ allowLocalFallback = true }: { allowLocalFallback?: boolean } = {}): Promise<RecommendationHistoryItem[]> {
  try {
    const raw = await apiRequest<unknown>("/recommendations");
    const items = arrayFrom(recordFrom(raw).items ?? raw);
    const historyItems = items.map(normalizeHistoryItem).filter((item): item is RecommendationHistoryItem => item !== null);
    if (historyItems.length > 0) return historyItems;

    const normalized = items.map((item) => normalizeRecommendation(item));
    normalized.forEach(storeLocalResult);
    return normalized.map(toHistoryItem);
  } catch (error) {
    if (allowLocalFallback) return getLocalResults().map(toHistoryItem);
    throw error;
  }
}

export async function deleteRecommendation(id: string, { allowLocalFallback = true }: { allowLocalFallback?: boolean } = {}): Promise<void> {
  try {
    await apiRequest<unknown>(`/recommendations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    removeLocalResult(id);
  } catch (error) {
    if (allowLocalFallback && removeLocalResult(id)) return;
    throw error;
  }
}

export function toHistoryItem(result: RecommendationResult): RecommendationHistoryItem {
  const firstItem = result.items[0]?.name ?? "추천 결과";
  return {
    id: result.id,
    title: `${result.recipientLabel} · ${result.budgetLabel}`,
    subtitle: firstItem,
    summary: result.summary,
    createdAt: result.createdAt,
    occasionLabel: result.occasionLabel,
    budgetLabel: result.budgetLabel,
    itemCount: result.items.length,
  };
}
