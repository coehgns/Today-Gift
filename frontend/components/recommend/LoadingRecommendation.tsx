import { GiftIcon, SparkleIcon } from "@/components/common/Icons";

export function LoadingRecommendation() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gift-cream text-center">
      <div>
        <div className="relative mx-auto mb-20 flex size-32 items-center justify-center text-gift-yellow">
          <SparkleIcon className="absolute -left-20 -top-4 size-11 text-gift-yellow-2" />
          <GiftIcon className="size-28 fill-gift-yellow/20 stroke-[2.2] text-gift-yellow" />
          <SparkleIcon className="absolute -right-20 top-12 size-10 text-gift-orange" />
        </div>
        <p className="text-[24px] font-bold tracking-[-0.05em] text-gift-muted">상대방에게 어울리는 선물을 고르고 있어요</p>
        <div className="mt-16 flex justify-center gap-3">
          <span className="loading-dot size-4 rounded-full bg-gift-yellow-2" />
          <span className="loading-dot size-4 rounded-full bg-gift-yellow-2" />
          <span className="loading-dot size-4 rounded-full bg-gift-yellow-2" />
        </div>
      </div>
    </div>
  );
}
