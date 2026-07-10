import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  listActiveMembers,
  listActivities,
  listAssignmentsForActivity,
  listAttendanceForActivity,
  listPendingEvidence,
  listPendingMembers,
} from "@/features/coordinacion/queries";
import { getDashboardStats } from "@/features/coordinacion/dashboard-queries";
import { StatTile, MeterTile } from "@/features/coordinacion/dashboard-tiles";
import { CreateActivityForm } from "@/features/coordinacion/create-activity-form";
import { AssignForm } from "@/features/coordinacion/assign-form";
import { MemberRowActions } from "@/features/coordinacion/member-row-actions";
import { AttendanceMarkButton } from "@/features/coordinacion/attendance-mark-button";
import { EvidenceReviewButtons } from "@/features/coordinacion/evidence-review-buttons";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const REPORTS = [
  { href: "/api/reports/brigadistas", label: "Brigadistas" },
  { href: "/api/reports/asistencia", label: "Asistencia" },
  { href: "/api/reports/evidencias", label: "Evidencias" },
  { href: "/api/reports/foro", label: "Inscripciones al foro" },
] as const;

export const metadata: Metadata = { title: "Panel de coordinación" };

function fmt(date: string | null) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(date));
}

export default async function CoordinacionPage({
  searchParams,
}: {
  searchParams: Promise<{ activity?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/brigada/coordinacion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "coordinator" || profile.status !== "active") {
    redirect("/brigada");
  }

  const [pendingMembers, activeMembers, activities, pendingEvidence, stats] = await Promise.all([
    listPendingMembers(supabase),
    listActiveMembers(supabase),
    listActivities(supabase),
    listPendingEvidence(supabase),
    getDashboardStats(supabase),
  ]);

  const { activity: selectedActivityId } = await searchParams;
  const selectedActivity =
    selectedActivityId ?? (activities.length > 0 ? activities[0].id : undefined);

  const [assignments, attendedIds] = selectedActivity
    ? await Promise.all([
        listAssignmentsForActivity(supabase, selectedActivity),
        listAttendanceForActivity(supabase, selectedActivity),
      ])
    : [[], new Set<string>()];

  return (
    <div className="min-h-dvh bg-neutro">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/brigada" className="flex items-center gap-3">
            <Image src="/brand/logo-unsa.svg" alt="UNSA" width={32} height={32} unoptimized />
            <Image src="/brand/logo-fec.svg" alt="Facultad de Economía" width={32} height={32} unoptimized />
            <span className="text-sm font-medium tracking-tight text-navy">
              Panel de coordinación
            </span>
          </Link>
          <Link href="/brigada" className="text-sm text-granate-600 hover:underline">
            ← Volver al portal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="microlabel text-granate-700">Coordinación general</p>
          <h1 className="display mt-2 text-4xl text-navy">
            Hola, {profile.full_name?.split(" ")[0] || "coordinador"}.
          </h1>
        </div>

        {/* ===== 0. Indicadores ===== */}
        <section id="indicadores">
          <h2 className="text-lg font-semibold text-navy">Indicadores</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MeterTile
              label="Brigadistas activos"
              value={stats.activeMembers}
              goal={stats.memberGoal}
              detail={
                stats.pendingMembers > 0
                  ? `${stats.pendingMembers} pendiente${stats.pendingMembers === 1 ? "" : "s"} de aprobación`
                  : "Meta del Anexo 4 · RSU 2026-A"
              }
            />
            <MeterTile
              label="Aforo del foro"
              value={stats.forumRegistered}
              goal={stats.forumCapacity}
              detail="Foro Ambiental y de Salud 2026"
            />
            <StatTile
              label="Actividades creadas"
              value={stats.activitiesTotal}
              detail={`${stats.attendanceTotal} asistencias registradas`}
            />
            <StatTile
              label="Evidencias"
              value={stats.evidencePending}
              detail={`${stats.evidenceApproved} aprobadas · ${stats.evidenceRejected} rechazadas · en revisión ahora`}
            />
          </div>
        </section>

        {/* ===== 1. Miembros pendientes ===== */}
        <section id="pendientes">
          <h2 className="text-lg font-semibold text-navy">
            Miembros pendientes{" "}
            <span className="text-sm font-normal text-muted">({pendingMembers.length})</span>
          </h2>
          <Card className="mt-4 p-0">
            {pendingMembers.length === 0 ? (
              <p className="p-6 text-sm text-muted">No hay registros pendientes.</p>
            ) : (
              <ul className="divide-y divide-linea">
                {pendingMembers.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-medium text-navy">{m.full_name}</p>
                      <p className="text-sm text-muted">
                        {m.email} · {m.cui || "sin CUI"} ·{" "}
                        {m.section ? `Sección ${m.section}` : "sin sección"}
                      </p>
                    </div>
                    <MemberRowActions profileId={m.id} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* ===== 2. Actividades ===== */}
        <section id="actividades">
          <h2 className="text-lg font-semibold text-navy">Actividades</h2>
          <Card className="mt-4">
            <CreateActivityForm />
          </Card>
          <Card className="mt-4 p-0">
            {activities.length === 0 ? (
              <p className="p-6 text-sm text-muted">Aún no hay actividades creadas.</p>
            ) : (
              <ul className="divide-y divide-linea">
                {activities.map((a) => (
                  <li key={a.id} className="p-5">
                    <p className="font-medium text-navy">{a.title}</p>
                    <p className="text-sm text-muted">
                      {a.activity_type} · {fmt(a.starts_at)} {a.location ? `· ${a.location}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* ===== 3. Asignaciones ===== */}
        <section id="asignaciones">
          <h2 className="text-lg font-semibold text-navy">Asignaciones</h2>
          <Card className="mt-4">
            <AssignForm activities={activities} members={activeMembers} />
          </Card>
        </section>

        {/* ===== 4. Asistencia ===== */}
        <section id="asistencia">
          <h2 className="text-lg font-semibold text-navy">Asistencia por actividad</h2>
          <Card className="mt-4">
            <form className="flex flex-wrap items-end gap-3">
              <div className="min-w-[240px] flex-1">
                <Select name="activity" defaultValue={selectedActivity ?? ""}>
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" variant="secondary" className="h-11">
                Ver actividad
              </Button>
            </form>

            {selectedActivity && (
              <ul className="mt-6 divide-y divide-linea border-t border-linea">
                {assignments.length === 0 ? (
                  <p className="py-4 text-sm text-muted">
                    Nadie está asignado a esta actividad todavía.
                  </p>
                ) : (
                  assignments.map((a) => {
                    const present = attendedIds.has(a.profile_id);
                    return (
                      <li key={a.id} className="flex items-center justify-between gap-3 py-4">
                        <div>
                          <p className="font-medium text-navy">{a.profile.full_name}</p>
                          <p className="text-sm text-muted">
                            {a.profile.section ? `Sección ${a.profile.section}` : ""}{" "}
                            {a.duty ? `· ${a.duty}` : ""}
                          </p>
                        </div>
                        {present ? (
                          <span className="text-sm font-medium text-uv-low">Ya registrado</span>
                        ) : (
                          <AttendanceMarkButton
                            activityId={selectedActivity}
                            profileId={a.profile_id}
                          />
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </Card>
        </section>

        {/* ===== 5. Evidencias por revisar ===== */}
        <section id="evidencias">
          <h2 className="text-lg font-semibold text-navy">
            Evidencias por revisar{" "}
            <span className="text-sm font-normal text-muted">({pendingEvidence.length})</span>
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pendingEvidence.length === 0 ? (
              <p className="text-sm text-muted">No hay evidencias pendientes de revisión.</p>
            ) : (
              pendingEvidence.map((ev) => (
                <Card key={ev.id} className="p-0 overflow-hidden">
                  {ev.signedUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ev.signedUrl}
                      alt={ev.caption ?? "Evidencia"}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-sm font-medium text-navy">{ev.profile.full_name}</p>
                    <p className="text-xs text-muted">
                      {ev.activity?.title ?? "Sin actividad"} · {fmt(ev.created_at)}
                    </p>
                    {ev.caption && <p className="mt-2 text-sm text-ink">{ev.caption}</p>}
                    <div className="mt-4">
                      <EvidenceReviewButtons evidenceId={ev.id} />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* ===== 6. Reportes ===== */}
        <section id="reportes">
          <h2 className="text-lg font-semibold text-navy">Reportes</h2>
          <p className="mt-1 text-sm text-muted">
            Exporta los registros como Excel (.xlsx) para el informe final del
            proyecto RSU.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {REPORTS.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="flex items-center justify-between gap-2 rounded-card border border-linea bg-white px-5 py-4 text-sm font-medium text-navy transition-shadow hover:shadow-z2"
              >
                {r.label}
                <Download className="h-4 w-4 text-granate-600" />
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
