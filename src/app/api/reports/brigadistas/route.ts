import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "@/features/coordinacion/guard";
import { getBrigadistaRoster } from "@/features/coordinacion/export-queries";
import { buildXlsxResponse } from "@/lib/xlsx";

export async function GET() {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return new Response(guard.error, { status: 403 });

  const rows = await getBrigadistaRoster(supabase);

  return buildXlsxResponse(
    "brigadistas.xlsx",
    "Brigadistas",
    [
      { header: "Nombre completo", key: "full_name", width: 32 },
      { header: "CUI", key: "cui", width: 14 },
      { header: "Correo", key: "email", width: 30 },
      { header: "Sección", key: "section", width: 10 },
      { header: "Rol", key: "role", width: 14 },
      { header: "Estado", key: "status", width: 12 },
      { header: "Registrado", key: "created_at", width: 20 },
    ],
    rows,
  );
}
