"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "./guard";
import { evidenceReviewSchema, type ActionState } from "./schema";

export async function reviewEvidence(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = evidenceReviewSchema.safeParse({
    evidenceId: formData.get("evidenceId"),
    decision: formData.get("decision"),
  });
  if (!parsed.success) return { status: "error", message: "Datos inválidos." };

  const { error } = await supabase
    .from("evidence")
    .update({
      status: parsed.data.decision,
      reviewed_by: guard.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.evidenceId);

  if (error) {
    return { status: "error", message: "No se pudo actualizar la evidencia." };
  }

  revalidatePath("/brigada/coordinacion");
  revalidatePath("/brigada");
  return {
    status: "success",
    message: parsed.data.decision === "approved" ? "Evidencia aprobada." : "Evidencia rechazada.",
  };
}
