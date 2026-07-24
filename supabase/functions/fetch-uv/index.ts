import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-16.409&longitude=-71.537" + // Campus UNSA, Arequipa
  "&current=uv_index&forecast_days=1&timezone=America%2FLima";

const BUCKET_MS = 30 * 60 * 1000; // debe calzar con el schedule del cron

const USER_AGENT =
  "BrigadaAmbientalFEC-UNSA/1.0 (+https://ecouv.vercel.app; contacto: brigada-ambiental@unsa.edu.pe)";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = [400, 1200];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUvIndex(): Promise<number> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(OPEN_METEO_URL, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        // Los 5xx de Open-Meteo suelen ser transitorios (rate-limit/carga del
        // proveedor gratuito); los 4xx no se resuelven reintentando.
        if (res.status >= 500 && attempt < MAX_ATTEMPTS - 1) {
          lastError = new Error(`open-meteo ${res.status}`);
          await sleep(RETRY_DELAY_MS[attempt]);
          continue;
        }
        throw new Error(`open-meteo ${res.status}`);
      }

      const data = await res.json();
      const uvIndex = Number(data?.current?.uv_index);
      if (Number.isNaN(uvIndex)) throw new Error("open-meteo: payload inválido");
      return uvIndex;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(RETRY_DELAY_MS[attempt]);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/**
 * Único punto del sistema que llama a Open-Meteo. Disparada por pg_cron cada
 * 30 min. Sin dependencias externas (nada de supabase-js): la resolución del
 * import jsr: era intermitente en cold starts y causaba 502 esporádicos, así
 * que el upsert va directo por REST/PostgREST con fetch nativo.
 *
 * v4: agrega User-Agent (Open-Meteo throttlea tráfico anónimo de proveedores
 * cloud) y reintentos con backoff ante 5xx transitorios — el proveedor
 * gratuito empezó a devolver 503 en ráfagas y una sola llamada por ciclo de
 * 30 min convertía cada falla en un hueco de datos.
 */
Deno.serve(async (_req: Request) => {
  try {
    const uvIndex = await fetchUvIndex();
    const bucket = new Date(Math.floor(Date.now() / BUCKET_MS) * BUCKET_MS);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const upsertRes = await fetch(
      `${supabaseUrl}/rest/v1/uv_readings?on_conflict=taken_at`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          taken_at: bucket.toISOString(),
          uv_index: uvIndex,
          source: "open-meteo",
        }),
      },
    );

    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      throw new Error(`postgrest ${upsertRes.status}: ${text}`);
    }

    return new Response(
      JSON.stringify({ ok: true, uvIndex, takenAt: bucket.toISOString() }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("fetch-uv:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
});
