"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "motion/react";
import { MapPin, Clock3, ArrowUp, Sun } from "lucide-react";
import { uvLevel, type UvPayload } from "@/lib/uv";
import { cn } from "@/lib/utils";

const REFRESH_MS = 10 * 60 * 1000;

/*
 * OMS UV scale: 0–3 Low · 3–6 Moderate · 6–8 High · 8–11 Very High · 11+ Extreme
 * Gauge range: 0 → MAX_UV (linear mapping to percentage)
 */
const MAX_UV = 14;

/*
 * The gradient color-stops are positioned at the OMS threshold boundaries
 * so the visual color always matches the classification at that point.
 * Percentages = threshold / MAX_UV * 100
 *
 *   0/14 =  0%  →  green  (low start)
 *   3/14 = 21%  →  green→yellow transition
 *   6/14 = 43%  →  yellow→orange transition
 *   8/14 = 57%  →  orange→red transition
 *  11/14 = 79%  →  red→purple transition
 *  14/14 = 100% →  purple (extreme end)
 */
const UV_GRADIENT =
  "linear-gradient(to right, var(--color-uv-low) 0%, var(--color-uv-moderate) 21%, var(--color-uv-high) 43%, var(--color-uv-veryhigh) 57%, var(--color-uv-extreme) 79%, var(--color-uv-extreme) 100%)";

/** OMS scale tick marks — positioned at their mathematically exact percentage */
const SCALE_TICKS: { value: number; label: string }[] = [
  { value: 0, label: "0" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 8, label: "8" },
  { value: 11, label: "11" },
];

/* ─── Animated counter (ease-out cubic) ─── */
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

/* ════════════════════════════════════════════════════════════
   UV Monitor — Apple Weather-inspired linear bar
   Design-system aligned: bg-white · border-linea · shadow-z3
   ════════════════════════════════════════════════════════════ */
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

  /* H1: precise mathematical positioning on the 0→MAX_UV scale */
  const indicatorPercent = data
    ? Math.min(data.uvIndex / MAX_UV, 1) * 100
    : 0;

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
            <Sun className="h-4 w-4 text-faint" strokeWidth={1.6} />
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
              {/*
                H2: Number + badge stacked vertically.
                The badge sits directly below the number, left-aligned,
                eliminating the "floating" sensation of the side layout.
              */}
              <div className="mt-5">
                <span className="display text-[72px] font-extrabold leading-none tracking-tighter text-navy">
                  <AnimatedValue value={data.uvIndex} />
                </span>
                <div className="mt-2">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                    level.chipClass,
                  )}>
                    {level.label}
                  </span>
                </div>
              </div>

              {/*
                H1: Linear gradient bar with OMS-accurate color stops
                and mathematically precise indicator positioning.
                Ticks are placed at their exact percentage (value/MAX_UV).
              */}
              <div className="relative mt-6">
                {/* Gradient track */}
                <div
                  className="h-[7px] w-full rounded-full"
                  style={{ background: UV_GRADIENT }}
                />

                {/* Indicator dot — positioned at exact percentage */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  initial={{ left: "0%" }}
                  animate={{ left: `${indicatorPercent}%` }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className="relative -ml-[7px]">
                    <div className="h-[14px] w-[14px] rounded-full border-[2.5px] border-white bg-navy shadow-[0_0_0_1px_rgba(10,31,51,0.12),0_1px_3px_rgba(10,31,51,0.18)]" />
                  </div>
                </motion.div>

                {/* H1: Scale labels at mathematically exact positions */}
                <div className="relative mt-2 h-3">
                  {SCALE_TICKS.map((tick) => {
                    const pct = (tick.value / MAX_UV) * 100;
                    return (
                      <span
                        key={tick.value}
                        className="absolute text-[9px] font-medium text-faint -translate-x-1/2"
                        style={{ left: `${pct}%` }}
                      >
                        {tick.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/*
                H3 + H5: Advice block with increased contrast and
                clear spatial separation from the gauge above.
                The advice is the *action* — it must dominate the
                secondary info rows below.
              */}
              <p className="mt-5 text-[14px] font-medium leading-relaxed text-ink">
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
              <div className="space-y-2">
                <div className="h-16 w-24 animate-pulse rounded-lg bg-neutro" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-neutro" />
              </div>
              <div className="h-[7px] w-full animate-pulse rounded-full bg-neutro" />
              <div className="h-4 w-52 animate-pulse rounded bg-neutro" />
            </motion.div>
          )}
        </AnimatePresence>

        {/*
          H4 + H6: Data rows
          — "Franja crítica" uses font-semibold text-navy (not red/orange)
            to avoid competing with the UV bar.
          — All icons normalized to strokeWidth={1.6} for visual consistency.
          — ArrowUp replaces TrendingUp for optical weight matching.
        */}
        <dl className="mt-6 space-y-0 border-t border-linea pt-4">
          {[
            {
              icon: MapPin,
              label: "Ubicación",
              value: "Campus UNSA · Arequipa",
              valueClass: "text-navy",
            },
            {
              icon: Clock3,
              label: "Franja crítica",
              value: "10:00 — 15:00",
              valueClass: "font-semibold text-navy",
            },
            ...(data?.todayMax != null
              ? [{
                  icon: ArrowUp,
                  label: "Máx. previsto hoy",
                  value: data.todayMax.toFixed(1),
                  valueClass: "text-navy",
                }]
              : []),
          ].map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-between py-2.5"
            >
              <dt className="flex items-center gap-2 text-[13px] text-muted">
                <row.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {row.label}
              </dt>
              <dd className={cn("text-[13px] font-medium", row.valueClass)}>
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