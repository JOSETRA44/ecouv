import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-linea bg-white p-8 shadow-z1 transition-shadow duration-300 hover:shadow-z2",
        className,
      )}
      {...props}
    />
  );
}
