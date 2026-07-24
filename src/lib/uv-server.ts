import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/database.types";
import type { UvPayload } from "./uv";

/**
 * Lectura compartida por /api/uv (polling del cliente) y por el home
 * (render inicial en servidor): un solo lugar para la lógica de "última
 * lectura + máximo del día", reutilizado en vez de duplicado.
 */
export async function getUvPayload(
  supabase: SupabaseClient<Database>,
): Promise<UvPayload | null> {
  const { data: latest, error } = await supabase
    .from("uv_readings")
    .select("uv_index, taken_at")
    .order("taken_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !latest) return null;

  const startOfDayLima = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Lima" }),
  );
  startOfDayLima.setHours(0, 0, 0, 0);

  const { data: todayReadings } = await supabase
    .from("uv_readings")
    .select("uv_index")
    .gte("taken_at", startOfDayLima.toISOString())
    .order("uv_index", { ascending: false })
    .limit(1);

  const ageMinutes = (Date.now() - new Date(latest.taken_at).getTime()) / 60_000;

  return {
    uvIndex: Number(latest.uv_index),
    todayMax: todayReadings?.[0] ? Number(todayReadings[0].uv_index) : null,
    takenAt: latest.taken_at,
    // 3 ciclos de cron perdidos (30 min c/u): el proveedor gratuito puede
    // tener caídas de horas, así que la UI debe poder avisar en vez de
    // presentar un dato viejo como si fuera en vivo.
    stale: ageMinutes > 90,
    source: "supabase",
  };
}
