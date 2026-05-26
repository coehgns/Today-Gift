import { ButtonLink } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const features = [
  ["선택형 입력", "채팅 없이 60~90초 안에 관계, 상황, 예산, 취향을 고릅니다."],
  ["서버 후보 필터링", "AI가 상품을 지어내지 않도록 seed 후보에서 먼저 좁힙니다."],
  ["전달 메시지", "추천 이유와 함께 바로 복사 가능한 감성 메시지를 제공합니다."],
];

export default function Home() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-24">
      <div className="absolute left-[8%] top-24 hidden size-24 rounded-[2rem] border border-gift-cocoa/10 bg-white/35 rotate-12 animate-float-slow lg:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-gift-clay">Today Gift</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.08em] text-gift-ink sm:text-7xl lg:text-8xl">
            선물 고민을 90초 안에 끝내는 작은 컨시어지.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-gift-cocoa sm:text-xl">
            오늘의 선물은 관계, 상황, 예산을 바탕으로 어울리는 후보를 고르고 추천 이유와 전달 메시지까지 정리해주는 AI 선물 추천 MVP입니다.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/recommend/start" size="lg">
              추천 시작하기
            </ButtonLink>
            <ButtonLink href="/history" variant="secondary" size="lg">
              추천 기록 보기
            </ButtonLink>
          </div>
        </div>

        <Card className="relative overflow-hidden bg-white/62 p-5 sm:p-7">
          <div className="absolute -right-14 -top-14 size-52 rounded-full bg-gift-gold/25 blur-3xl" />
          <div className="rounded-[1.75rem] bg-gift-ink p-6 text-gift-cream shadow-[0_26px_70px_rgba(43,33,24,0.25)]">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gift-gold">Sample result</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-[-0.06em]">따뜻하지만 실용적인 생일 선물</h2>
            <div className="mt-6 space-y-3">
              {[
                "싱글오리진 드립백 커피 세트",
                "오브제 룸 프래그런스",
                "날짜 없는 데일리 저널과 펜 세트",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
                  <span className="grid size-8 place-items-center rounded-full bg-gift-gold text-sm font-black text-gift-ink">{index + 1}</span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-2xl bg-gift-cream/10 p-4 text-sm leading-6 text-gift-cream/78">
              “잠깐의 향으로도 오늘이 조금 부드러워졌으면 좋겠어요.”
            </p>
          </div>
        </Card>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {features.map(([title, description]) => (
          <Card key={title} className="p-5">
            <h3 className="font-display text-2xl font-black tracking-[-0.05em] text-gift-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gift-cocoa">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
