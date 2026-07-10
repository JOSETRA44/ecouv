import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Defensa en profundidad: la RLS es el límite real de autorización, pero
 * esta verificación falla rápido con un mensaje claro en vez de dejar que
 * la Server Action intente la operación y reciba un error crudo de Postgres.
 */
export async function requireCoordinator(
  supabase: SupabaseClient<Database>,
): Promise<{ userId: string } | { error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "coordinator" || profile.status !== "active") {
    return { error: "Solo el coordinador puede realizar esta acción." };
  }

  return { userId: user.id };
}
