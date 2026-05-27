"use client";

import Link from "next/link";
import { Button, ButtonLink } from "@/components/common/Button";
import { GiftIcon } from "@/components/common/Icons";
import { logout, useCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  const { user, status, refresh } = useCurrentUser();

  const handleLogout = async () => {
    await logout();
    await refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gift-line bg-white/96 backdrop-blur-sm">
      <div className="mx-auto flex h-[88px] w-full max-w-[1536px] items-center justify-between px-6 md:px-12 lg:px-16">
        <Link href="/" className="flex items-center gap-3 text-gift-ink">
          <GiftIcon className="size-8 stroke-[2.5]" />
          <span className="font-sans text-[25px] font-black tracking-[-0.06em]">오늘의 선물</span>
        </Link>

        <nav className="flex items-center gap-6 text-[18px] font-bold text-gift-muted">
          <Link className="transition hover:text-gift-ink" href="/history">
            추천 기록
          </Link>
          {status === "authenticated" && user ? (
            <Button onClick={handleLogout} variant="secondary" size="sm" className="h-12 px-7 text-[17px]">
              로그아웃
            </Button>
          ) : (
            <ButtonLink href="/login" variant="secondary" size="sm" className="h-12 bg-gift-soft px-8 text-[17px]">
              로그인
            </ButtonLink>
          )}
        </nav>
      </div>
    </header>
  );
}
