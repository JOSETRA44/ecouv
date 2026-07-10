import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn px-6 h-12 text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-granate-600/20 focus-visible:border-granate-600 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-granate-600 text-white shadow-z1 hover:bg-granate-500 active:bg-granate-700 active:scale-[0.98]",
  secondary:
    "bg-white text-granate-600 border border-granate-600/60 hover:bg-granate-50 active:bg-granate-100",
  ghost:
    "bg-transparent text-granate-600 hover:bg-granate-600/8 active:bg-granate-600/12",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props} />
  );
}
