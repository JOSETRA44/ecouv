import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Lectura pública compartida: nunca llama a Open-Meteo directamente.
 * El único escritor es /api/cron/uv (disparado por Vercel Cron), así que
 * el consumo de la API gratuita no depende de cuántos usuarios visiten el sitio.
 */
export async function GET() {
  const supabase = await createClient();

  const { data: latest, error } = await supabase
    .from("uv_readings")
    .select("uv_index, taken_at")
    .order("taken_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !latest) {
    return NextResponse.json({ error: "UV no disponible" }, { status: 503 });
  }

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

  return NextResponse.json({
    uvIndex: Number(latest.uv_index),
    todayMax: todayReadings?.[0] ? Number(todayReadings[0].uv_index) : null,
    takenAt: latest.taken_at,
    source: "supabase",
  });
}
