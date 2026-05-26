import { cn } from "@/lib/utils";

export function OptionCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group min-h-30 rounded-[1.5rem] border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(80,57,41,0.12)]",
        selected
          ? "border-gift-ink bg-gift-ink text-gift-cream"
          : "border-gift-cocoa/12 bg-white/72 text-gift-ink hover:border-gift-clay/40",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-xl font-bold tracking-[-0.04em]">{label}</span>
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border text-xs transition",
            selected ? "border-gift-cream bg-gift-cream text-gift-ink" : "border-gift-cocoa/20 text-transparent group-hover:text-gift-cocoa",
          )}
        >
          ✓
        </span>
      </span>
      {description ? (
        <span className={cn("mt-3 block text-sm leading-6", selected ? "text-gift-cream/72" : "text-gift-cocoa")}>{description}</span>
      ) : null}
    </button>
  );
}
