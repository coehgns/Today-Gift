import { DEFAULT_GIFT_OPTIONS, findOptionLabel } from "@/lib/constants";
import type { RecommendationResult } from "@/types/recommendation";

export function buildResultTitle(result: RecommendationResult) {
  const age = findOptionLabel(DEFAULT_GIFT_OPTIONS, "ageGroups", result.request.ageGroup);
  const relation = result.recipientLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "relationships", result.request.relationship);
  const occasion = result.occasionLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "occasions", result.request.occasion);
  const tone = result.giftToneLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "giftTones", result.request.giftTone);
  const agePrefix = age && !age.includes("잘") ? `${age} ` : "";
  return `${agePrefix}${relation}의 ${occasion}을 위한\n${tone} 선물 추천`;
}

export function ResultSummary({ result }: { result: RecommendationResult }) {
  return (
    <section className="bg-white px-5 pb-28 pt-12">
      <div className="mx-auto max-w-[1080px]">
        <a href="/recommend/form" className="inline-flex items-center gap-2 text-[19px] font-bold text-gift-muted transition hover:text-gift-ink">
          ‹ 다시 추천받기
        </a>
        <h1 className="display-title mt-10 whitespace-pre-line text-[44px] font-black text-gift-ink md:text-[54px]">
          {buildResultTitle(result)}
        </h1>
        <p className="mt-6 text-[22px] text-gift-muted">오늘의 선물이 정성껏 골라봤어요.</p>
      </div>
    </section>
  );
}
