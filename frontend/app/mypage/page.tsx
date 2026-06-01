import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";
import { MyPage } from "@/components/mypage/MyPage";

export default function MyPageRoute() {
  return (
    <AuthRedirectGuard>
      <MyPage />
    </AuthRedirectGuard>
  );
}
