import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-16.409&longitude=-71.537" + // Campus UNSA, Arequipa
  "&current=uv_index&daily=uv_index_max&forecast_days=1&timezone=America%2FLima";

export async function GET() {
  try {
    const res = await fetch(OPEN_METEO_URL, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const data = await res.json();

    const uvIndex = Number(data?.current?.uv_index);
    if (Number.isNaN(uvIndex)) throw new Error("open-meteo: payload inválido");
    const todayMax = Number(data?.daily?.uv_index_max?.[0] ?? uvIndex);

    // Persistencia horaria (dataset del análisis empírico) — best effort.
    const service = createServiceClient();
    if (service) {
      const hour = new Date();
      hour.setMinutes(0, 0, 0);
      await service
        .from("uv_readings")
        .upsert(
          { taken_at: hour.toISOString(), uv_index: uvIndex },
          { onConflict: "taken_at" },
        );
    }

    return NextResponse.json({
      uvIndex,
      todayMax,
      takenAt: data?.current?.time ?? new Date().toISOString(),
      source: "open-meteo",
    });
  } catch {
    // Fallback: última lectura persistida (lectura pública).
    const supabase = await createClient();
    const { data } = await supabase
      .from("uv_readings")
      .select("uv_index, taken_at")
      .order("taken_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      return NextResponse.json({
        uvIndex: Number(data.uv_index),
        todayMax: null,
        takenAt: data.taken_at,
        source: "cache",
      });
    }
    return NextResponse.json({ error: "UV no disponible" }, { status: 503 });
  }
}
