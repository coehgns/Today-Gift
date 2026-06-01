"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";

export function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, status } = useCurrentUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading" || status === "unauthenticated" || !user) {
    return <div className="min-h-[calc(100vh-70px)] bg-gift-cream" />;
  }

  return children;
}
