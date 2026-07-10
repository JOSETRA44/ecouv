import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "@/features/coordinacion/guard";
import { getEvidenceLog } from "@/features/coordinacion/export-queries";
import { buildXlsxResponse } from "@/lib/xlsx";

export async function GET() {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return new Response(guard.error, { status: 403 });

  const rows = await getEvidenceLog(supabase);

  return buildXlsxResponse(
    "evidencias.xlsx",
    "Evidencias",
    [
      { header: "Brigadista", key: "brigadista", width: 28 },
      { header: "Actividad", key: "activity_title", width: 28 },
      { header: "Descripción", key: "caption", width: 32 },
      { header: "Estado", key: "status", width: 12 },
      { header: "Ruta de archivo", key: "storage_path", width: 36 },
      { header: "Subida", key: "created_at", width: 20 },
      { header: "Revisado por", key: "reviewed_by", width: 26 },
      { header: "Fecha de revisión", key: "reviewed_at", width: 20 },
    ],
    rows,
  );
}
