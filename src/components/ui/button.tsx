import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn px-6 h-12 text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-guinda-600/20 focus-visible:border-guinda-600 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-guinda-600 text-white shadow-z1 hover:bg-guinda-500 active:bg-guinda-700 active:scale-[0.98]",
  secondary:
    "bg-white text-guinda-600 border border-guinda-600/60 hover:bg-guinda-50 active:bg-guinda-100",
  ghost:
    "bg-transparent text-guinda-600 hover:bg-guinda-600/8 active:bg-guinda-600/12",
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
