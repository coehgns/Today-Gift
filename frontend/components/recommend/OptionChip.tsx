import { cn } from "@/lib/utils";

export function OptionChip({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5",
        selected
          ? "border-gift-ink bg-gift-ink text-gift-cream shadow-[0_12px_24px_rgba(43,33,24,0.16)]"
          : "border-gift-cocoa/15 bg-white/70 text-gift-cocoa hover:border-gift-cocoa/35 hover:text-gift-ink",
      )}
    >
      {label}
    </button>
  );
}
