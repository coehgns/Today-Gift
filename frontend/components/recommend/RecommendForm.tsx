"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseIcon,
  CakeIcon,
  ClockIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  QuestionIcon,
  SmileIcon,
  SparkleIcon,
  UserIcon,
  UsersIcon,
} from "@/components/common/Icons";
import { InputSummary } from "@/components/recommend/InputSummary";
import { LoadingRecommendation } from "@/components/recommend/LoadingRecommendation";
import { OptionCard } from "@/components/recommend/OptionCard";
import { OptionChip } from "@/components/recommend/OptionChip";
import { DEFAULT_GIFT_OPTIONS, EMPTY_RECOMMENDATION_FORM } from "@/lib/constants";
import { createRecommendation, getGiftOptions } from "@/lib/api";
import type { GiftOptions, OptionItem, RecommendationFormValues } from "@/types/recommendation";

const DRAFT_KEY = "today-gift:recommendation-draft";
const stepTitles = ["누구에게 주나요?", "어떤 사람인가요?", "어떤 상황인가요?", "예산"];

function readDraft(): RecommendationFormValues {
  if (typeof window === "undefined") return EMPTY_RECOMMENDATION_FORM;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_RECOMMENDATION_FORM, ...(JSON.parse(raw) as Partial<RecommendationFormValues>) } : EMPTY_RECOMMENDATION_FORM;
  } catch {
    return EMPTY_RECOMMENDATION_FORM;
  }
}

function QuestionTitle({ index, title, helper }: { index: number; title: string; helper?: string }) {
  return (
    <div className="mb-7 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <span className="grid size-9 place-items-center rounded-full bg-gift-soft text-[20px] font-black text-gift-yellow-2">{index}</span>
        <h2 className="text-[25px] font-black tracking-[-0.05em] text-gift-ink">{title}</h2>
      </div>
      {helper ? <span className="text-[16px] font-bold text-gift-muted/60">{helper}</span> : null}
    </div>
  );
}

function StepChrome({ step }: { step: number }) {
  const width = `${((step + 1) / stepTitles.length) * 100}%`;
  return (
    <div className="mx-auto mb-10 max-w-[1080px] px-3 text-center">
      {step > 0 ? (
        <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-gift-soft px-4 py-2 text-[16px] font-black text-gift-yellow-2">
          <ClockIcon className="size-4" />
          60초면 완료됩니다
        </div>
      ) : null}
      <div className="mb-4 text-[20px] font-black tracking-[-0.04em] text-gift-muted">
        Step {step + 1} / 4 <span className="mx-4 text-gift-line">|</span>
        <span className="text-gift-ink">{stepTitles[step]}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#eee9d8]">
        <div className="h-full rounded-full bg-gift-yellow transition-all duration-300" style={{ width }} />
      </div>
    </div>
  );
}

function relationIcon(label: string) {
  if (label.includes("친구")) return <UsersIcon className="size-10" />;
  if (label.includes("연인")) return <HeartIcon className="size-10" />;
  if (label.includes("가족")) return <HomeIcon className="size-10" />;
  if (label.includes("동료") || label.includes("직장")) return <BriefcaseIcon className="size-10" />;
  if (label.includes("부모")) return <UserIcon className="size-10" />;
  return <QuestionIcon className="size-10" />;
}

function occasionIcon(label: string) {
  if (label.includes("생일")) return <CakeIcon className="size-10" />;
  if (label.includes("기념")) return <HeartIcon className="size-10" />;
  if (label.includes("감사")) return <GiftIcon className="size-10" />;
  if (label.includes("위로")) return <HeartIcon className="size-10" />;
  if (label.includes("응원") || label.includes("축하")) return <SparkleIcon className="size-10" />;
  return <SmileIcon className="size-10" />;
}

function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="soft-shell mx-auto max-w-[1080px] rounded-[32px] px-9 py-11 md:px-12 md:py-12">{children}</div>;
}

function ChipList({ items, selected, onToggle }: { items: OptionItem[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <OptionChip key={item.value} label={item.label} selected={selected.includes(item.value)} onSelect={() => onToggle(item.value)} />
      ))}
    </div>
  );
}

function normalizeCustomText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function resolveCustomValue(items: OptionItem[], rawValue: string) {
  const normalized = normalizeCustomText(rawValue);
  if (!normalized) return "";
  const existing = items.find((item) => item.value === normalized || item.label === normalized);
  return existing?.value ?? normalized;
}

