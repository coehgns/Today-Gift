import { AuthGuard } from "@/components/auth/AuthGuard";
import { HistoryList } from "@/components/history/HistoryList";

export default function HistoryPage() {
  return (
    <AuthGuard>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gift-clay">History</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.07em] text-gift-ink">추천 기록</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gift-cocoa">생성한 추천 결과를 다시 열어보고 메시지를 복사할 수 있습니다.</p>
        </div>
        <HistoryList />
      </section>
    </AuthGuard>
  );
}
