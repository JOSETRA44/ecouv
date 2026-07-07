"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
}

/** Cifra gigante (acento brutalista) que cuenta hasta su valor al entrar en viewport. */
export function StatCounter({ value, prefix = "", suffix = "", label, detail }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={ref} className="border-l-2 border-guinda-600 pl-5">
      <div className="display text-6xl font-extrabold tracking-tighter text-navy sm:text-7xl">
        {prefix}
        {display.toLocaleString("es-PE")}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-guinda-700">
        {label}
      </div>
      <p className="mt-1 max-w-[26ch] text-sm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
