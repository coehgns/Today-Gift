import { DEFAULT_GIFT_OPTIONS, findOptionLabel, getBudgetOption } from "@/lib/constants";
import type { GiftOptions, RecommendationFormValues } from "@/types/recommendation";

function labels(options: GiftOptions, group: keyof GiftOptions, values: string[]) {
  const filtered = values.filter((value) => value !== "any");
  if (filtered.length === 0) return "-";
  return filtered.map((value) => findOptionLabel(options, group, value)).join(" ");
}

export function InputSummary({ values, options = DEFAULT_GIFT_OPTIONS }: { values: RecommendationFormValues; options?: GiftOptions }) {
  const target = [
    findOptionLabel(options, "mbtis", values.mbti),
    findOptionLabel(options, "genders", values.gender),
    findOptionLabel(options, "relationships", values.relationship),
  ]
    .filter(Boolean)
    .join(" ");

  const rows = [
    ["대상", target || "-"],
    ["성향", labels(options, "personalities", values.personalities)],
    ["상황", [findOptionLabel(options, "occasions", values.occasion), findOptionLabel(options, "giftTones", values.giftTone)].filter(Boolean).join(" · ") || "-"],
    ["예산", values.budgetRange ? getBudgetOption(values.budgetRange, options).label : "-"],
  ];

  return (
    <div className="rounded-[18px] border border-gift-line bg-gift-cream px-6 py-5">
      <h3 className="text-center text-[17px] font-black tracking-[-0.05em] text-gift-ink">입력 내용을 확인해주세요</h3>
      <dl className="mt-5 divide-y divide-gift-line/70">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-6 py-3 text-[15px]">
            <dt className="text-gift-muted">{label}</dt>
            <dd className="text-right font-bold text-gift-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
