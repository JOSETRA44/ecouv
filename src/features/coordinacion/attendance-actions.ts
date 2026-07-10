"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "./guard";
import { attendanceSchema, type ActionState } from "./schema";

/** Solo el coordinador marca asistencia — el brigadista nunca se auto-registra. */
export async function markAttendance(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = attendanceSchema.safeParse({
    activityId: formData.get("activityId"),
    profileId: formData.get("profileId"),
  });
  if (!parsed.success) return { status: "error", message: "Datos inválidos." };

  const { error } = await supabase.from("attendance").insert({
    activity_id: parsed.data.activityId,
    profile_id: parsed.data.profileId,
    checked_by: guard.userId,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "Ya se había marcado la asistencia." };
    }
    return { status: "error", message: "No se pudo registrar la asistencia." };
  }

  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Asistencia registrada." };
}
