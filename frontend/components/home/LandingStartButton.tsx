"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { useCurrentUser } from "@/lib/auth";

export function LandingStartButton() {
  const router = useRouter();
  const { user, status } = useCurrentUser();
  const isCheckingAuth = status === "loading";

  const handleStart = () => {
    if (isCheckingAuth) return;
    router.push(status === "authenticated" && user ? "/recommend/form" : "/login");
  };

  return (
    <Button onClick={handleStart} disabled={isCheckingAuth} size="lg" className="min-w-[230px]">
      선물 추천 시작하기 <span className="text-2xl leading-none">→</span>
    </Button>
  );
}
