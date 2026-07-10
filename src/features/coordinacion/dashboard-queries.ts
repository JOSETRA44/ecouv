import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type TypedClient = SupabaseClient<Database>;

/** Meta institucional del proyecto (Anexo 4, RSU 2026-A). No es un valor de negocio dinámico. */
export const BRIGADE_GOAL = 90;

export interface DashboardStats {
  activeMembers: number;
  pendingMembers: number;
  memberGoal: typeof BRIGADE_GOAL;
  forumRegistered: number;
  forumCapacity: number;
  activitiesTotal: number;
  attendanceTotal: number;
  evidencePending: number;
  evidenceApproved: number;
  evidenceRejected: number;
}

export async function getDashboardStats(supabase: TypedClient): Promise<DashboardStats> {
  const [
    activeMembers,
    pendingMembers,
    seatCounts,
    activitiesTotal,
    attendanceTotal,
    evidencePending,
    evidenceApproved,
    evidenceRejected,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("forum_seat_counts").select("registered, capacity").maybeSingle(),
    supabase.from("activities").select("id", { count: "exact", head: true }),
    supabase.from("attendance").select("id", { count: "exact", head: true }),
    supabase.from("evidence").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("evidence").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("evidence").select("id", { count: "exact", head: true }).eq("status", "rejected"),
  ]);

  return {
    activeMembers: activeMembers.count ?? 0,
    pendingMembers: pendingMembers.count ?? 0,
    memberGoal: BRIGADE_GOAL,
    forumRegistered: seatCounts.data?.registered ?? 0,
    forumCapacity: seatCounts.data?.capacity ?? 130,
    activitiesTotal: activitiesTotal.count ?? 0,
    attendanceTotal: attendanceTotal.count ?? 0,
    evidencePending: evidencePending.count ?? 0,
    evidenceApproved: evidenceApproved.count ?? 0,
    evidenceRejected: evidenceRejected.count ?? 0,
  };
}
