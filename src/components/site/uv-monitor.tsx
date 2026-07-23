"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { MapPin, Clock3, ArrowUp, Sun } from "lucide-react";
import { uvLevel, type UvPayload } from "@/lib/uv";
import { cn } from "@/lib/utils";

const REFRESH_MS = 10 * 60 * 1000;
const MAX_UV = 14;

/*
 * OMS gradient: color-stops at exact threshold percentages.
 *   0/14 =  0.0%  green    3/14 = 21.4%  yellow
 *   6/14 = 42.9%  orange   8/14 = 57.1%  red
 *  11/14 = 78.6%  purple
 */
const UV_GRADIENT =
  "linear-gradient(to right, #4bbe6e 0%, #c9b208 21.4%, #d97a06 42.9%, #d13a1f 57.1%, #9d5ba3 78.6%, #7a3d80 100%)";

const SCALE_TICKS = [
  { value: 0, label: "0" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 8, label: "8" },
  { value: 11, label: "11+" },
];

/*
 * GPU-optimized counter: mutates textContent directly via ref
 * instead of calling setState 60×/s. Inspired by elementos/
 * which uses TweenMax for direct DOM mutation.
 * Zero React re-renders during animation.
 */
function AnimatedValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    const dur = 900;
    const t0 = performance.now();

    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el!.textContent = (value * eased).toFixed(1);
      if (p < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span ref={ref}>0.0</span>;
}

/** Static detail rows — extracted so they don't re-mount on data refresh */
const STATIC_ROWS = [
  { icon: MapPin, label: "Ubicación", value: "Campus UNSA · Arequipa", bold: false },
  { icon: Clock3, label: "Franja crítica", value: "10:00 — 15:00", bold: true },
] as const;

/* ════════════════════════════════════════════════════
   Tilt 3D — parallax de puntero
   ════════════════════════════════════════════════════

   Todo el efecto vive en MotionValues: se escriben desde el
   handler de puntero y Motion las aplica al DOM fuera del ciclo
   de React. Cero re-renders por frame; sólo hay 2 renders por
   interacción (entrar / salir) para conmutar el muelle.

   Sólo se animan `transform` y `opacity` → compositor puro,
   sin layout ni paint. La tarjeta ya tiene su propia capa GPU
   por el `backdrop-blur`, así que no hace falta `will-change`
   (promoverla otra vez sólo añadiría churn de capas).            */

const PERSPECTIVE = 1100; // px — distancia de cámara
const MAX_TILT = 8; // grados de giro en el borde de la tarjeta
const TAP_TILT = 5; // grados en táctil (más contenido)
const HOVER_SCALE = 1.015; // leve elevación
const GLARE = 320; // px — diámetro del brillo especular
const DEPTH = 1.15; // px de parallax por grado de giro

/** Seguimiento: casi crítico (ζ≈0.87) → la tarjeta va pegada al cursor. */
const SPRING_TRACK = { stiffness: 380, damping: 32, mass: 0.9 };
/** Retorno: sub-amortiguado (ζ≈0.42) → oscila 2-3 veces hasta quedar plana.
 *  `attachFollow` hereda la velocidad del muelle anterior, así que sacar el
 *  ratón de golpe produce más rebote que retirarlo despacio. */
const SPRING_RELEASE = { stiffness: 130, damping: 9, mass: 0.9 };
/** Brillo: sobre-amortiguado, sólo suaviza el seguimiento (sin rebote). */
const SPRING_GLARE = { stiffness: 260, damping: 30 };

