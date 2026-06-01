import Link from "next/link";
import { DEFAULT_GIFT_OPTIONS, findOptionLabel } from "@/lib/constants";
import type { RecommendationResult } from "@/types/recommendation";

export function buildResultTitle(result: RecommendationResult) {
  const age = findOptionLabel(DEFAULT_GIFT_OPTIONS, "ageGroups", result.request.ageGroup);
  const relation = result.recipientLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "relationships", result.request.relationship);
  const occasion = result.occasionLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "occasions", result.request.occasion);
  const tone = result.giftToneLabel || findOptionLabel(DEFAULT_GIFT_OPTIONS, "giftTones", result.request.giftTone);
  const agePrefix = age && !age.includes("잘") ? `${age} ` : "";
  return `${agePrefix}${relation}의 ${occasion}을 위한 ${tone} 선물 추천`;
}

export function ResultSummary({
  result,
  backHref = "/mypage",
  backLabel = "마이페이지로 돌아가기",
}: {
  result: RecommendationResult;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="bg-white px-5 pb-16 pt-9">
      <div className="mx-auto max-w-[1180px]">
        <Link href={backHref} className="inline-flex items-center gap-2 text-[15px] font-bold text-gift-muted transition hover:text-gift-ink">
          ‹ {backLabel}
        </Link>
        <h1 className="display-title mt-7 whitespace-normal text-[30px] font-black text-gift-ink sm:text-[34px] md:whitespace-nowrap lg:text-[40px]">
          {buildResultTitle(result)}
        </h1>
        <p className="mt-4 text-[17px] text-gift-muted">오늘의 선물이 정성껏 골라봤어요.</p>
      </div>
    </section>
  );
}
