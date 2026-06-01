"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/common/Button";
import { ErrorState } from "@/components/common/ErrorState";
import { ResultCard } from "@/components/result/ResultCard";
import { ResultSummary } from "@/components/result/ResultSummary";
import { getRecommendation } from "@/lib/api";
import type { RecommendationResult } from "@/types/recommendation";

export function RecommendationDetail({ id, fromHistory = false }: { id: string; fromHistory?: boolean }) {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const allowLocalFallback = !fromHistory;

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await getRecommendation(id, { allowLocalFallback }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "추천 결과를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialRecommendation() {
      try {
        const nextResult = await getRecommendation(id, { allowLocalFallback });
        if (!active) return;
        setResult(nextResult);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "추천 결과를 불러오지 못했어요.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadInitialRecommendation();

    return () => {
      active = false;
    };
  }, [allowLocalFallback, id]);

  if (isLoading) {
    return <div className="min-h-[calc(100vh-70px)] bg-gift-cream" />;
  }

  if (error || !result) {
    return (
      <section className="min-h-[calc(100vh-70px)] bg-gift-cream px-5 py-12">
        <ErrorState title="결과를 찾을 수 없어요" description={error ?? "추천 결과가 없습니다."} onRetry={load} />
      </section>
    );
  }

  return (
    <div>
      <ResultSummary
        result={result}
        backHref="/mypage"
        backLabel="마이페이지로 돌아가기"
      />
      <section className="bg-gift-cream px-5 pb-20 pt-10">
        <div className="mx-auto max-w-[920px] space-y-7">
          {result.items.map((item, index) => (
            <ResultCard key={item.id} item={item} index={index} />
          ))}

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <ButtonLink href="/recommend/form" size="lg" className="min-w-[180px]">
              다시 추천받기
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
