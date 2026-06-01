"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { GiftIcon } from "@/components/common/Icons";
import { HistoryList } from "@/components/history/HistoryList";
import { logout, useCurrentUser } from "@/lib/auth";

function getInitial(name: string, email: string) {
  const source = name.trim() || email.trim() || "U";
  return source.slice(0, 1).toUpperCase();
}

export function MyPage() {
  const { user, status } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = "/";
  };

  if (status === "loading" || !user) {
    return (
      <section className="min-h-[calc(100vh-70px)] bg-gift-cream px-5 py-12">
        <div className="mx-auto max-w-[900px]">
          <div className="h-40 animate-pulse rounded-[24px] border border-gift-line bg-white/70" />
        </div>
      </section>
    );
  }

  const profileImageUrl = user.profileImageUrl?.trim();
  const safeProfileImageUrl = profileImageUrl?.replaceAll('"', "%22");

  return (
    <section className="min-h-[calc(100vh-70px)] bg-gift-cream px-5 py-12">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8">
          <p className="inline-flex rounded-full bg-white px-3 py-1.5 text-[13px] font-black text-gift-yellow-2 shadow-[0_8px_18px_rgba(50,44,32,0.04)]">
            Google 계정
          </p>
          <h1 className="display-title mt-3.5 text-[32px] font-black text-gift-ink">마이페이지</h1>
          <p className="mt-2.5 text-[16px] text-gift-muted">내 계정 정보와 저장된 선물 추천 기록을 확인할 수 있어요.</p>
        </div>

        <div className="soft-shell mb-10 overflow-hidden rounded-[24px] bg-white">
          <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="grid size-[62px] shrink-0 place-items-center rounded-[18px] border border-gift-line bg-gift-soft bg-cover bg-center text-[24px] font-black text-gift-yellow-2 shadow-[0_14px_28px_rgba(50,44,32,0.08)]"
                style={safeProfileImageUrl ? { backgroundImage: `url("${safeProfileImageUrl}")` } : undefined}
                aria-label={`${user.name} 프로필 이미지`}
              >
                {!safeProfileImageUrl ? getInitial(user.name, user.email) : null}
              </div>
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-[13px] font-black text-gift-muted">
                  <GiftIcon className="size-4 text-gift-yellow-2" />
                  <span>오늘의 선물 계정</span>
                </div>
                <h2 className="truncate text-[23px] font-black tracking-[-0.055em] text-gift-ink">{user.name}</h2>
                <p className="mt-1 truncate text-[15px] font-semibold text-gift-muted">{user.email}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-10 min-w-[112px] px-6 text-[15px]"
            >
              {isLoggingOut ? "로그아웃 중" : "로그아웃"}
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="display-title text-[29px] font-black text-gift-ink">추천 기록</h2>
            <p className="mt-2 text-[15px] text-gift-muted">이 계정으로 저장한 선물 추천을 모아봤어요.</p>
          </div>
        </div>

        <HistoryList />
      </div>
    </section>
  );
}
