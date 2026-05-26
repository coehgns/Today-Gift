import { ButtonLink } from "@/components/common/Button";
import { ClockIcon, GiftIcon, SparkleIcon, TargetIcon } from "@/components/common/Icons";

const methodCards = [
  {
    icon: <ClockIcon className="size-9" />,
    title: "빠른 선택형 입력",
    description: "복잡한 질문이나 타이핑 없이, 준비된 보기를 클릭만 하세요. 60초 안에 끝나요.",
  },
  {
    icon: <TargetIcon className="size-9" />,
    title: "상황 맞춤 추천",
    description: "받는 사람의 관계, 성격, 현재 상황과 예산까지 종합적으로 고려한 센스있는 결과를 제공합니다.",
  },
  {
    icon: <SparkleIcon className="size-9" />,
    title: "감성 메시지 제공",
    description: "선물과 함께 건넬 때 쓸 수 있는 따뜻한 한 마디를 상황에 맞게 작성해 드립니다.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-gift-cream px-5 pt-28 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gift-line bg-white px-5 py-2.5 text-[16px] font-bold text-gift-muted shadow-[0_3px_8px_rgba(39,39,39,0.10)]">
          <SparkleIcon className="size-4 text-gift-orange" />
          AI 기반 맞춤형 선물 큐레이션
        </div>

        <h1 className="display-title relative z-10 mx-auto mt-12 max-w-[1200px] text-[46px] font-black leading-[1.12] text-gift-ink sm:text-[58px] lg:text-[72px]">
          고민되는 선물,
          <br />
          <span className="relative inline-block">
            오늘의 선물이 대신 골라드릴게요
            <span className="absolute bottom-1.5 left-1 -z-10 h-4 w-[38%] rounded-full bg-gift-yellow/45" />
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-[880px] text-[22px] leading-[1.55] text-gift-muted">
          상대방의 취향과 상황을 선택하면 AI가 선물 추천, 추천 이유, 전달 팁, 감성 메시지까지
          <br className="hidden lg:block" />
          제안합니다.
        </p>

        <div className="relative z-10 mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <ButtonLink href="/recommend/form" size="lg" className="min-w-[310px]">
            선물 추천 시작하기 <span className="text-3xl leading-none">→</span>
          </ButtonLink>
          <ButtonLink href="/history" variant="secondary" size="lg" className="min-w-[250px]">
            추천 기록 보기
          </ButtonLink>
        </div>

        <div className="pointer-events-none absolute bottom-[-150px] left-1/2 size-[360px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_90px_rgba(255,220,90,0.35)]">
          <GiftIcon className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 stroke-[2.4] text-gift-ink" />
          <SparkleIcon className="absolute -left-6 top-10 size-10 text-gift-yellow-2" />
          <span className="absolute -right-7 bottom-16 size-20 rounded-full bg-white shadow-[0_8px_18px_rgba(39,39,39,0.08)]" />
        </div>
      </section>

      <section className="bg-white px-5 py-28">
        <div className="mx-auto max-w-[1320px] text-center">
          <h2 className="display-title text-[42px] font-black text-gift-ink">어떻게 추천해주나요?</h2>
          <p className="mt-5 text-[21px] text-gift-muted">단 4단계의 선택만으로 완벽한 선물을 찾아드려요.</p>

          <div className="mt-20 grid gap-9 lg:grid-cols-3">
            {methodCards.map((card) => (
              <article key={card.title} className="rounded-[30px] border border-gift-line bg-white p-10 text-left shadow-[0_1px_0_rgba(39,39,39,0.02)]">
                <div className="flex size-16 items-center justify-center rounded-[20px] bg-white text-gift-yellow-2 shadow-[0_10px_20px_rgba(39,39,39,0.06)]">
                  {card.icon}
                </div>
                <h3 className="mt-14 text-[26px] font-black tracking-[-0.04em] text-gift-ink">{card.title}</h3>
                <p className="mt-5 text-[19px] leading-[1.75] tracking-[-0.04em] text-gift-muted">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
