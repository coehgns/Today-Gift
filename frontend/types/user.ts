export type User = {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string | null;
  provider?: string;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
