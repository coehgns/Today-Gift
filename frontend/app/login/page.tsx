import { LoginButton } from "@/components/auth/LoginButton";
import { Card } from "@/components/common/Card";

export default function LoginPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
      <Card className="bg-gift-ink text-gift-cream">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gift-gold">Account</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-none tracking-[-0.07em]">추천 기록을 안전하게 이어가기</h1>
        <p className="mt-5 text-sm leading-7 text-gift-cream/75">
          Google OAuth가 준비되면 백엔드에서 로그인과 JWT cookie를 처리합니다. 현재 프론트엔드 개발 중에는 데모 로그인을 통해 전체 화면 흐름을 검증할 수 있습니다.
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-4xl font-black tracking-[-0.06em] text-gift-ink">로그인</h2>
        <p className="mt-3 text-sm leading-6 text-gift-cocoa">
          로그인 후 추천 입력, 결과 저장, 기록 조회 화면에 접근할 수 있어요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LoginButton mode="google" />
          <LoginButton mode="demo" />
        </div>
        <p className="mt-5 rounded-2xl bg-gift-cream p-4 text-xs leading-5 text-gift-cocoa">
          데모 로그인은 브라우저 localStorage만 사용하며, 백엔드가 준비되면 `/me`, `/auth/logout`, `/auth/dev-login` 응답을 우선 사용합니다.
        </p>
      </Card>
    </section>
  );
}
