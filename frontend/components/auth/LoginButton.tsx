"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { loginAsDemoUser, startGoogleLogin } from "@/lib/auth";

export function LoginButton({ mode = "google" }: { mode?: "google" | "demo" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (mode === "google") {
      startGoogleLogin();
      return;
    }

    setIsLoading(true);
    await loginAsDemoUser();
    router.push("/recommend/form");
    router.refresh();
  };

  if (mode === "google") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex h-[72px] w-full items-center justify-center gap-5 rounded-full border border-gift-line bg-white text-[21px] font-black text-gift-ink shadow-[0_6px_14px_rgba(39,39,39,0.06)] transition hover:bg-gift-soft"
      >
        <span className="text-[26px] text-[#4285f4]">G</span>
        Google로 계속하기
      </button>
    );
  }

  return (
    <Button onClick={handleClick} variant="secondary" disabled={isLoading} className="w-full">
      {isLoading ? "로그인 중…" : "데모로 바로 시작"}
    </Button>
  );
}
