"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/common/Button";
import { GiftIcon } from "@/components/common/Icons";
import { useCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  const { user, status } = useCurrentUser();
  const isAuthenticated = status === "authenticated" && user;

  return (
    <header className="sticky top-0 z-40 border-b border-gift-line bg-white/96 backdrop-blur-sm">
      <div className="mx-auto flex h-[70px] w-full max-w-[1320px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-gift-ink">
          <GiftIcon className="size-6 stroke-[2.5]" />
          <span className="font-sans text-[20px] font-black tracking-[-0.06em]">오늘의 선물</span>
        </Link>

        <nav className="flex items-center gap-4 text-[15px] font-bold text-gift-muted">
          {isAuthenticated ? (
            <ButtonLink href="/mypage" variant="secondary" size="sm" className="h-10 px-6 text-[15px]">
              마이페이지
            </ButtonLink>
          ) : (
            <ButtonLink href="/login" variant="secondary" size="sm" className="h-10 bg-gift-soft px-6 text-[15px]">
              로그인
            </ButtonLink>
          )}
        </nav>
      </div>
    </header>
  );
}
