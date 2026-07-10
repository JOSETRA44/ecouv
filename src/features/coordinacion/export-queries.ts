import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type TypedClient = SupabaseClient<Database>;

export interface BrigadistaRow {
  full_name: string;
  cui: string | null;
  email: string;
  section: string | null;
  role: string;
  status: string;
  created_at: string;
}

export async function getBrigadistaRoster(supabase: TypedClient): Promise<BrigadistaRow[]> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, cui, email, section, role, status, created_at")
    .order("full_name", { ascending: true });
  return data ?? [];
}

export interface AttendanceRow {
  activity_title: string;
  activity_starts_at: string | null;
  brigadista: string;
  section: string | null;
  checked_in_at: string;
  checked_by: string | null;
}

export async function getAttendanceLog(supabase: TypedClient): Promise<AttendanceRow[]> {
  const { data } = await supabase
    .from("attendance")
    .select(
      "checked_in_at, activity:activities(title, starts_at), profile:profiles!attendance_profile_id_fkey(full_name, section), checked_by_profile:profiles!attendance_checked_by_fkey(full_name)",
    )
    .order("checked_in_at", { ascending: false });

  type Row = {
    checked_in_at: string;
    activity: { title: string; starts_at: string | null } | null;
    profile: { full_name: string; section: string | null } | null;
    checked_by_profile: { full_name: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    activity_title: r.activity?.title ?? "—",
    activity_starts_at: r.activity?.starts_at ?? null,
    brigadista: r.profile?.full_name ?? "—",
    section: r.profile?.section ?? null,
    checked_in_at: r.checked_in_at,
    checked_by: r.checked_by_profile?.full_name ?? null,
  }));
}

export interface EvidenceRow {
  brigadista: string;
  activity_title: string | null;
  caption: string | null;
  status: string;
  storage_path: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export async function getEvidenceLog(supabase: TypedClient): Promise<EvidenceRow[]> {
  const { data } = await supabase
    .from("evidence")
    .select(
      "caption, status, storage_path, created_at, reviewed_at, activity:activities(title), profile:profiles!evidence_profile_id_fkey(full_name), reviewer:profiles!evidence_reviewed_by_fkey(full_name)",
    )
    .order("created_at", { ascending: false });

  type Row = {
    caption: string | null;
    status: string;
    storage_path: string;
    created_at: string;
    reviewed_at: string | null;
    activity: { title: string } | null;
    profile: { full_name: string } | null;
    reviewer: { full_name: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    brigadista: r.profile?.full_name ?? "—",
    activity_title: r.activity?.title ?? null,
    caption: r.caption,
    status: r.status,
    storage_path: r.storage_path,
    created_at: r.created_at,
    reviewed_by: r.reviewer?.full_name ?? null,
    reviewed_at: r.reviewed_at,
  }));
}

export interface ForumRegistrationRow {
  event_title: string;
  full_name: string;
  email: string;
  affiliation: string;
  organization: string | null;
  created_at: string;
}

export async function getForumRegistrations(supabase: TypedClient): Promise<ForumRegistrationRow[]> {
  const { data } = await supabase
    .from("forum_registrations")
    .select("full_name, email, affiliation, organization, created_at, event:forum_events(title)")
    .order("created_at", { ascending: true });

  type Row = {
    full_name: string;
    email: string;
    affiliation: string;
    organization: string | null;
    created_at: string;
    event: { title: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    event_title: r.event?.title ?? "—",
    full_name: r.full_name,
    email: r.email,
    affiliation: r.affiliation,
    organization: r.organization,
    created_at: r.created_at,
  }));
}
