import { HeroGiftIcon, SparkleIcon } from "@/components/common/Icons";
import { LandingStartButton } from "@/components/home/LandingStartButton";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gift-cream px-5 pb-14 pt-16 text-center lg:pb-16 lg:pt-20">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gift-line bg-white px-4 py-2 text-[14px] font-bold text-gift-muted shadow-[0_3px_8px_rgba(39,39,39,0.10)]">
          <SparkleIcon className="size-4 text-gift-orange" />
          AI 기반 맞춤형 선물 큐레이션
        </div>

        <h1 className="relative z-10 mx-auto mt-8 max-w-[980px] font-sans text-[34px] font-black leading-[1.12] tracking-[-0.07em] text-gift-ink sm:text-[44px] lg:text-[54px]">
          고민되는 선물,
          <br />
          <span>
            <span className="hero-title-underline relative inline-block">
              오늘의 선물
              <span className="hero-title-underline-bar absolute bottom-[0.03em] left-0 -z-10 h-[0.18em] w-full rounded-full bg-gift-yellow/80" />
            </span>
            이 대신 골라드려요!
          </span>
        </h1>

        <div className="relative z-10 mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LandingStartButton />
        </div>

        <div className="pointer-events-none relative mx-auto mt-12 size-[240px] sm:size-[290px] lg:mt-14 lg:size-[320px]">
          <span className="hero-floating-bubble absolute -left-5 top-5 z-20 flex size-12 items-center justify-center rounded-full border border-gift-line bg-gift-cream text-gift-yellow-2 shadow-[0_10px_22px_rgba(39,39,39,0.06)] sm:-left-8 sm:top-7 sm:size-14">
            <SparkleIcon className="size-7" />
          </span>
          <span className="hero-floating-bubble hero-floating-bubble-delayed absolute -right-9 bottom-14 z-0 size-14 rounded-full bg-white shadow-[0_10px_22px_rgba(39,39,39,0.08)] sm:-right-14 sm:bottom-16 sm:size-18" />
          <div className="absolute inset-0 z-10 rounded-full bg-white shadow-[0_0_90px_rgba(255,220,90,0.35)]" />
          <HeroGiftIcon className="absolute left-1/2 top-1/2 z-20 size-24 -translate-x-1/2 -translate-y-1/2 text-gift-ink sm:size-32" />
        </div>
      </section>
    </>
  );
}
