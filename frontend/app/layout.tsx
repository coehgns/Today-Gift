import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘의 선물 | AI 선물 추천",
  description: "관계와 상황에 맞는 선물을 빠르게 고르는 AI 기반 맞춤형 선물 추천 MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="min-h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full text-gift-ink">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
