export type User = {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string | null;
  provider?: "google" | "dev" | "demo";
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
