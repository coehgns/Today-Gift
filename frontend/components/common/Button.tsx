import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-gift-ink bg-gift-ink text-gift-cream shadow-[0_14px_30px_rgba(43,33,24,0.18)] hover:-translate-y-0.5 hover:bg-gift-cocoa",
  secondary:
    "border-gift-cocoa/20 bg-white/70 text-gift-ink shadow-[0_10px_24px_rgba(122,91,72,0.10)] hover:-translate-y-0.5 hover:border-gift-cocoa/40 hover:bg-white",
  ghost: "border-transparent bg-transparent text-gift-cocoa hover:bg-gift-blush/40",
  danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-semibold tracking-[-0.01em] transition duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({ className, variant = "primary", size = "md", href, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-semibold tracking-[-0.01em] transition duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
