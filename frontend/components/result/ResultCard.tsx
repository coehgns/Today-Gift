import { Card } from "@/components/common/Card";
import type { GiftRecommendation } from "@/types/recommendation";

export function ResultCard({ item, index }: { item: GiftRecommendation; index: number }) {
  return (
    <Card className="group relative overflow-hidden p-0">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gift-clay via-gift-gold to-gift-sage" />
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gift-clay">Pick {index + 1}</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.05em] text-gift-ink">{item.name}</h2>
            <p className="mt-2 text-sm font-semibold text-gift-cocoa">{item.category} · {item.priceRange}</p>
          </div>
          <span className="rounded-full bg-gift-blush px-3 py-1 text-xs font-bold text-gift-ink">{item.confidenceLabel ?? "추천"}</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-gift-cream/70 p-5">
            <h3 className="text-sm font-black text-gift-ink">추천 이유</h3>
            <p className="mt-2 text-sm leading-6 text-gift-cocoa">{item.reason}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5">
            <h3 className="text-sm font-black text-gift-ink">전달 팁</h3>
            <p className="mt-2 text-sm leading-6 text-gift-cocoa">{item.deliveryTip}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-gift-cocoa/10 bg-white/60 px-3 py-1 text-xs font-bold text-gift-cocoa">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
