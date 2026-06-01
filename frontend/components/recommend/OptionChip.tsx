import { cn } from "@/lib/utils";

export function OptionChip({ label, selected, onSelect, className }: { label: string; selected: boolean; onSelect: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-h-[40px] rounded-full border px-5 text-[15px] font-bold tracking-[-0.04em] transition hover:border-gift-yellow-2",
        selected ? "border-gift-yellow bg-gift-yellow text-gift-ink shadow-[0_7px_14px_rgba(245,185,46,0.18)]" : "border-gift-line bg-white text-gift-muted",
        className,
      )}
    >
      {label}
    </button>
  );
}
