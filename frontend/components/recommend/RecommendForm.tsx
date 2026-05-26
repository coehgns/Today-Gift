"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { InputSummary } from "@/components/recommend/InputSummary";
import { LoadingRecommendation } from "@/components/recommend/LoadingRecommendation";
import { OptionCard } from "@/components/recommend/OptionCard";
import { OptionChip } from "@/components/recommend/OptionChip";
import { StepProgress } from "@/components/recommend/StepProgress";
import { DEFAULT_GIFT_OPTIONS, EMPTY_RECOMMENDATION_FORM } from "@/lib/constants";
import { createRecommendation, getGiftOptions } from "@/lib/api";
import type { GiftOptions, OptionItem, RecommendationFormValues } from "@/types/recommendation";

const DRAFT_KEY = "today-gift:recommendation-draft";
const steps = ["대상", "취향", "상황", "예산", "요약"];

function readDraft(): RecommendationFormValues {
  if (typeof window === "undefined") return EMPTY_RECOMMENDATION_FORM;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_RECOMMENDATION_FORM, ...(JSON.parse(raw) as Partial<RecommendationFormValues>) } : EMPTY_RECOMMENDATION_FORM;
  } catch {
    return EMPTY_RECOMMENDATION_FORM;
  }
}

function FieldGroup({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-gift-clay">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.06em] text-gift-ink sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ChipList({ items, selected, onToggle }: { items: OptionItem[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <OptionChip key={item.value} label={item.label} selected={selected.includes(item.value)} onSelect={() => onToggle(item.value)} />
      ))}
    </div>
  );
}

