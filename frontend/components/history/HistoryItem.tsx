import Link from "next/link";
import { CalendarIcon, ChevronRightIcon } from "@/components/common/Icons";
import type { RecommendationHistoryItem } from "@/types/recommendation";

export function HistoryItem({ item }: { item: RecommendationHistoryItem }) {
  return (
    <Link href={`/history/${encodeURIComponent(item.id)}`} className="block rounded-[22px] border border-gift-line bg-white px-8 py-8 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(39,39,39,0.06)]">
      <div className="flex items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-[20px] text-gift-muted">
            <CalendarIcon className="size-5" />
            {item.createdAt}
          </div>
          <h2 className="mt-5 text-[24px] font-black tracking-[-0.05em] text-gift-ink">{item.subtitle}</h2>
          <p className="mt-3 text-[19px] text-gift-muted">{item.title}</p>
        </div>
        <div className="flex flex-col items-center gap-6">
          <span className="rounded-full bg-gift-soft px-4 py-2 text-[16px] font-black text-gift-yellow-2">{item.occasionLabel}</span>
          <span className="grid size-14 place-items-center rounded-full bg-gift-soft text-gift-yellow-2">
            <ChevronRightIcon className="size-7" />
          </span>
        </div>
      </div>
    </Link>
  );
}
