import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Activity, ActivityAssignment, Attendance, Evidence } from "@/lib/supabase/types";

type TypedClient = SupabaseClient<Database>;

export interface MyAssignment extends ActivityAssignment {
  activity: Pick<Activity, "id" | "title" | "activity_type" | "starts_at" | "ends_at" | "location">;
}

export interface MyAttendanceRecord extends Attendance {
  activity: Pick<Activity, "id" | "title" | "starts_at">;
}

export interface MyEvidenceItem extends Evidence {
  activity: Pick<Activity, "id" | "title"> | null;
  signedUrl: string | null;
}

/** Turnos asignados al usuario, ordenados por fecha de inicio de la actividad. */
export async function getMyAssignments(
  supabase: TypedClient,
  userId: string,
): Promise<MyAssignment[]> {
  const { data } = await supabase
    .from("activity_assignments")
    .select(
      "id, activity_id, profile_id, duty, created_at, activity:activities(id, title, activity_type, starts_at, ends_at, location)",
    )
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as MyAssignment[];
}

/** Historial de asistencia del usuario. Solo lectura — el coordinador es quien marca. */
export async function getMyAttendance(
  supabase: TypedClient,
  userId: string,
): Promise<MyAttendanceRecord[]> {
  const { data } = await supabase
    .from("attendance")
    .select("id, activity_id, profile_id, checked_in_at, checked_by, activity:activities(id, title, starts_at)")
    .eq("profile_id", userId)
    .order("checked_in_at", { ascending: false });

  return (data ?? []) as unknown as MyAttendanceRecord[];
}

/** Actividades visibles para el selector opcional del formulario de evidencias. */
export async function getActivitiesForSelect(
  supabase: TypedClient,
): Promise<Pick<Activity, "id" | "title">[]> {
  const { data } = await supabase
    .from("activities")
    .select("id, title")
    .order("starts_at", { ascending: false, nullsFirst: false });
  return data ?? [];
}

/** Evidencias propias con URL firmada (bucket privado, expira en 5 min). */
export async function getMyEvidence(
  supabase: TypedClient,
  userId: string,
): Promise<MyEvidenceItem[]> {
  const { data } = await supabase
    .from("evidence")
    .select("*, activity:activities(id, title)")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as (Evidence & { activity: Pick<Activity, "id" | "title"> | null })[];

  return Promise.all(
    rows.map(async (row) => {
      const { data: signed } = await supabase.storage
        .from("evidence")
        .createSignedUrl(row.storage_path, 300);
      return { ...row, signedUrl: signed?.signedUrl ?? null };
    }),
  );
}
