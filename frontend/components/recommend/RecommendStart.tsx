"use client";

import { ButtonLink } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useCurrentUser } from "@/lib/auth";

export function RecommendStart() {
  const { user, status } = useCurrentUser();
  const canStart = status === "authenticated" && user;

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:py-20">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gift-clay">60–90 seconds</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-[-0.07em] text-gift-ink sm:text-7xl">
          몇 번의 선택만으로 선물의 방향을 잡아드릴게요.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gift-cocoa">
          관계, 상황, 예산, 취향을 선택하면 서버가 선물 후보를 먼저 좁히고 AI는 추천 이유와 전달 메시지만 다듬습니다.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          {canStart ? (
            <ButtonLink href="/recommend/form" size="lg">
              입력 시작하기
            </ButtonLink>
          ) : (
            <ButtonLink href="/login" size="lg">
              로그인하고 시작하기
            </ButtonLink>
          )}
          <ButtonLink href="/history" variant="secondary" size="lg">
            지난 추천 보기
          </ButtonLink>
        </div>
      </div>

      <Card className="relative overflow-hidden bg-gift-ink p-7 text-gift-cream">
        <div className="absolute -right-12 -top-12 size-44 rounded-full bg-gift-gold/20 blur-2xl" />
        <h2 className="font-display text-3xl font-black tracking-[-0.05em]">입력하는 정보</h2>
        <ul className="mt-6 space-y-4 text-sm leading-6 text-gift-cream/78">
          {[
            ["대상", "관계 · 성별 · 나이대"],
            ["취향", "MBTI · 성향 · 취미, 잘 모름 선택 가능"],
            ["상황", "생일, 감사, 응원, 집들이 등"],
            ["예산", "5개 예산 범위 중 선택"],
          ].map(([title, desc]) => (
            <li key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <strong className="block text-gift-gold">{title}</strong>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-2xl bg-gift-cream/10 p-4 text-xs leading-5 text-gift-cream/70">
          MVP에서는 자유 채팅이 아니라 선택형 입력만 사용합니다. 개인정보는 추천 기록 저장과 사용자별 조회를 위한 최소 범위로만 사용합니다.
        </p>
      </Card>
    </section>
  );
}
