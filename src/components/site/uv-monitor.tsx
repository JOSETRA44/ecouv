"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { uvLevel, type UvPayload } from "@/lib/uv";
import { cn } from "@/lib/utils";

const REFRESH_MS = 10 * 60 * 1000;
const SCALE_MAX = 12;

const scaleSegments = [
  { to: 3, className: "bg-uv-low/70" },
  { to: 6, className: "bg-uv-moderate/70" },
  { to: 8, className: "bg-uv-high/70" },
  { to: 11, className: "bg-uv-veryhigh/70" },
  { to: 12, className: "bg-uv-extreme/70" },
];

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
        if (active) {
          setData(json);
          setFailed(false);
        }
      } catch {
        if (active) setFailed(true);
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const level = data ? uvLevel(data.uvIndex) : null;
  const markerPct = data
    ? Math.min(Math.max(data.uvIndex / SCALE_MAX, 0), 1) * 100
    : 0;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="w-full max-w-md rounded-card border border-linea bg-white p-8 shadow-z2"
      >
        {/* Encabezado del instrumento */}
        <div className="flex items-center justify-between">
          <h3 className="microlabel text-muted">Monitor UV — en vivo</h3>
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                level ? level.bgClass : "bg-linea-strong",
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                level ? level.bgClass : "bg-linea-strong",
              )}
            />
          </span>
        </div>

        {/* Lectura principal */}
        <div className="mt-8">
          {data && level ? (
            <>
              <div className="flex items-baseline gap-4">
                <span className="tnum text-7xl font-extralight leading-none tracking-tight text-navy">
                  {data.uvIndex.toFixed(1)}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    level.chipClass,
                  )}
                >
                  {level.label}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {level.advice}
              </p>
            </>
          ) : failed ? (
            <p className="py-8 text-sm text-muted">
              Sin conexión con el servicio UV. Reintentando…
            </p>
          ) : (
            <div className="animate-pulse py-2">
              <div className="h-16 w-36 rounded-md bg-neutro" />
              <div className="mt-4 h-4 w-52 rounded bg-neutro" />
            </div>
          )}
        </div>

        {/* Escala graduada OMS */}
        <div className="mt-8">
          <div className="relative">
            <div className="flex h-1 gap-px overflow-hidden rounded-full">
              {scaleSegments.map((seg, i) => {
                const from = i === 0 ? 0 : scaleSegments[i - 1].to;
                return (
                  <span
                    key={seg.to}
                    className={cn("h-full", seg.className)}
                    style={{ width: `${((seg.to - from) / SCALE_MAX) * 100}%` }}
                  />
                );
              })}
            </div>
            {data && (
              <motion.span
                className="absolute -top-[5px] h-[14px] w-[2px] rounded-full bg-navy"
                initial={{ left: "0%" }}
                animate={{ left: `${markerPct}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 16 }}
                aria-hidden
              />
            )}
          </div>
          <div className="microlabel mt-2 flex justify-between text-[9px] text-faint">
            <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
          </div>
        </div>

        {/* Datos de contexto */}
        <dl className="mt-8 space-y-3 border-t border-linea pt-6">
          <div className="flex items-baseline justify-between">
            <dt className="microlabel text-faint">Ubicación</dt>
            <dd className="text-sm text-navy">Campus UNSA · Arequipa</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="microlabel text-faint">Franja crítica</dt>
            <dd className="tnum text-sm font-medium text-uv-veryhigh">
              10:00 — 15:00
            </dd>
          </div>
          {data?.todayMax != null && (
            <div className="flex items-baseline justify-between">
              <dt className="microlabel text-faint">Máx. previsto hoy</dt>
              <dd className="tnum text-sm text-navy">{data.todayMax.toFixed(1)}</dd>
            </div>
          )}
        </dl>

        <p className="mt-6 border-t border-linea pt-4 font-mono text-[10px] leading-relaxed text-faint">
          Fuente: Open-Meteo{data?.source === "cache" && " · última lectura registrada"} —
          dataset del análisis de externalidades del curso.
        </p>
      </motion.div>
    </MotionConfig>
  );
}