function CustomMultiChips({ selected, items, onRemove }: { selected: string[]; items: OptionItem[]; onRemove: (value: string) => void }) {
  const knownValues = new Set(items.map((item) => item.value));
  const customValues = selected.filter((value) => value && value !== "any" && !knownValues.has(value));

  if (customValues.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {customValues.map((value) => (
        <OptionChip key={value} label={value} selected onSelect={() => onRemove(value)} />
      ))}
    </div>
  );
}

function CustomSingleChip({ value, items, onClear }: { value: string; items: OptionItem[]; onClear: () => void }) {
  const isKnownValue = items.some((item) => item.value === value);
  if (!value || isKnownValue) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <OptionChip label={value} selected onSelect={onClear} />
    </div>
  );
}

function DirectOptionInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel = "추가",
  ariaLabel,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel?: string;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const trimmed = normalizeCustomText(value);
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        disabled={disabled}
        placeholder={disabled ? "최대 3개까지 선택했어요" : placeholder}
        className="min-h-[52px] flex-1 rounded-full border border-gift-line bg-white px-5 text-[17px] font-bold text-gift-ink outline-none transition placeholder:text-gift-muted/45 focus:border-gift-yellow-2 focus:ring-4 focus:ring-gift-yellow/20 disabled:bg-[#f7f2e6] disabled:text-gift-muted/50"
      />
      <button
        type="button"
        onClick={onSubmit}
        aria-label={ariaLabel ?? buttonLabel}
        disabled={!trimmed || disabled}
        className="min-h-[52px] rounded-full border border-gift-line bg-gift-soft px-7 text-[17px] font-black text-gift-ink transition hover:border-gift-yellow-2 hover:bg-gift-yellow disabled:cursor-not-allowed disabled:bg-[#eee6cf] disabled:text-gift-muted/45"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function FooterActions({ step, canGoNext, isSubmitting, onPrevious, onNext, onSubmit }: {
  step: number;
  canGoNext: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-12 border-t border-gift-line pt-8">
      <div className="flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={step === 0 || isSubmitting}
          className="h-16 min-w-[140px] rounded-full border border-gift-line bg-white px-10 text-[22px] font-black text-gift-muted shadow-[0_8px_16px_rgba(39,39,39,0.04)] transition hover:border-gift-yellow-2 hover:text-gift-ink disabled:cursor-not-allowed disabled:bg-[#f7f2e6] disabled:text-gift-muted/35 disabled:shadow-none"
        >
          이전
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isSubmitting}
            className="h-16 min-w-[165px] rounded-full bg-gift-yellow px-10 text-[22px] font-black text-gift-ink shadow-[0_10px_18px_rgba(245,185,46,0.18)] transition hover:bg-[#ffd545] disabled:bg-[#eee6cf] disabled:text-gift-muted/50"
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canGoNext || isSubmitting}
            className="h-16 min-w-[185px] rounded-full bg-gift-yellow px-10 text-[22px] font-black text-gift-ink shadow-[0_10px_18px_rgba(245,185,46,0.18)] transition hover:bg-[#ffd545] disabled:bg-[#eee6cf] disabled:text-gift-muted/50"
          >
            추천 받기
          </button>
        )}
      </div>
    </div>
  );
}

