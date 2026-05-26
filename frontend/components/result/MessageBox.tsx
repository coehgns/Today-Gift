"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function MessageBox({ message }: { message: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="bg-gift-blush/70">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-gift-clay">Message</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.05em] text-gift-ink">함께 전할 한마디</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gift-cocoa">“{message}”</p>
        </div>
        <Button onClick={copy} variant="secondary" className="shrink-0">
          {copied ? "복사 완료" : "메시지 복사"}
        </Button>
      </div>
    </Card>
  );
}
