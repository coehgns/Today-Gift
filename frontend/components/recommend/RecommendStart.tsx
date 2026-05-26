"use client";

import { ButtonLink } from "@/components/common/Button";
import { GiftIcon } from "@/components/common/Icons";
import { useCurrentUser } from "@/lib/auth";

export function RecommendStart() {
  const { user, status } = useCurrentUser();
  const canStart = status === "authenticated" && user;

  return (
    <section className="grid min-h-[calc(100vh-88px)] place-items-center bg-gift-cream px-5 py-20">
      <div className="soft-shell w-full max-w-[720px] rounded-[34px] px-10 py-11 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-[22px] bg-gift-soft text-gift-yellow-2">
          <GiftIcon className="size-10" />
        </div>
        <p className="mt-8 inline-flex rounded-full bg-gift-soft px-4 py-2 text-[16px] font-black text-gift-yellow-2">60초면 완료됩니다</p>
        <h1 className="display-title mx-auto mt-7 max-w-[560px] text-[38px] font-black text-gift-ink">
          몇 번의 선택만으로 선물의 방향을 잡아드릴게요.
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-8 text-gift-muted">
          관계, 취향, 상황, 예산을 고르면 오늘의 선물이 추천 이유와 전달 메시지까지 정리합니다.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href={canStart ? "/recommend/form" : "/login"} size="lg" className="min-w-[220px]">
            {canStart ? "입력 시작하기" : "로그인하고 시작하기"}
          </ButtonLink>
          <ButtonLink href="/history" variant="secondary" size="lg" className="min-w-[220px]">
            지난 추천 보기
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
