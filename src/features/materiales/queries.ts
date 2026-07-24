import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Material } from "@/lib/supabase/types";

type TypedClient = SupabaseClient<Database>;

export function materialPublicUrl(supabase: TypedClient, path: string): string {
  return supabase.storage.from("materials").getPublicUrl(path).data.publicUrl;
}

export async function listLatestMaterials(
  supabase: TypedClient,
  limit = 8,
): Promise<Material[]> {
  const { data } = await supabase
    .from("materials")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export interface MaterialsPage {
  items: Material[];
  hasMore: boolean;
}

export async function listPublishedMaterials(
  supabase: TypedClient,
  { limit = 12, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<MaterialsPage> {
  // range() es inclusivo en ambos extremos: pedimos un elemento extra para
  // saber si hay más sin necesitar un segundo count() aparte.
  const { data } = await supabase
    .from("materials")
    .select("*")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit);

  const rows = data ?? [];
  return { items: rows.slice(0, limit), hasMore: rows.length > limit };
}

/** Listado sin paginar para el panel de coordinación (crear/eliminar). */
export async function listMaterialsForAdmin(
  supabase: TypedClient,
  limit = 50,
): Promise<Material[]> {
  const { data } = await supabase
    .from("materials")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getMaterialBySlug(
  supabase: TypedClient,
  slug: string,
): Promise<Material | null> {
  const { data } = await supabase
    .from("materials")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}
