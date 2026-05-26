import { HistoryList } from "@/components/history/HistoryList";

export default function HistoryPage() {
  return (
    <section className="min-h-[calc(100vh-88px)] bg-gift-cream px-5 py-[72px]">
      <div className="mx-auto max-w-[1060px]">
        <div className="mb-20">
          <h1 className="display-title text-[44px] font-black text-gift-ink">추천 기록</h1>
          <p className="mt-4 text-[21px] text-gift-muted">지금까지 받은 선물 추천을 모아봤어요.</p>
        </div>
        <HistoryList />
      </div>
    </section>
  );
}
