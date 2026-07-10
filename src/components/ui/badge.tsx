import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "granate" | "success" | "alert" | "neutral";

const tones: Record<Tone, string> = {
  granate: "bg-granate-50 text-granate-700 border-granate-200",
  success: "bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]",
  alert: "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
  neutral: "bg-neutro text-ink border-linea",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "granate", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
