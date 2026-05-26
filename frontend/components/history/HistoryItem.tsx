import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import type { RecommendationHistoryItem } from "@/types/recommendation";

export function HistoryItem({ item }: { item: RecommendationHistoryItem }) {
  return (
    <Link
      href={`/history/${encodeURIComponent(item.id)}`}
      className="group block rounded-[1.75rem] border border-gift-cocoa/12 bg-white/72 p-5 shadow-[0_14px_40px_rgba(80,57,41,0.08)] transition hover:-translate-y-0.5 hover:border-gift-cocoa/30 hover:bg-white"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gift-clay">{formatDateTime(item.createdAt)}</p>
          <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.05em] text-gift-ink">{item.title}</h2>
          <p className="mt-2 text-sm font-semibold text-gift-cocoa">대표 추천: {item.subtitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gift-cocoa/82">{item.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs font-bold text-gift-cocoa">
          <span className="rounded-full bg-gift-cream px-3 py-1">{item.budgetLabel}</span>
          <span className="rounded-full bg-gift-blush px-3 py-1">{item.itemCount}개</span>
        </div>
      </div>
    </Link>
  );
}
