import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "guinda" | "success" | "alert" | "neutral";

const tones: Record<Tone, string> = {
  guinda: "bg-guinda-50 text-guinda-700 border-guinda-200",
  success: "bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]",
  alert: "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
  neutral: "bg-superficie text-ink border-linea",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "guinda", className, ...props }: BadgeProps) {
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
