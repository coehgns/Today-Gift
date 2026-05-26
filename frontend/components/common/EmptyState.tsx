import { ButtonLink } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-gift-soft text-2xl">✉️</div>
      <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-gift-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gift-muted">{description}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} className="mt-7">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </Card>
  );
}
