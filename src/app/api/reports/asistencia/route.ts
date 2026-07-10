import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "@/features/coordinacion/guard";
import { getAttendanceLog } from "@/features/coordinacion/export-queries";
import { buildXlsxResponse } from "@/lib/xlsx";

export async function GET() {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return new Response(guard.error, { status: 403 });

  const rows = await getAttendanceLog(supabase);

  return buildXlsxResponse(
    "asistencia.xlsx",
    "Asistencia",
    [
      { header: "Actividad", key: "activity_title", width: 32 },
      { header: "Fecha actividad", key: "activity_starts_at", width: 20 },
      { header: "Brigadista", key: "brigadista", width: 28 },
      { header: "Sección", key: "section", width: 10 },
      { header: "Marcado", key: "checked_in_at", width: 20 },
      { header: "Registrado por", key: "checked_by", width: 26 },
    ],
    rows,
  );
}
