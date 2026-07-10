import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Activity, ActivityAssignment, Evidence, Profile } from "@/lib/supabase/types";

type TypedClient = SupabaseClient<Database>;

export async function listPendingMembers(supabase: TypedClient): Promise<Profile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function listActiveMembers(supabase: TypedClient): Promise<Profile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "active")
    .eq("role", "brigadista")
    .order("full_name", { ascending: true });
  return data ?? [];
}

export async function listActivities(supabase: TypedClient): Promise<Activity[]> {
  const { data } = await supabase
    .from("activities")
    .select("*")
    .order("starts_at", { ascending: false, nullsFirst: false });
  return data ?? [];
}

export interface AssignmentWithProfile extends ActivityAssignment {
  profile: Pick<Profile, "id" | "full_name" | "section">;
}

export async function listAssignmentsForActivity(
  supabase: TypedClient,
  activityId: string,
): Promise<AssignmentWithProfile[]> {
  const { data } = await supabase
    .from("activity_assignments")
    .select("id, activity_id, profile_id, duty, created_at, profile:profiles(id, full_name, section)")
    .eq("activity_id", activityId);
  return (data ?? []) as unknown as AssignmentWithProfile[];
}

export async function listAttendanceForActivity(
  supabase: TypedClient,
  activityId: string,
): Promise<Set<string>> {
  const { data } = await supabase
    .from("attendance")
    .select("profile_id")
    .eq("activity_id", activityId);
  return new Set((data ?? []).map((r) => r.profile_id));
}

export interface PendingEvidenceItem extends Evidence {
  profile: Pick<Profile, "id" | "full_name">;
  activity: Pick<Activity, "id" | "title"> | null;
  signedUrl: string | null;
}

export async function listPendingEvidence(supabase: TypedClient): Promise<PendingEvidenceItem[]> {
  const { data } = await supabase
    .from("evidence")
    .select("*, profile:profiles(id, full_name), activity:activities(id, title)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as unknown as (Evidence & {
    profile: Pick<Profile, "id" | "full_name">;
    activity: Pick<Activity, "id" | "title"> | null;
  })[];

  return Promise.all(
    rows.map(async (row) => {
      const { data: signed } = await supabase.storage
        .from("evidence")
        .createSignedUrl(row.storage_path, 300);
      return { ...row, signedUrl: signed?.signedUrl ?? null };
    }),
  );
}
