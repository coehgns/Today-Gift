export function LoadingRecommendation() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gift-ink/35 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/30 bg-gift-cream p-8 text-center shadow-[0_30px_90px_rgba(43,33,24,0.35)]">
        <div className="mx-auto mb-6 size-16 animate-spin rounded-full border-4 border-gift-cocoa/15 border-t-gift-ink" />
        <h2 className="font-display text-3xl font-black tracking-[-0.05em] text-gift-ink">선물 후보를 고르는 중</h2>
        <p className="mt-3 text-sm leading-6 text-gift-cocoa">
          예산과 상황에 맞는 후보를 추리고, 전달 메시지까지 다듬고 있어요.
        </p>
      </div>
    </div>
  );
}
