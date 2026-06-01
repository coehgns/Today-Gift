import { GiftIcon, SparkleIcon } from "@/components/common/Icons";

export function LoadingRecommendation() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gift-cream text-center">
      <div>
        <div className="relative mx-auto mb-16 flex size-28 items-center justify-center text-gift-yellow">
          <SparkleIcon className="absolute -left-16 -top-3 size-9 text-gift-yellow-2" />
          <GiftIcon className="size-24 fill-gift-yellow/20 stroke-[2.2] text-gift-yellow" />
          <SparkleIcon className="absolute -right-16 top-10 size-8 text-gift-orange" />
        </div>
        <p className="text-[20px] font-bold tracking-[-0.05em] text-gift-muted">상대방에게 어울리는 선물을 고르고 있어요</p>
        <div className="mt-12 flex justify-center gap-2.5">
          <span className="loading-dot size-3.5 rounded-full bg-gift-yellow-2" />
          <span className="loading-dot size-3.5 rounded-full bg-gift-yellow-2" />
          <span className="loading-dot size-3.5 rounded-full bg-gift-yellow-2" />
        </div>
      </div>
    </div>
  );
}
