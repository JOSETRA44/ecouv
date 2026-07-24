import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUvPayload } from "@/lib/uv-server";

/**
 * Caché resiliente de respaldo: nunca llama a Open-Meteo directamente. Lo
 * consume el cliente cuando el fetch directo del navegador a Open-Meteo
 * falla (ver UvMonitor), y también sirve el primer render en servidor.
 */
export async function GET() {
  const supabase = await createClient();
  const payload = await getUvPayload(supabase);

  if (!payload) {
    return NextResponse.json({ error: "UV no disponible" }, { status: 503 });
  }

  return NextResponse.json(payload);
}
