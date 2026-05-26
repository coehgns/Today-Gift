"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ButtonLink } from "@/components/common/Button";
import { logout, useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/recommend/start", label: "추천 시작" },
  { href: "/history", label: "기록" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, status, refresh } = useCurrentUser();

  const handleLogout = async () => {
    await logout();
    await refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gift-cocoa/10 bg-gift-cream/78 backdrop-blur-2xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-gift-ink text-lg text-gift-cream shadow-[0_12px_30px_rgba(43,33,24,0.22)] transition group-hover:-rotate-3">
            선
          </span>
          <span>
            <span className="block font-display text-xl font-black tracking-[-0.05em] text-gift-ink">오늘의 선물</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gift-cocoa/70">Gift concierge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-gift-cocoa transition hover:bg-white/70 hover:text-gift-ink",
                pathname.startsWith(item.href) && "bg-white text-gift-ink shadow-sm",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="hidden rounded-full border border-gift-cocoa/10 bg-white/50 px-4 py-2 text-xs text-gift-cocoa sm:inline-flex">
              확인 중
            </span>
          ) : user ? (
            <>
              <span className="hidden max-w-38 truncate rounded-full border border-gift-cocoa/10 bg-white/60 px-4 py-2 text-xs font-semibold text-gift-cocoa sm:inline-flex">
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <ButtonLink href="/login" variant="secondary" size="sm">
              로그인
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