export function RecommendForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RecommendationFormValues>(() => readDraft());
  const [options, setOptions] = useState<GiftOptions>(DEFAULT_GIFT_OPTIONS);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInputs, setCustomInputs] = useState({
    personality: "",
    hobby: "",
    occasion: "",
    giftTone: "",
  });

  useEffect(() => {
    let active = true;
    getGiftOptions().then((result) => {
      if (!active) return;
      // The backend can supply a broader taxonomy, but this UI is designed around
      // the compact four-step Korean labels from the product reference.
      // Keep the network read for integration readiness while preserving the
      // curated option order/wording users see in the flow.
      void result;
      setOptions(DEFAULT_GIFT_OPTIONS);
      setIsLoadingOptions(false);
    }).catch(() => {
      if (!active) return;
      setOptions(DEFAULT_GIFT_OPTIONS);
      setIsLoadingOptions(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    }
  }, [values]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const setValue = <K extends keyof RecommendationFormValues>(key: K, value: RecommendationFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const setCustomInput = (key: keyof typeof customInputs, value: string) => {
    setCustomInputs((current) => ({ ...current, [key]: value }));
  };

  const toggleMulti = (key: "personalities" | "hobbies", value: string) => {
    setValues((current) => {
      const selected = current[key];
      if (value === "any" || value.includes("상관")) return { ...current, [key]: selected.includes(value) ? [] : [value] };
      const withoutAny = selected.filter((item) => item !== "any" && !item.includes("상관"));
      const next = withoutAny.includes(value)
        ? withoutAny.filter((item) => item !== value)
        : withoutAny.length >= 3
          ? withoutAny
          : [...withoutAny, value];
      return { ...current, [key]: next };
    });
  };

  const addCustomMulti = (key: "personalities" | "hobbies", inputKey: "personality" | "hobby", optionItems: OptionItem[]) => {
    const nextValue = resolveCustomValue(optionItems, customInputs[inputKey]);
    if (!nextValue) return;

    setValues((current) => {
      const selected = current[key].filter((item) => item !== "any" && !item.includes("상관"));
      if (selected.includes(nextValue) || selected.length >= 3) return current;
      return { ...current, [key]: [...selected, nextValue] };
    });
    setCustomInput(inputKey, "");
  };

  const applyCustomSingle = (key: "occasion" | "giftTone", inputKey: "occasion" | "giftTone", optionItems: OptionItem[]) => {
    const nextValue = resolveCustomValue(optionItems, customInputs[inputKey]);
    if (!nextValue) return;
    setValue(key, nextValue);
    setCustomInput(inputKey, "");
  };

  const canGoNext = useMemo(() => {
    if (step === 0) return Boolean(values.relationship && values.gender && values.ageGroup);
    if (step === 1) return true;
    if (step === 2) return Boolean(values.occasion && values.giftTone);
    return Boolean(values.budgetRange);
  }, [step, values]);

  const handleNext = () => {
    if (!canGoNext) return;
    setStep((current) => Math.min(current + 1, 3));
  };

  const handleSubmit = async () => {
    if (!canGoNext) return;
    setIsSubmitting(true);
    const result = await createRecommendation(values);
    if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
    router.push(`/recommend/result/${encodeURIComponent(result.id)}`);
  };

  const personalityOptions = options.personalities.filter((item) => !item.label.includes("상관"));
  const hobbyOptions = options.hobbies.filter((item) => !item.label.includes("상관") && !item.label.includes("모름"));
  const occasionOptions = options.occasions.slice(0, 6);
  const giftToneOptions = options.giftTones.slice(0, 4);

  if (isLoadingOptions) {
    return <LoadingRecommendation />;
  }

  return (
    <section className="min-h-[calc(100vh-88px)] bg-gift-cream px-5 py-7">
      {isSubmitting ? <LoadingRecommendation /> : null}
      <StepChrome step={step} />

      <CardShell>
        {step === 0 ? (
          <div>
            <QuestionTitle index={1} title="어떤 관계인가요?" />
            <div className="grid gap-5 md:grid-cols-3">
              {options.relationships.slice(0, 6).map((item) => (
                <OptionCard key={item.value} label={item.label} icon={relationIcon(item.label)} selected={values.relationship === item.value} onSelect={() => setValue("relationship", item.value)} />
              ))}
            </div>

            <div className="mt-12">
              <QuestionTitle index={2} title="성별은 어떻게 되나요?" />
              <div className="flex flex-wrap gap-3">
                {options.genders.map((item) => (
                  <OptionChip key={item.value} label={item.label} selected={values.gender === item.value} onSelect={() => setValue("gender", item.value)} />
                ))}
              </div>
            </div>

            <div className="mt-12">
              <QuestionTitle index={3} title="연령대는 어떻게 되나요?" />
              <div className="flex flex-wrap gap-3">
                {options.ageGroups.map((item) => (
                  <OptionChip key={item.value} label={item.label} selected={values.ageGroup === item.value} onSelect={() => setValue("ageGroup", item.value)} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <QuestionTitle index={1} title="MBTI를 아시나요?" helper="선택사항" />
            <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
              {options.mbtis.filter((item) => !item.label.includes("모름")).map((item) => (
                <OptionChip key={item.value} label={item.label} selected={values.mbti === item.value} onSelect={() => setValue("mbti", item.value)} className="w-full px-4" />
              ))}
              <OptionChip label="모름" selected={values.mbti === "unknown" || values.mbti === "모름"} onSelect={() => setValue("mbti", options.mbtis.find((item) => item.label.includes("모름"))?.value ?? "unknown")} className="col-span-full w-full" />
            </div>

            <div className="mt-14">
              <QuestionTitle index={2} title="어떤 성격인가요?" helper="최대 3개" />
              <ChipList items={personalityOptions} selected={values.personalities} onToggle={(value) => toggleMulti("personalities", value)} />
              <CustomMultiChips selected={values.personalities} items={personalityOptions} onRemove={(value) => toggleMulti("personalities", value)} />
              <DirectOptionInput
                value={customInputs.personality}
                onChange={(value) => setCustomInput("personality", value)}
                onSubmit={() => addCustomMulti("personalities", "personality", personalityOptions)}
                placeholder="직접 입력해보세요. 예: 다정한, 계획적인"
                ariaLabel="성격 직접 입력 추가"
                disabled={values.personalities.filter((value) => value !== "any").length >= 3}
              />
            </div>

            <div className="mt-14">
              <QuestionTitle index={3} title="관심사나 취미가 있나요?" helper="최대 3개" />
              <ChipList items={hobbyOptions} selected={values.hobbies} onToggle={(value) => toggleMulti("hobbies", value)} />
              <CustomMultiChips selected={values.hobbies} items={hobbyOptions} onRemove={(value) => toggleMulti("hobbies", value)} />
              <DirectOptionInput
                value={customInputs.hobby}
                onChange={(value) => setCustomInput("hobby", value)}
                onSubmit={() => addCustomMulti("hobbies", "hobby", hobbyOptions)}
                placeholder="직접 입력해보세요. 예: 베이킹, 반려동물"
                ariaLabel="관심사나 취미 직접 입력 추가"
                disabled={values.hobbies.filter((value) => value !== "any").length >= 3}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <QuestionTitle index={1} title="어떤 상황인가요?" />
            <div className="grid gap-5 md:grid-cols-3">
              {occasionOptions.map((item) => (
                <OptionCard key={item.value} label={item.label} icon={occasionIcon(item.label)} selected={values.occasion === item.value} onSelect={() => setValue("occasion", item.value)} />
              ))}
            </div>
            <CustomSingleChip value={values.occasion} items={occasionOptions} onClear={() => setValue("occasion", "")} />
            <DirectOptionInput
              value={customInputs.occasion}
              onChange={(value) => setCustomInput("occasion", value)}
              onSubmit={() => applyCustomSingle("occasion", "occasion", occasionOptions)}
              placeholder="상황을 직접 입력해보세요. 예: 졸업, 집들이, 퇴사"
              buttonLabel="적용"
              ariaLabel="상황 직접 입력 적용"
            />

            <div className="mt-14">
              <QuestionTitle index={2} title="어떤 느낌의 선물을 원하시나요?" />
              <div className="flex flex-wrap gap-3">
                {giftToneOptions.map((item) => (
                  <OptionChip key={item.value} label={item.label} selected={values.giftTone === item.value} onSelect={() => setValue("giftTone", item.value)} />
                ))}
              </div>
              <CustomSingleChip value={values.giftTone} items={giftToneOptions} onClear={() => setValue("giftTone", "")} />
              <DirectOptionInput
                value={customInputs.giftTone}
                onChange={(value) => setCustomInput("giftTone", value)}
                onSubmit={() => applyCustomSingle("giftTone", "giftTone", giftToneOptions)}
                placeholder="원하는 느낌을 직접 입력해보세요. 예: 귀여운, 고급스러운"
                buttonLabel="적용"
                ariaLabel="선물 느낌 직접 입력 적용"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <QuestionTitle index={1} title="예산은 어느 정도인가요?" />
            <div className="space-y-4">
              {options.budgetRanges.slice(0, 5).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setValue("budgetRange", item.value)}
                  className={`min-h-[104px] w-full rounded-[18px] border bg-white px-6 py-6 text-center transition hover:border-gift-yellow-2 ${values.budgetRange === item.value ? "border-gift-yellow bg-gift-soft ring-2 ring-gift-yellow" : "border-gift-line"}`}
                >
                  <span className="block text-[23px] font-black tracking-[-0.05em] text-gift-ink">{item.label}</span>
                  <span className="mt-2 block text-[16px] font-bold text-gift-muted/55">{item.description ?? item.display}</span>
                </button>
              ))}
            </div>
            <div className="mt-12">
              <InputSummary values={values} options={options} />
            </div>
          </div>
        ) : null}

        <FooterActions
          step={step}
          canGoNext={canGoNext}
          isSubmitting={isSubmitting}
          onPrevious={() => setStep((current) => Math.max(current - 1, 0))}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </CardShell>
    </section>
  );
}