function useTilt3D() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const rectRef = useRef<DOMRect | null>(null);

  /* Fuentes crudas — escritas por el puntero, nunca por setState */
  const rotXSrc = useMotionValue(0);
  const rotYSrc = useMotionValue(0);
  const scaleSrc = useMotionValue(1);
  const glareSrc = useMotionValue(0);
  const glareXSrc = useMotionValue(0);
  const glareYSrc = useMotionValue(0);

  /* Conmutar el config re-engancha el muelle conservando la velocidad */
  const spring = active ? SPRING_TRACK : SPRING_RELEASE;
  const rotateX = useSpring(rotXSrc, spring);
  const rotateY = useSpring(rotYSrc, spring);
  const scale = useSpring(scaleSrc, spring);
  const glareOpacity = useSpring(glareSrc, SPRING_GLARE);
  const glareX = useSpring(glareXSrc, SPRING_GLARE);
  const glareY = useSpring(glareYSrc, SPRING_GLARE);

  /*
   * Profundidad falsa. `overflow-hidden` fuerza `transform-style: flat`
   * (spec CSS), así que translateZ no serviría. Pero una capa a altura h
   * sobre una superficie girada θ se proyecta en Δx ≈ h·sen θ — es decir,
   * proporcional al giro. Derivarlo de la rotación da el mismo resultado
   * óptico usando sólo translate 2D, y reutiliza los muelles existentes.
   */
  const liftX = useTransform(rotateY, (v) => v * DEPTH);
  const liftY = useTransform(rotateX, (v) => v * -DEPTH);
  const liftSoftX = useTransform(rotateY, (v) => v * DEPTH * 0.45);
  const liftSoftY = useTransform(rotateX, (v) => v * -DEPTH * 0.45);
  /* Signo invertido: el panel de datos se hunde en lugar de flotar */
  const sinkX = useTransform(rotateY, (v) => v * -DEPTH * 0.35);
  const sinkY = useTransform(rotateX, (v) => v * DEPTH * 0.35);

  const applyPointer = useCallback(
    (clientX: number, clientY: number, rect: DOMRect, max: number) => {
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const nx = px / rect.width - 0.5; // −0.5 … 0.5
      const ny = py / rect.height - 0.5;
      /* rotateY>0 aleja el borde derecho, rotateX>0 acerca el inferior:
         con estos signos la tarjeta "se hunde" bajo el cursor. */
      rotYSrc.set(nx * 2 * max);
      rotXSrc.set(-ny * 2 * max);
      glareXSrc.set(px - GLARE / 2);
      glareYSrc.set(py - GLARE / 2);
    },
    [rotXSrc, rotYSrc, glareXSrc, glareYSrc],
  );

  /** Coloca el brillo bajo el puntero sin barrido desde la esquina. */
  const seedGlare = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      const gx = clientX - rect.left - GLARE / 2;
      const gy = clientY - rect.top - GLARE / 2;
      glareXSrc.jump(gx);
      glareX.jump(gx);
      glareYSrc.jump(gy);
      glareY.jump(gy);
    },
    [glareXSrc, glareYSrc, glareX, glareY],
  );

  const end = useCallback(() => {
    rectRef.current = null;
    setActive(false);
  }, []);

  const handlers = {
    onPointerEnter: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion || e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      rectRef.current = rect;
      seedGlare(e.clientX, e.clientY, rect);
      setActive(true);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion || e.pointerType !== "mouse") return;
      /* El rect se cachea: leerlo cada frame forzaría reflow. Se invalida
         al hacer scroll o resize (ver efecto de abajo). */
      const rect =
        rectRef.current ??
        (rectRef.current = e.currentTarget.getBoundingClientRect());
      applyPointer(e.clientX, e.clientY, rect, MAX_TILT);
    },
    onPointerLeave: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      end();
    },
    /* Táctil: sin hover, la tarjeta responde a la pulsación y oscila al soltar */
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion || e.pointerType === "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      rectRef.current = rect;
      seedGlare(e.clientX, e.clientY, rect);
      applyPointer(e.clientX, e.clientY, rect, TAP_TILT);
      setActive(true);
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse") return;
      end();
    },
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse") return;
      end();
    },
  };

  /*
   * El reset va en un efecto, no en el handler: `useSpring` re-engancha
   * su config en un `useInsertionEffect`, que corre ANTES que este. Así
   * el retorno a plano ya usa SPRING_RELEASE. Hacerlo en el handler lo
   * animaría todavía con el muelle de seguimiento (sin oscilación).
   */
  useEffect(() => {
    if (active) {
      scaleSrc.set(HOVER_SCALE);
      glareSrc.set(1);
    } else {
      rotXSrc.set(0);
      rotYSrc.set(0);
      scaleSrc.set(1);
      glareSrc.set(0);
      /* El brillo no vuelve al centro: sólo se desvanece donde estaba */
    }
  }, [active, rotXSrc, rotYSrc, scaleSrc, glareSrc]);

  useEffect(() => {
    if (!active) return;
    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [active]);

  return {
    handlers,
    style: { transformPerspective: PERSPECTIVE, rotateX, rotateY, scale },
    glare: { x: glareX, y: glareY, opacity: glareOpacity },
    lift: { x: liftX, y: liftY },
    liftSoft: { x: liftSoftX, y: liftSoftY },
    sink: { x: sinkX, y: sinkY },
  };
}

/* ════════════════════════════════════════════════════
   UV Monitor
   ════════════════════════════════════════════════════ */
