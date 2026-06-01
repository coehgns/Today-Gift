import Link from "next/link";
import { CalendarIcon, ChevronRightIcon, TrashIcon } from "@/components/common/Icons";
import type { RecommendationHistoryItem } from "@/types/recommendation";

export function HistoryItem({
  item,
  isDeleting = false,
  onDelete,
}: {
  item: RecommendationHistoryItem;
  isDeleting?: boolean;
  onDelete: (item: RecommendationHistoryItem) => void;
}) {
  return (
    <article className="group rounded-[18px] border border-gift-line bg-white px-6 py-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(39,39,39,0.06)]">
      <div className="flex items-center justify-between gap-5">
        <Link href={`/history/${encodeURIComponent(item.id)}`} className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 text-[15px] text-gift-muted">
            <CalendarIcon className="size-4 shrink-0" />
            {formatHistoryDate(item.createdAt)}
          </div>
          <span className="mt-3 inline-flex rounded-full bg-gift-soft px-3 py-1.5 text-[13px] font-black text-gift-yellow-2">
            {item.occasionLabel}
          </span>
          <h2 className="mt-2.5 text-[19px] font-black tracking-[-0.05em] text-gift-ink">{item.subtitle}</h2>
          <p className="mt-2 text-[15px] text-gift-muted">{item.title}</p>
        </Link>
        <div className="flex shrink-0 flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={isDeleting}
              aria-label={`${item.subtitle} 삭제`}
              className="grid size-10 place-items-center rounded-full border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <TrashIcon className="size-[18px]" />
            </button>
            <Link href={`/history/${encodeURIComponent(item.id)}`} aria-label={`${item.subtitle} 상세 보기`} className="grid size-10 place-items-center rounded-full bg-gift-soft text-gift-yellow-2 transition group-hover:bg-gift-yellow group-hover:text-gift-ink">
              <ChevronRightIcon className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatHistoryDate(value: string) {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoDate) return `${isoDate[1]}. ${isoDate[2]}. ${isoDate[3]}.`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}
