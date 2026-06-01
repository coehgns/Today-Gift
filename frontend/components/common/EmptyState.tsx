import { ButtonLink } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="mx-auto flex min-h-[240px] max-w-[760px] flex-col items-center justify-center px-6 py-10 text-center md:min-h-[280px] md:px-12 md:py-12">
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-gift-soft text-2xl md:size-16">✉️</div>
      <h2 className="font-display text-[25px] font-black tracking-[-0.05em] text-gift-ink md:text-[32px]">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7 text-gift-muted">{description}</p> : null}
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} size="lg" className="mt-7 min-w-[170px]">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </Card>
  );
}
