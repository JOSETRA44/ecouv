import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMaterialBySlug, materialPublicUrl } from "@/features/materiales/queries";

/**
 * Proxy de descarga: el enlace visible/copiable para el usuario es esta ruta
 * propia, nunca la URL cruda de Supabase Storage. También fuerza la descarga
 * (Content-Disposition: attachment) en vez de abrir el PDF/imagen en una
 * pestaña nueva, que es lo que hacía el enlace directo al bucket.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();
  const material = await getMaterialBySlug(supabase, slug);

  if (!material) {
    return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
  }

  const publicUrl = materialPublicUrl(supabase, material.storage_path);
  const upstream = await fetch(publicUrl);

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "No se pudo descargar el archivo" },
      { status: 502 },
    );
  }

  const extension = material.storage_path.split(".").pop() ?? "";
  const filename = `${material.slug}.${extension}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": material.mime_type,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
