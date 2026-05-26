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
    reason: readString(record.reason ?? record.recommendation_reason, "입력 조건과 잘 맞는 후보예요."),
    deliveryTip: readString(record.deliveryTip ?? record.delivery_tip ?? record.tip, "짧은 손편지와 함께 전달해보세요."),
    message: readString(record.message ?? record.emotional_message, "당신의 마음이 잘 전해지길 바라요."),
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

export async function getRecommendation(id: string): Promise<RecommendationResult> {
  try {
    const raw = await apiRequest<unknown>(`/recommendations/${encodeURIComponent(id)}`);
    const normalized = normalizeRecommendation(raw);
    storeLocalResult(normalized);
    return normalized;
  } catch {
    const local = getLocalResults().find((item) => item.id === id);
    if (local) return local;
    throw new ApiError("추천 결과를 찾을 수 없습니다.", 404);
  }
}

function normalizeHistoryItem(raw: unknown): RecommendationHistoryItem | null {
  const record = recordFrom(raw);
  const id = readString(record.id);
  if (!id) return null;

  return {
    id,
    title: `${readString(record.relationship, "추천 대상")} · ${readString(record.occasion, "상황")}`,
    subtitle: readString(record.representative_gift_name, "추천 결과"),
    summary: readString(record.summary, "추천 결과를 확인해보세요."),
    createdAt: readString(record.created_at ?? record.createdAt, new Date().toISOString()),
    occasionLabel: readString(record.occasion, "상황"),
    budgetLabel: readString(record.budget_range ?? record.budgetRange, "예산"),
    itemCount: 3,
  };
}

export async function listRecommendations(): Promise<RecommendationHistoryItem[]> {
  try {
    const raw = await apiRequest<unknown>("/recommendations");
    const items = arrayFrom(recordFrom(raw).items ?? raw);
    const historyItems = items.map(normalizeHistoryItem).filter((item): item is RecommendationHistoryItem => item !== null);
    if (historyItems.length > 0) return historyItems;

    const normalized = items.map((item) => normalizeRecommendation(item));
    normalized.forEach(storeLocalResult);
    return normalized.map(toHistoryItem);
  } catch {
    return getLocalResults().map(toHistoryItem);
  }
}

export function toHistoryItem(result: RecommendationResult): RecommendationHistoryItem {
  const firstItem = result.items[0]?.name ?? "추천 결과";
  return {
    id: result.id,
    title: `${result.recipientLabel} · ${result.occasionLabel}`,
    subtitle: firstItem,
    summary: result.summary,
    createdAt: result.createdAt,
    occasionLabel: result.occasionLabel,
    budgetLabel: result.budgetLabel,
    itemCount: result.items.length,
  };
}
