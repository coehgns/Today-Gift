import { Card } from "@/components/common/Card";
import { DEFAULT_GIFT_OPTIONS, findOptionLabel, getBudgetOption } from "@/lib/constants";
import type { GiftOptions, RecommendationFormValues } from "@/types/recommendation";

function labels(options: GiftOptions, group: keyof GiftOptions, values: string[]) {
  const filtered = values.filter((value) => value !== "any");
  if (filtered.length === 0) return "상관없음";
  return filtered.map((value) => findOptionLabel(options, group, value)).join(", ");
}

export function InputSummary({ values, options = DEFAULT_GIFT_OPTIONS }: { values: RecommendationFormValues; options?: GiftOptions }) {
  const rows = [
    ["관계", findOptionLabel(options, "relationships", values.relationship)],
    ["성별", findOptionLabel(options, "genders", values.gender)],
    ["나이대", findOptionLabel(options, "ageGroups", values.ageGroup)],
    ["MBTI", findOptionLabel(options, "mbtis", values.mbti)],
    ["성향", labels(options, "personalities", values.personalities)],
    ["취미", labels(options, "hobbies", values.hobbies)],
    ["상황", findOptionLabel(options, "occasions", values.occasion)],
    ["톤", findOptionLabel(options, "giftTones", values.giftTone)],
    ["예산", getBudgetOption(values.budgetRange, options).display],
  ];

  return (
    <Card className="bg-gift-cream/80">
      <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-gift-ink">입력 요약</h3>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gift-cocoa/10 bg-white/70 p-4">
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-gift-cocoa/60">{label}</dt>
            <dd className="mt-1 font-semibold text-gift-ink">{value || "-"}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
