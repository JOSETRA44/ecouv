import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: number | string;
  detail?: string;
}

/** Cifra simple sin meta asociada (conteo). */
export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <div className="rounded-card border border-linea bg-white p-6">
      <p className="microlabel text-faint">{label}</p>
      <p className="tnum mt-2 text-4xl font-extralight text-navy">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </div>
  );
}

interface MeterTileProps {
  label: string;
  value: number;
  goal: number;
  detail?: string;
}

/** Cifra con meta asociada: fracción + barra de progreso (mismo lenguaje visual que el aforo del foro). */
export function MeterTile({ label, value, goal, detail }: MeterTileProps) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const complete = value >= goal;

  return (
    <div className="rounded-card border border-linea bg-white p-6">
      <p className="microlabel text-faint">{label}</p>
      <p className="tnum mt-2 text-4xl font-extralight text-navy">
        {value}
        <span className="text-lg font-normal text-muted"> / {goal}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-linea">
        <div
          className={cn("h-full rounded-full", complete ? "bg-uv-low" : "bg-granate-600")}
          style={{ width: `${pct}%` }}
        />
      </div>
      {detail && <p className="mt-2 text-xs text-muted">{detail}</p>}
    </div>
  );
}
