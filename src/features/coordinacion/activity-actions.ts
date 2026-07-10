"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "./guard";
import { assignmentSchema, createActivitySchema, type ActionState } from "./schema";

export async function createActivity(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = createActivitySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    activityType: formData.get("activityType") || "turno",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos del formulario." };
  }

  const { error } = await supabase.from("activities").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    activity_type: parsed.data.activityType,
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    location: parsed.data.location || null,
    created_by: guard.userId,
  });

  if (error) {
    return { status: "error", message: "No se pudo crear la actividad." };
  }

  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Actividad creada." };
}

export async function assignBrigadista(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = assignmentSchema.safeParse({
    activityId: formData.get("activityId"),
    profileId: formData.get("profileId"),
    duty: formData.get("duty"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Selecciona actividad y brigadista." };
  }

  const { error } = await supabase.from("activity_assignments").insert({
    activity_id: parsed.data.activityId,
    profile_id: parsed.data.profileId,
    duty: parsed.data.duty || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "Ese brigadista ya está asignado a la actividad." };
    }
    return { status: "error", message: "No se pudo asignar al brigadista." };
  }

  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Brigadista asignado." };
}
