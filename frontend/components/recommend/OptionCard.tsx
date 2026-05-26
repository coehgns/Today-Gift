import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  className,
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-[136px] flex-col items-center justify-center rounded-[18px] border bg-white px-5 py-6 text-center transition hover:border-gift-yellow-2 hover:shadow-[0_10px_24px_rgba(39,39,39,0.05)]",
        selected ? "border-gift-yellow bg-gift-soft text-gift-ink ring-2 ring-gift-yellow" : "border-gift-line text-gift-ink",
        className,
      )}
    >
      {icon ? <span className={cn("mb-4 text-gift-muted [&>svg]:size-8", selected && "text-gift-yellow-2")}>{icon}</span> : null}
      <span className="text-[22px] font-black tracking-[-0.05em]">{label}</span>
      {description ? <span className="mt-2 text-[16px] text-gift-muted">{description}</span> : null}
    </button>
  );
}
