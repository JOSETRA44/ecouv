"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "./guard";
import { memberDecisionSchema, type ActionState } from "./schema";

export async function approveMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = memberDecisionSchema.safeParse({ profileId: formData.get("profileId") });
  if (!parsed.success) return { status: "error", message: "Miembro inválido." };

  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", parsed.data.profileId);

  if (error) return { status: "error", message: "No se pudo aprobar al miembro." };

  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Miembro aprobado." };
}

export async function rejectMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = memberDecisionSchema.safeParse({ profileId: formData.get("profileId") });
  if (!parsed.success) return { status: "error", message: "Miembro inválido." };

  const { error } = await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", parsed.data.profileId);

  if (error) return { status: "error", message: "No se pudo rechazar al miembro." };

  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Miembro rechazado." };
}
