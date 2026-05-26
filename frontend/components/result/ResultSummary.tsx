import { Card } from "@/components/common/Card";
import type { RecommendationResult } from "@/types/recommendation";

export function ResultSummary({ result }: { result: RecommendationResult }) {
  return (
    <Card className="relative overflow-hidden bg-gift-ink text-gift-cream">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-gift-gold/20 blur-3xl" />
      <p className="text-xs font-black uppercase tracking-[0.24em] text-gift-gold">Recommendation ready</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight tracking-[-0.06em] sm:text-6xl">
        {result.summary}
      </h1>
      <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <span className="text-gift-cream/50">상황</span>
          <strong className="mt-1 block text-gift-gold">{result.occasionLabel}</strong>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <span className="text-gift-cream/50">예산</span>
          <strong className="mt-1 block text-gift-gold">{result.budgetLabel}</strong>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <span className="text-gift-cream/50">톤</span>
          <strong className="mt-1 block text-gift-gold">{result.giftToneLabel}</strong>
        </div>
      </div>
    </Card>
  );
}
