"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { MapPin, Clock3 } from "lucide-react";
import { uvLevel, type UvPayload } from "@/lib/uv";
import { cn } from "@/lib/utils";

const REFRESH_MS = 10 * 60 * 1000;

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

  return (
    <MotionConfig reducedMotion="user">
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative w-full max-w-md rounded-card border border-linea bg-white p-8 shadow-z3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Monitor UV en vivo
        </h3>
        <span className="relative flex h-3 w-3">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
              level ? level.bgClass : "bg-linea",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-3 w-3 rounded-full",
              level ? level.bgClass : "bg-linea",
            )}
          />
        </span>
      </div>

      <div className="mt-6 text-center">
        {data && level ? (
          <>
            <div className="display text-[104px] font-extrabold leading-none tracking-tighter text-navy">
              {data.uvIndex.toFixed(1)}
            </div>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white",
                level.bgClass,
              )}
            >
              Índice {level.label}
            </span>
            <p className="mx-auto mt-4 max-w-[30ch] text-sm leading-relaxed text-muted">
              {level.advice}
            </p>
          </>
        ) : failed ? (
          <p className="py-10 text-sm text-muted">
            Sin conexión con el servicio UV. Reintentando…
          </p>
        ) : (
          <div className="animate-pulse py-6">
            <div className="mx-auto h-24 w-40 rounded-card bg-superficie" />
            <div className="mx-auto mt-4 h-7 w-32 rounded-full bg-superficie" />
          </div>
        )}
      </div>

      <dl className="mt-8 space-y-3 border-t border-superficie pt-6 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted">
            <MapPin className="h-4 w-4" /> Ubicación
          </dt>
          <dd className="font-medium text-navy">Campus UNSA · Arequipa</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted">
            <Clock3 className="h-4 w-4" /> Franja crítica
          </dt>
          <dd className="font-semibold text-uv-veryhigh">10:00 — 15:00</dd>
        </div>
        {data?.todayMax != null && (
          <div className="flex items-center justify-between">
            <dt className="text-muted">Máximo previsto hoy</dt>
            <dd className="font-medium text-navy">{data.todayMax.toFixed(1)}</dd>
          </div>
        )}
      </dl>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/80">
        Fuente: Open-Meteo{data?.source === "cache" && " (última lectura registrada)"} ·
        Dataset del análisis de externalidades del curso.
      </p>
    </motion.div>
    </MotionConfig>
  );
}
