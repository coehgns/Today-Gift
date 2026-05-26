import { cn } from "@/lib/utils";

export function StepProgress({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="rounded-[1.5rem] border border-gift-cocoa/10 bg-white/60 p-3 shadow-sm">
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex min-w-0 flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-2 rounded-full transition",
                index <= currentStep ? "bg-gift-ink" : "bg-gift-cocoa/12",
              )}
            />
            <span
              className={cn(
                "hidden truncate text-xs font-bold sm:block",
                index === currentStep ? "text-gift-ink" : "text-gift-cocoa/60",
              )}
            >
              {index + 1}. {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
