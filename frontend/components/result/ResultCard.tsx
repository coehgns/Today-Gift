"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/common/Icons";
import type { GiftRecommendation } from "@/types/recommendation";

const tagLabels: Record<string, string> = {
  coffee: "카페",
  practical: "실용적인",
  warm: "따뜻한",
  sentimental: "감성적인",
  homebody: "휴식",
  beauty: "향기",
  premium: "고급스러운",
  minimal: "깔끔한",
  tech: "데일리",
  stationery: "기록",
  reading: "독서",
  creative: "추억",
  travel: "여행",
  cute: "귀여운",
  trendy: "센스있는",
  daily: "데일리",
  special: "특별한",
  memory: "추억",
};

function displayTag(tag: string) {
  return tagLabels[tag] ?? tag;
}

function tipLines(value: string) {
  return value
    .split(/[.。]\s*/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export function ResultCard({ item, index }: { item: GiftRecommendation; index: number }) {
  const [copied, setCopied] = useState(false);
  const tips = tipLines(item.deliveryTip);

  const copy = async () => {
    await navigator.clipboard.writeText(item.message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="soft-shell rounded-[28px] px-9 py-11 md:px-12 md:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gift-soft px-4 py-2.5 text-[17px] font-black text-gift-yellow-2">추천 {index + 1}</span>
        {(item.tags?.slice(0, 3) ?? []).map((tag) => (
          <span key={tag} className="rounded-full border border-gift-line bg-gift-soft px-4 py-2.5 text-[17px] font-bold text-gift-muted">
            #{displayTag(tag)}
          </span>
        ))}
      </div>

      <h2 className="display-title mt-7 text-[36px] font-black text-gift-ink">{item.name}</h2>
      <p className="mt-4 text-[21px] font-bold text-gift-muted">예상 가격대: {item.priceRange}</p>

      <section className="mt-10">
        <h3 className="text-[20px] font-black text-gift-ink">추천 이유</h3>
        <p className="mt-5 text-[21px] leading-[1.7] tracking-[-0.04em] text-gift-ink">{item.reason}</p>
      </section>

      <section className="mt-10">
        <h3 className="text-[20px] font-black text-gift-ink">전달 팁</h3>
        <ul className="mt-5 space-y-4 text-[20px] leading-[1.65] tracking-[-0.04em] text-gift-ink">
          {(tips.length ? tips : [item.deliveryTip]).map((tip) => (
            <li key={tip} className="flex gap-5">
              <CheckIcon className="mt-1 size-6 shrink-0 text-gift-yellow-2" />
              <span>{tip.replace(/[.!?]$/, "")}.</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-11 rounded-[20px] border-l-[6px] border-gift-yellow bg-gift-cream px-8 py-7">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-[16px] font-black text-gift-orange">❞ 바로 복사해서 사용할 수 있는 메시지</p>
            <p className="mt-6 text-[23px] leading-[1.6] tracking-[-0.05em] text-gift-ink">“{item.message}”</p>
          </div>
          <button type="button" onClick={copy} className="rounded-xl p-2 text-gift-muted transition hover:bg-white hover:text-gift-ink" aria-label="메시지 복사">
            {copied ? <CheckIcon className="size-8 text-gift-yellow-2" /> : <CopyIcon className="size-8" />}
          </button>
        </div>
      </section>
    </article>
  );
}
