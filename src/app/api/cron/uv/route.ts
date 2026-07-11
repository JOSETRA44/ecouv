import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-16.409&longitude=-71.537" + // Campus UNSA, Arequipa
  "&current=uv_index&forecast_days=1&timezone=America%2FLima";

const BUCKET_MS = 30 * 60 * 1000; // debe calzar con el schedule del cron en vercel.json

/**
 * Único punto del sistema que llama a Open-Meteo. Disparado por Vercel Cron
 * (vercel.json) cada 30 min; los usuarios nunca golpean la API externa —
 * siempre leen la última fila de `uv_readings` vía /api/uv.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SECRET_KEY" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(OPEN_METEO_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const data = await res.json();

    const uvIndex = Number(data?.current?.uv_index);
    if (Number.isNaN(uvIndex)) throw new Error("open-meteo: payload inválido");

    const bucket = new Date(Math.floor(Date.now() / BUCKET_MS) * BUCKET_MS);

    const { error } = await service.from("uv_readings").upsert(
      { taken_at: bucket.toISOString(), uv_index: uvIndex, source: "open-meteo" },
      { onConflict: "taken_at" },
    );
    if (error) throw error;

    return NextResponse.json({ ok: true, uvIndex, takenAt: bucket.toISOString() });
  } catch (err) {
    console.error("cron/uv:", err);
    return NextResponse.json({ ok: false, error: "No se pudo actualizar el índice UV" }, { status: 502 });
  }
}
