import { LoginButton } from "@/components/auth/LoginButton";
import { GiftIcon } from "@/components/common/Icons";

type LoginSearchParams = Promise<{
  auth_error?: string | string[];
  auth_error_description?: string | string[];
}>;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  google_not_configured: "Google OAuth 클라이언트 ID가 아직 설정되지 않았어요. 설정을 확인한 뒤 다시 시도해 주세요.",
  invalid_oauth_state: "로그인 세션이 만료되었어요. 다시 시도해 주세요.",
  missing_oauth_code: "Google 로그인 응답이 올바르지 않았어요. 다시 시도해 주세요.",
  access_denied: "Google 로그인이 취소되었어요. 다시 시도해 주세요.",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getAuthErrorMessage(error: string | undefined, description: string | undefined) {
  if (!error) return null;
  if (error === "org_internal") {
    return "현재 Google OAuth 앱이 조직 내부 사용자 전용으로 설정되어 있어요. 개인 Gmail 계정으로는 접근할 수 없으니, Google Cloud Console에서 앱 대상을 External로 바꾸고 테스트 사용자를 추가해 주세요.";
  }
  return AUTH_ERROR_MESSAGES[error] ?? description ?? "Google 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.";
}

export default async function LoginPage({ searchParams }: { searchParams?: LoginSearchParams }) {
  const query = searchParams ? await searchParams : {};
  const authError = firstParam(query.auth_error);
  const authErrorDescription = firstParam(query.auth_error_description);
  const authErrorMessage = getAuthErrorMessage(authError, authErrorDescription);

  return (
    <section className="flex min-h-[calc(100vh-88px)] items-start justify-center bg-gift-cream px-5 pb-20 pt-36">
      <div className="soft-shell w-full max-w-[620px] rounded-[36px] px-12 py-12 text-center">
        <div className="mx-auto flex size-[88px] items-center justify-center rounded-[22px] bg-gift-soft text-gift-yellow-2 shadow-[0_8px_18px_rgba(39,39,39,0.08)]">
          <GiftIcon className="size-10 stroke-[2.3]" />
        </div>
        <h1 className="mt-10 text-[34px] font-black tracking-[-0.055em] text-gift-ink">시작하기 전에 잠깐만요</h1>
        <p className="mt-5 text-[19px] leading-8 text-gift-muted">추천 결과를 저장하고 나중에 다시 확인할 수 있어요.</p>
        <div className="mx-auto mt-10 max-w-[520px]">
          <LoginButton />
        </div>
        {authErrorMessage ? (
          <div className="mx-auto mt-6 rounded-[24px] border border-red-100 bg-red-50 px-6 py-4 text-left text-[15px] leading-7 text-red-700">
            <p className="font-black">Google 로그인 설정을 확인해 주세요</p>
            <p className="mt-2">{authErrorMessage}</p>
          </div>
        ) : null}
        <p className="mt-8 text-[15px] text-gift-muted/55">로그인 시 서비스 이용약관과 개인정보처리방침에 동의하게 됩니다.</p>
      </div>
    </section>
  );
}