export function UvMonitor() {
  const [data, setData] = useState<UvPayload | null>(null);
  const [failed, setFailed] = useState(false);
  const tilt = useTilt3D();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/uv");
      if (!res.ok) throw new Error();
      const json = (await res.json()) as UvPayload;
      setData(json);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const level = data ? uvLevel(data.uvIndex) : null;
  const pct = data ? Math.min(data.uvIndex / MAX_UV, 1) * 100 : 0;

  /* Build rows array — only changes when todayMax changes */
  const rows = data?.todayMax != null
    ? [...STATIC_ROWS, { icon: ArrowUp, label: "Máx. registrado hoy", value: data.todayMax.toFixed(1), bold: false }]
    : STATIC_ROWS;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        {...tilt.handlers}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={tilt.style}
        className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-white/40 bg-white/30 shadow-[0_32px_64px_-12px_rgba(10,31,51,0.2),0_0_0_1px_rgba(255,255,255,0.2)_inset] ring-1 ring-black/[0.04] backdrop-blur-lg"
      >
        {/*
         * Brillo especular: sigue al cursor para dar la sensación de luz
         * incidiendo sobre el cristal. Va detrás del contenido (que lleva
         * `relative`), como una luz atravesando el vidrio.
         */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-full"
          style={{
            width: GLARE,
            height: GLARE,
            ...tilt.glare,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.16) 42%, rgba(255,255,255,0) 70%)",
          }}
        />

        <div className="relative p-7 sm:p-8">
          {/* ─── Header ─── */}
          <motion.div className="flex items-center justify-between" style={tilt.liftSoft}>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted" strokeWidth={1.6} />
              <h3 className="microlabel text-muted">Índice UV en vivo</h3>
            </div>
            <span className="relative flex h-2.5 w-2.5" aria-label="Estado de conexión">
              <span className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                level ? level.bgClass : "bg-linea",
              )} />
              <span className={cn(
                "relative inline-flex h-2.5 w-2.5 rounded-full",
                level ? level.bgClass : "bg-linea",
              )} />
            </span>
          </motion.div>

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
                {/* Number + solid badge — capa que más "flota" */}
                <motion.div className="mt-4 flex items-baseline gap-3" style={tilt.lift}>
                  <span className="display text-[68px] font-extrabold leading-none tracking-tighter text-navy">
                    <AnimatedValue value={data.uvIndex} />
                  </span>
                  <span className={cn(
                    "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white",
                    level.bgClass,
                  )}>
                    {level.label}
                  </span>
                </motion.div>

                {/* Gradient bar */}
                <motion.div className="relative mt-4" style={tilt.liftSoft}>
                  <div
                    className="h-2 w-full rounded-full shadow-[inset_0_0_0_1px_rgba(10,31,51,0.06)]"
                    style={{ background: UV_GRADIENT }}
                  />

                  {/*
                   * Indicator dot. Uses `transform: translateX` under the
                   * hood via Framer Motion — GPU composited, no layout thrash.
                   * The marginLeft offset centers the 16px dot on the exact
                   * percentage position.
                   */}
                  <motion.div
                    className="absolute top-1/2"
                    initial={{ left: "0%" }}
                    animate={{ left: `${pct}%` }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ marginLeft: -8, marginTop: -8 }}
                  >
                    <div className="h-4 w-4 rounded-full border-[2.5px] border-white bg-navy shadow-[0_0_0_1px_rgba(10,31,51,0.15),0_2px_4px_rgba(10,31,51,0.25)]" />
                  </motion.div>

                  {/* Scale ticks */}
                  <div className="relative mt-2.5 h-3">
                    {SCALE_TICKS.map((tick) => (
                      <span
                        key={tick.value}
                        className="absolute -translate-x-1/2 text-[9px] font-medium text-faint"
                        style={{ left: `${(tick.value / MAX_UV) * 100}%` }}
                      >
                        {tick.label}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Advice */}
                <p className="mt-4 text-[14px] font-medium leading-relaxed text-ink">
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
                className="mt-4 space-y-4"
              >
                <div className="flex items-baseline gap-3">
                  <div className="h-16 w-24 animate-pulse rounded-lg bg-neutro" />
                  <div className="h-6 w-14 animate-pulse rounded-full bg-neutro" />
                </div>
                <div className="h-2 w-full animate-pulse rounded-full bg-neutro" />
                <div className="h-4 w-52 animate-pulse rounded bg-neutro" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Data rows ─── (parallax invertido: el panel se hunde) */}
          <motion.dl
            className="mt-6 space-y-0 rounded-xl bg-neutro/70 px-4 py-2"
            style={tilt.sink}
          >
            {rows.map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                  className="flex items-center justify-between py-2.5"
                >
                  <dt className="flex items-center gap-2 text-[13px] text-muted">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                    {row.label}
                  </dt>
                  <dd className={cn(
                    "text-[13px] font-medium text-navy",
                    row.bold && "font-semibold",
                  )}>
                    {row.value}
                  </dd>
                </motion.div>
              );
            })}
          </motion.dl>
        </div>

        {/* Footer */}
        <div className="relative px-7 pb-6 pt-2 sm:px-8">
          <p className="text-center text-[10px] leading-relaxed text-faint">
            Fuente: Open-Meteo · Dataset del análisis de externalidades del curso.
          </p>
        </div>
      </motion.div>
    </MotionConfig>
  );
}