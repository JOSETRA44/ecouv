import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "@/features/coordinacion/guard";
import { getForumRegistrations } from "@/features/coordinacion/export-queries";
import { buildXlsxResponse } from "@/lib/xlsx";

export async function GET() {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return new Response(guard.error, { status: 403 });

  const rows = await getForumRegistrations(supabase);

  return buildXlsxResponse(
    "foro-inscripciones.xlsx",
    "Foro",
    [
      { header: "Evento", key: "event_title", width: 28 },
      { header: "Nombre completo", key: "full_name", width: 30 },
      { header: "Correo", key: "email", width: 30 },
      { header: "Afiliación", key: "affiliation", width: 14 },
      { header: "Institución", key: "organization", width: 26 },
      { header: "Inscrito", key: "created_at", width: 20 },
    ],
    rows,
  );
}
