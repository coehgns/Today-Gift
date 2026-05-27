import { GitHubIcon, GiftIcon } from "@/components/common/Icons";

const GITHUB_REPOSITORY_URL = "https://github.com/coehgns/Today-Gift";

export function SiteFooter() {
  return (
    <footer className="border-t border-gift-line bg-gift-cream py-9 text-center text-gift-muted">
      <div className="flex items-center justify-center gap-2 text-[16px] font-bold text-gift-muted/70">
        <GiftIcon className="size-4" />
        <span>오늘의 선물</span>
      </div>
      <a
        href={GITHUB_REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-gift-line bg-white px-4 py-2 text-[14px] font-bold text-gift-ink transition hover:-translate-y-0.5 hover:border-gift-yellow hover:text-gift-yellow-2"
        aria-label="Today-Gift GitHub 저장소 열기"
      >
        <GitHubIcon className="size-4" />
        <span>Today-Gift</span>
      </a>
      <p className="mt-3 text-[14px] text-gift-muted/60">© 2026 오늘의 선물. All rights reserved.</p>
    </footer>
  );
}
