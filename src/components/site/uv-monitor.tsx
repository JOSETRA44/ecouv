"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "motion/react";
import { MapPin, Clock3, TrendingUp, Sun } from "lucide-react";
import { uvLevel, type UvPayload } from "@/lib/uv";
import { cn } from "@/lib/utils";

const REFRESH_MS = 10 * 60 * 1000;
const MAX_UV = 14;

/* ─── Animated counter ─── */
function AnimatedValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const dur = 1000;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display.toFixed(1)}</>;
}

/* ════════════════════════════════════════
   UV Monitor  —  Apple Weather-inspired
   with linear gradient bar + indicator
   ════════════════════════════════════════ */
export function UvMonitor() {
  const [data, setData] = useState<UvPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/uv");
        if (!res.ok) throw new Error();
        const json = (await res.json()) as UvPayload;
        if (active) { setData(json); setFailed(false); }
      } catch {
        if (active) setFailed(true);
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => { active = false; clearInterval(id); };
  }, []);

  const level = data ? uvLevel(data.uvIndex) : null;
  const progress = data ? Math.min(data.uvIndex / MAX_UV, 1) * 100 : 0;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="w-full max-w-md rounded-card border border-linea bg-white p-7 shadow-z3 sm:p-8"
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-faint" strokeWidth={1.8} />
            <h3 className="microlabel text-faint">Índice UV en vivo</h3>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              level ? level.bgClass : "bg-linea",
            )} />
            <span className={cn(
              "relative inline-flex h-2.5 w-2.5 rounded-full",
              level ? level.bgClass : "bg-linea",
            )} />
          </span>
        </div>

        {/* ─── Main display ─── */}
        <AnimatePresence mode="wait">
          {data && level ? (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Big number + level label */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="display text-[72px] font-extrabold leading-none tracking-tighter text-navy">
                  <AnimatedValue value={data.uvIndex} />
                </span>
                <div className="flex flex-col gap-1">
                  <span className={cn(
                    "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                    level.chipClass,
                  )}>
                    {level.label}
                  </span>
                </div>
              </div>

              {/* ─── Linear gradient bar (Apple Weather style) ─── */}
              <div className="relative mt-5">
                {/* Track with full UV spectrum gradient */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-linea">
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(to right, #37945c, #7ab648, #c29a08, #d97a06, #d13a1f, #9d5ba3)",
                    }}
                  />
                </div>

                {/* Position indicator */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  initial={{ left: "0%" }}
                  animate={{ left: `${progress}%` }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className="relative -ml-[7px]">
                    {/* Outer ring */}
                    <div className="h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-navy shadow-[0_0_0_1px_rgba(10,31,51,0.15),0_1px_4px_rgba(10,31,51,0.2)]" />
                  </div>
                </motion.div>

                {/* Scale labels under the bar */}
                <div className="mt-1.5 flex justify-between text-[9px] font-medium text-faint">
                  <span>0</span>
                  <span>3</span>
                  <span>6</span>
                  <span>8</span>
                  <span>11+</span>
                </div>
              </div>

              {/* Advice */}
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                {level.advice}
              </p>
            </motion.div>
          ) : failed ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10"
            >
              <p className="text-center text-sm text-muted">
                Sin conexión con el servicio UV.
              </p>
              <p className="mt-1 text-center text-xs text-faint">
                Reintentando…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 space-y-4"
            >
              <div className="flex items-baseline gap-3">
                <div className="h-16 w-24 animate-pulse rounded-lg bg-neutro" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-neutro" />
              </div>
              <div className="h-2 w-full animate-pulse rounded-full bg-neutro" />
              <div className="h-4 w-48 animate-pulse rounded bg-neutro" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Data rows ─── */}
        <dl className="mt-5 space-y-0 border-t border-linea pt-4">
          {[
            {
              icon: MapPin,
              label: "Ubicación",
              value: "Campus UNSA · Arequipa",
              highlight: false,
            },
            {
              icon: Clock3,
              label: "Franja crítica",
              value: "10:00 — 15:00",
              highlight: true,
            },
            ...(data?.todayMax != null
              ? [{
                  icon: TrendingUp,
                  label: "Máximo previsto hoy",
                  value: data.todayMax.toFixed(1),
                  highlight: false,
                }]
              : []),
          ].map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-between py-2"
            >
              <dt className="flex items-center gap-2 text-[13px] text-muted">
                <row.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                {row.label}
              </dt>
              <dd className={cn(
                "text-[13px] font-medium",
                row.highlight ? "font-semibold text-uv-veryhigh" : "text-navy",
              )}>
                {row.value}
              </dd>
            </motion.div>
          ))}
        </dl>

        {/* Footer */}
        <p className="mt-4 border-t border-linea pt-3 text-center text-[10.5px] leading-relaxed text-faint">
          Fuente: Open-Meteo
          {data?.source === "cache" && " (última lectura)"} ·
          Dataset del análisis de externalidades del curso.
        </p>
      </motion.div>
    </MotionConfig>
  );
}