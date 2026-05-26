import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-gift-yellow bg-gift-yellow text-gift-ink shadow-[0_12px_20px_rgba(245,185,46,0.22)] hover:bg-[#ffd545]",
  secondary: "border-gift-line bg-white text-gift-ink shadow-[0_8px_18px_rgba(50,44,32,0.04)] hover:bg-gift-soft",
  ghost: "border-transparent bg-transparent text-gift-muted hover:text-gift-ink",
  danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-6 text-[15px]",
  md: "h-12 px-7 text-[17px]",
  lg: "h-[72px] px-10 text-[21px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-full border font-bold transition duration-200 disabled:pointer-events-none disabled:opacity-45",
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
        "inline-flex items-center justify-center gap-3 rounded-full border font-bold transition duration-200",
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
