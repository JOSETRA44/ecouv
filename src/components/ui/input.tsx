import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-btn border border-linea bg-white px-4 text-[15px] text-navy placeholder:text-muted/70 transition-all focus:border-guinda-600 focus:outline-none focus:ring-[3px] focus:ring-guinda-600/10",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-btn border border-linea bg-white px-3 text-[15px] text-navy transition-all focus:border-guinda-600 focus:outline-none focus:ring-[3px] focus:ring-guinda-600/10",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-sm font-medium text-navy", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-uv-veryhigh">{children}</p>;
}
