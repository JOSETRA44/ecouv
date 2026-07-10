"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";

interface AforoBarProps {
  eventId: string;
  initialRegistered: number;
  capacity: number;
}

/** Barra de aforo con actualización en tiempo real vía Supabase Realtime. */
export function AforoBar({ eventId, initialRegistered, capacity }: AforoBarProps) {
  const [registered, setRegistered] = useState(initialRegistered);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`seat-counts-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "forum_seat_counts",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const next = (payload.new as { registered?: number }).registered;
          if (typeof next === "number") setRegistered(next);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const remaining = Math.max(capacity - registered, 0);
  const pct = Math.min((registered / capacity) * 100, 100);
  const full = remaining === 0;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <span className="tnum text-5xl font-extralight tracking-tight text-navy">
            {remaining}
          </span>
          <span className="ml-2 text-sm font-medium text-muted">
            vacantes disponibles
          </span>
        </div>
        <span className="text-sm font-medium text-muted">
          {registered} / {capacity}
        </span>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-linea"
        role="progressbar"
        aria-valuenow={registered}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-label="Ocupación del aforo"
      >
        <motion.div
          className={full ? "h-full bg-uv-veryhigh" : "h-full bg-granate-600"}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-uv-low opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-uv-low" />
        </span>
        Contador en tiempo real — se actualiza sin recargar la página.
      </p>
    </div>
  );
}
