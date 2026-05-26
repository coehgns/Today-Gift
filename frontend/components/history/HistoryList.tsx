"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { HistoryItem } from "@/components/history/HistoryItem";
import { listRecommendations } from "@/lib/api";
import type { RecommendationHistoryItem } from "@/types/recommendation";

export function HistoryList() {
  const [items, setItems] = useState<RecommendationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await listRecommendations());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "기록을 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialHistory() {
      try {
        const nextItems = await listRecommendations();
        if (!active) return;
        setItems(nextItems);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "기록을 불러오지 못했어요.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadInitialHistory();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-[2rem] bg-white/50" />;
  }

  if (error) {
    return <ErrorState title="기록을 불러오지 못했어요" description={error} onRetry={load} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 추천 기록이 없어요"
        description="첫 추천을 생성하면 이곳에서 다시 열어볼 수 있습니다."
        actionHref="/recommend/start"
        actionLabel="추천 시작하기"
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
