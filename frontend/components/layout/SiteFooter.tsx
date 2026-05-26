import { GiftIcon } from "@/components/common/Icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-gift-line bg-gift-cream py-9 text-center text-gift-muted">
      <div className="flex items-center justify-center gap-2 text-[16px] font-bold text-gift-muted/70">
        <GiftIcon className="size-4" />
        <span>오늘의 선물</span>
      </div>
      <p className="mt-3 text-[14px] text-gift-muted/60">© 2026 오늘의 선물. All rights reserved.</p>
    </footer>
  );
}
