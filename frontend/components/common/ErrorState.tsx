import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-red-50 text-2xl">!</div>
      <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-gift-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gift-cocoa">{description}</p>
      {onRetry ? (
        <Button onClick={onRetry} className="mt-7">
          다시 시도
        </Button>
      ) : null}
    </Card>
  );
}
