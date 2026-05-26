"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import type { AuthStatus, User } from "@/types/user";

const DEMO_USER_KEY = "today-gift:demo-user";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function normalizeUser(raw: unknown): User | null {
  if (!isRecord(raw)) return null;
  const source = isRecord(raw.user) ? raw.user : raw;
  const email = readString(source.email);
  const name = readString(source.name, email ? email.split("@")[0] : "오늘의 선물 손님");
  if (!email && !name) return null;

  return {
    id: readString(source.id ?? source.user_id ?? source.google_sub, email || "demo-user"),
    email: email || "demo@today-gift.local",
    name,
    profileImageUrl: readString(source.profileImageUrl ?? source.profile_image_url) || null,
    provider: readString(source.provider, "google") as User["provider"],
  };
}

function getStoredDemoUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_USER_KEY);
    if (!raw) return null;
    return normalizeUser(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

function setStoredDemoUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(DEMO_USER_KEY);
    return;
  }
  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const raw = await apiRequest<unknown>("/me");
    return normalizeUser(raw);
  } catch {
    return getStoredDemoUser();
  }
}

export function startGoogleLogin() {
  window.location.href = apiUrl("/auth/google/login");
}

export async function loginAsDemoUser(): Promise<User> {
  try {
    const raw = await apiRequest<unknown>("/auth/dev-login", { method: "POST" });
    const user = normalizeUser(raw);
    if (user) {
      setStoredDemoUser(user);
      return user;
    }
  } catch {
    // Backend dev-login is optional. Fall through to a browser-local demo user.
  }

  const user: User = {
    id: "demo-user",
    email: "demo@today-gift.local",
    name: "데모 사용자",
    profileImageUrl: null,
    provider: "demo",
  };
  setStoredDemoUser(user);
  return user;
}

export async function logout() {
  try {
    await apiRequest<unknown>("/auth/logout", { method: "POST" });
  } catch {
    // Logout should be best-effort because local demo mode must still clear state.
  }
  setStoredDemoUser(null);
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    setStatus("loading");
    const nextUser = await getCurrentUser();
    setUser(nextUser);
    setStatus(nextUser ? "authenticated" : "unauthenticated");
    return nextUser;
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialUser() {
      const nextUser = await getCurrentUser();
      if (!active) return;
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");
    }

    void loadInitialUser();

    return () => {
      active = false;
    };
  }, []);

  return { user, status, refresh, setUser };
}