export function RecommendForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RecommendationFormValues>(() => readDraft());
  const [options, setOptions] = useState<GiftOptions>(DEFAULT_GIFT_OPTIONS);
  const [optionSource, setOptionSource] = useState<"api" | "local-fallback">("local-fallback");
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getGiftOptions().then((result) => {
      if (!active) return;
      setOptions(result.options);
      setOptionSource(result.source);
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

  const selectedBudget = useMemo(
    () => options.budgetRanges.find((item) => item.value === values.budgetRange),
    [options.budgetRanges, values.budgetRange],
  );

  const setValue = <K extends keyof RecommendationFormValues>(key: K, value: RecommendationFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const toggleMulti = (key: "personalities" | "hobbies", value: string) => {
    setValues((current) => {
      if (value === "any") return { ...current, [key]: current[key].includes("any") ? [] : ["any"] };
      const withoutAny = current[key].filter((item) => item !== "any");
      const next = withoutAny.includes(value) ? withoutAny.filter((item) => item !== value) : [...withoutAny, value];
      return { ...current, [key]: next };
    });
  };

  const isStepValid = useMemo(() => {
    if (step === 0) return Boolean(values.relationship && values.gender && values.ageGroup);
    if (step === 1) return Boolean(values.mbti);
    if (step === 2) return Boolean(values.occasion && values.giftTone);
    if (step === 3) return Boolean(values.budgetRange);
    return Boolean(values.relationship && values.ageGroup && values.occasion && values.giftTone && values.budgetRange);
  }, [step, values]);

  const goNext = () => {
    if (!isStepValid) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isStepValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createRecommendation(values);
      if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/recommend/result/${encodeURIComponent(result.id)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "추천 생성에 실패했어요.");
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions) {
    return (
      <Card className="mx-auto max-w-3xl animate-pulse text-center">
        <p className="text-sm font-semibold text-gift-cocoa">입력 옵션을 불러오고 있어요…</p>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="추천을 만들지 못했어요" description={error} onRetry={() => setError(null)} />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {isSubmitting ? <LoadingRecommendation /> : null}
      <StepProgress steps={steps} currentStep={step} />

      <Card className="relative overflow-hidden p-5 sm:p-8">
        <div className="absolute right-8 top-8 hidden rounded-full border border-gift-cocoa/10 bg-white/70 px-3 py-1 text-xs font-bold text-gift-cocoa lg:block">
          {optionSource === "api" ? "API 옵션 사용 중" : "개발용 fallback 옵션"}
        </div>

        {step === 0 ? (
          <FieldGroup eyebrow="Step 01" title="누구에게 전할 선물인가요?">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {options.relationships.map((item) => (
                <OptionCard
                  key={item.value}
                  label={item.label}
                  description={item.description}
                  selected={values.relationship === item.value}
                  onSelect={() => setValue("relationship", item.value)}
                />
              ))}
            </div>
            <div className="grid gap-6 pt-4 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold text-gift-ink">성별</h3>
                <div className="flex flex-wrap gap-2">
                  {options.genders.map((item) => (
                    <OptionChip key={item.value} label={item.label} selected={values.gender === item.value} onSelect={() => setValue("gender", item.value)} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-gift-ink">나이대</h3>
                <div className="flex flex-wrap gap-2">
                  {options.ageGroups.map((item) => (
                    <OptionChip key={item.value} label={item.label} selected={values.ageGroup === item.value} onSelect={() => setValue("ageGroup", item.value)} />
                  ))}
                </div>
              </div>
            </div>
          </FieldGroup>
        ) : null}

        {step === 1 ? (
          <FieldGroup eyebrow="Step 02" title="상대의 취향을 가볍게 짚어볼게요">
            <div>
              <h3 className="mb-3 text-sm font-bold text-gift-ink">MBTI</h3>
              <div className="flex max-h-40 flex-wrap gap-2 overflow-auto rounded-3xl border border-gift-cocoa/10 bg-gift-cream/60 p-3">
                {options.mbtis.map((item) => (
                  <OptionChip key={item.value} label={item.label} selected={values.mbti === item.value} onSelect={() => setValue("mbti", item.value)} />
                ))}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold text-gift-ink">성향</h3>
                <ChipList items={options.personalities} selected={values.personalities} onToggle={(value) => toggleMulti("personalities", value)} />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-gift-ink">취미</h3>
                <ChipList items={options.hobbies} selected={values.hobbies} onToggle={(value) => toggleMulti("hobbies", value)} />
              </div>
            </div>
          </FieldGroup>
        ) : null}

        {step === 2 ? (
          <FieldGroup eyebrow="Step 03" title="어떤 순간에 건네나요?">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {options.occasions.map((item) => (
                <OptionCard
                  key={item.value}
                  label={item.label}
                  description={item.description}
                  selected={values.occasion === item.value}
                  onSelect={() => setValue("occasion", item.value)}
                />
              ))}
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold text-gift-ink">원하는 선물 톤</h3>
              <div className="flex flex-wrap gap-2">
                {options.giftTones.map((item) => (
                  <OptionChip key={item.value} label={item.label} selected={values.giftTone === item.value} onSelect={() => setValue("giftTone", item.value)} />
                ))}
              </div>
            </div>
          </FieldGroup>
        ) : null}

        {step === 3 ? (
          <FieldGroup eyebrow="Step 04" title="예산 범위를 골라주세요">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {options.budgetRanges.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setValue("budgetRange", item.value)}
                  className={`rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-0.5 ${
                    values.budgetRange === item.value ? "border-gift-ink bg-gift-ink text-gift-cream" : "border-gift-cocoa/12 bg-white/72 text-gift-ink"
                  }`}
                >
                  <span className="block font-display text-xl font-bold tracking-[-0.04em]">{item.label}</span>
                  <span className="mt-2 block text-xs opacity-70">{item.display}</span>
                </button>
              ))}
            </div>
            {selectedBudget ? <p className="text-sm text-gift-cocoa">선택한 예산: {selectedBudget.display}</p> : null}
          </FieldGroup>
        ) : null}

        {step === 4 ? (
          <FieldGroup eyebrow="Step 05" title="이 조건으로 추천을 만들까요?">
            <InputSummary values={values} options={options} />
          </FieldGroup>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gift-cocoa/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0 || isSubmitting}>
            이전
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            {step < steps.length - 1 ? (
              <Button onClick={goNext} disabled={!isStepValid || isSubmitting}>
                다음 단계
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid || isSubmitting}>
                추천 생성하기
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
