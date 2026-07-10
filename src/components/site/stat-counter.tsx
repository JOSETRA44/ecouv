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

/** Cifra tabular ligera que cuenta hasta su valor al entrar en viewport. */
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
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={ref} className="relative border-t border-linea pt-6">
      <span
        className="absolute -top-px left-0 h-[2px] w-8 bg-granate-600"
        aria-hidden
      />
      <div className="tnum text-5xl font-extralight tracking-tight text-navy">
        {prefix}
        {display.toLocaleString("es-PE")}
        {suffix}
      </div>
      <div className="microlabel mt-3 text-granate-700">{label}</div>
      <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
