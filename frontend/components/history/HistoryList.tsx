"use client";

import { useEffect, useState } from "react";
import { HistoryItem } from "@/components/history/HistoryItem";
import { listRecommendations } from "@/lib/api";
import type { RecommendationHistoryItem } from "@/types/recommendation";

const sampleHistory: RecommendationHistoryItem[] = [
  {
    id: "sample-birthday",
    title: "친구 · 3~5만원",
    subtitle: "핸드메이드 향초 세트 외 2건",
    summary: "친구의 생일을 위한 센스있는 선물 추천",
    createdAt: "2023. 10. 24",
    occasionLabel: "생일",
    budgetLabel: "3~5만원",
    itemCount: 3,
  },
  {
    id: "sample-thanks",
    title: "부모님 · 10만원 이상",
    subtitle: "프리미엄 홍삼 세트 외 2건",
    summary: "부모님께 드리는 감사 선물 추천",
    createdAt: "2023. 09. 12",
    occasionLabel: "감사",
    budgetLabel: "10만원 이상",
    itemCount: 3,
  },
  {
    id: "sample-anniversary",
    title: "연인 · 5~10만원",
    subtitle: "커스텀 레터링 케이크 외 2건",
    summary: "기념일을 위한 감동적인 선물 추천",
    createdAt: "2023. 08. 05",
    occasionLabel: "기념일",
    budgetLabel: "5~10만원",
    itemCount: 3,
  },
  {
    id: "sample-cheer",
    title: "직장 동료 · 1~3만원",
    subtitle: "오설록 티 세트 외 2건",
    summary: "동료를 위한 부담없는 응원 선물 추천",
    createdAt: "2023. 05. 15",
    occasionLabel: "응원",
    budgetLabel: "1~3만원",
    itemCount: 3,
  },
];

export function HistoryList() {
  const [items, setItems] = useState<RecommendationHistoryItem[]>(sampleHistory);

  useEffect(() => {
    let active = true;

    async function loadInitialHistory() {
      const nextItems = await listRecommendations();
      if (!active) return;
      setItems(nextItems.length > 0 ? nextItems : sampleHistory);
    }

    void loadInitialHistory();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
