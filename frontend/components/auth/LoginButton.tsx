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
    router.push("/recommend/start");
    router.refresh();
  };

  return (
    <Button onClick={handleClick} variant={mode === "google" ? "primary" : "secondary"} disabled={isLoading}>
      {isLoading ? "로그인 중…" : mode === "google" ? "Google로 로그인" : "데모로 바로 시작"}
    </Button>
  );
}
