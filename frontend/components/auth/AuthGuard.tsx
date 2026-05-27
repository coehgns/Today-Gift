"use client";

import type { ReactNode } from "react";
import { ButtonLink } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useCurrentUser } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, status } = useCurrentUser();

  if (status === "loading") {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Card className="animate-pulse text-center">
          <p className="text-sm font-semibold text-gift-muted">로그인 상태를 확인하고 있어요…</p>
        </Card>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Card className="text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gift-clay">Login required</p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-gift-ink">추천을 시작하려면 로그인이 필요해요</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gift-muted">
            추천 결과와 기록은 사용자별로 저장됩니다. Google 계정으로 로그인한 뒤 추천을 시작해 주세요.
          </p>
          <ButtonLink href="/login" className="mt-7">
            로그인하러 가기
          </ButtonLink>
        </Card>
      </section>
    );
  }

  return children;
}
