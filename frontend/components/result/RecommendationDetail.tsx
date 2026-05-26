"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/common/Button";
import { ErrorState } from "@/components/common/ErrorState";
import { MessageBox } from "@/components/result/MessageBox";
import { ResultCard } from "@/components/result/ResultCard";
import { ResultSummary } from "@/components/result/ResultSummary";
import { getRecommendation } from "@/lib/api";
import type { RecommendationResult } from "@/types/recommendation";

export function RecommendationDetail({ id, fromHistory = false }: { id: string; fromHistory?: boolean }) {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await getRecommendation(id));
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
        const nextResult = await getRecommendation(id);
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
  }, [id]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="h-80 animate-pulse rounded-[2rem] bg-white/50" />
      </section>
    );
  }

  if (error || !result) {
    return <section className="px-5 py-16"><ErrorState title="결과를 찾을 수 없어요" description={error ?? "추천 결과가 없습니다."} onRetry={load} /></section>;
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-5 py-10 sm:px-8 sm:py-16">
      <ResultSummary result={result} />
      <div className="grid gap-5">
        {result.items.map((item, index) => (
          <ResultCard key={item.id} item={item} index={index} />
        ))}
      </div>
      <MessageBox message={result.emotionalMessage} />
      {result.source === "local-fallback" ? (
        <p className="rounded-2xl border border-gift-cocoa/10 bg-white/60 p-4 text-sm text-gift-cocoa">
          백엔드 API가 연결되지 않아 프론트엔드의 정적 후보 카탈로그로 생성한 개발용 결과입니다.
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/recommend/form">다시 추천받기</ButtonLink>
        <ButtonLink href={fromHistory ? "/history" : "/history"} variant="secondary">기록 보기</ButtonLink>
      </div>
    </section>
  );
}
