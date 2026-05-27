"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import type { AuthStatus, User } from "@/types/user";

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
  if (!email) return null;
  const name = readString(source.name, email.split("@")[0]);

  return {
    id: readString(source.id ?? source.user_id ?? source.google_sub, email),
    email,
    name,
    profileImageUrl: readString(source.profileImageUrl ?? source.profile_image_url) || null,
    provider: readString(source.provider, "google"),
  };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const raw = await apiRequest<unknown>("/me");
    return normalizeUser(raw);
  } catch {
    return null;
  }
}

export function startGoogleLogin() {
  window.location.href = apiUrl("/auth/google/login");
}

export async function logout() {
  try {
    await apiRequest<unknown>("/auth/logout", { method: "POST" });
  } catch {
    // Logout is best-effort because auth state is owned by the backend session.
  }
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
