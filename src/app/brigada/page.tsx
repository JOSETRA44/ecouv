import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarClock,
  Camera,
  ClipboardCheck,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutBrigadista } from "@/features/brigada/actions";
import {
  getActivitiesForSelect,
  getMyAssignments,
  getMyAttendance,
  getMyEvidence,
} from "@/features/brigada/queries";
import { EvidenceUploadForm } from "@/features/brigada/evidence-upload-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Portal de brigadistas" };

const statusCopy = {
  pending: {
    tone: "neutral" as const,
    label: "Pendiente de aprobación",
    body: "Tu registro fue recibido. El docente coordinador validará tu matrícula en Economía Política 2 y activará tu cuenta.",
  },
  active: {
    tone: "success" as const,
    label: "Brigadista activo",
    body: "Tu cuenta está activa. Ya puedes ver tus turnos, tu asistencia y subir evidencias.",
  },
  rejected: {
    tone: "alert" as const,
    label: "Registro observado",
    body: "Tu registro fue observado. Acércate al docente coordinador para regularizar tu situación.",
  },
};

const evidenceStatusCopy = {
  pending: { tone: "neutral" as const, label: "En revisión" },
  approved: { tone: "success" as const, label: "Aprobada" },
  rejected: { tone: "alert" as const, label: "Rechazada" },
};

function fmt(date: string | null) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(date));
}

export default async function BrigadaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/brigada");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, cui, section, role, status")
    .eq("id", user.id)
    .maybeSingle();

  const statusKey = (profile?.status ?? "pending") as keyof typeof statusCopy;
  const status = statusCopy[statusKey];
  const isActive = profile?.status === "active";
  const isCoordinator = profile?.role === "coordinator";

  const [assignments, attendance, evidence, activities] = isActive
    ? await Promise.all([
        getMyAssignments(supabase, user.id),
        getMyAttendance(supabase, user.id),
        getMyEvidence(supabase, user.id),
        getActivitiesForSelect(supabase),
      ])
    : [[], [], [], []];

  return (
    <div className="min-h-dvh bg-neutro">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo-unsa.svg"
              alt="UNSA"
              width={32}
              height={32}
              unoptimized
            />
            <Image
              src="/brand/logo-fec.svg"
              alt="Facultad de Economía"
              width={32}
              height={32}
              unoptimized
            />
            <span className="text-sm font-medium tracking-tight text-navy">
              Portal de brigadistas
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isCoordinator && (
              <Link
                href="/brigada/coordinacion"
                className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-sm font-medium text-granate-700 transition-colors hover:bg-granate-50"
              >
                <ShieldCheck className="h-4 w-4" /> Panel de coordinación
              </Link>
            )}
            <form action={signOutBrigadista}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-btn px-3 py-2 text-sm text-ink transition-colors hover:bg-granate-50 hover:text-granate-700"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="microlabel text-granate-700">
              {profile?.section
                ? `Sección ${profile.section} · Economía Política 2`
                : "Brigada Ambiental FEC"}
            </p>
            <h1 className="display mt-2 text-4xl text-navy">
              Hola, {profile?.full_name?.split(" ")[0] || "brigadista"}.
            </h1>
          </div>
          <Badge tone={status.tone} className="px-3 py-1.5 text-sm">
            {status.label}
          </Badge>
        </div>

        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{status.body}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* ===== Mis turnos ===== */}
          <Card className="p-0">
            <div className="p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-card bg-granate-50 text-granate-600">
                <CalendarClock className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-navy">Mis turnos</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Programación de turnos de vigilancia ambiental asignados por el
                coordinador.
              </p>
            </div>
            {!isActive ? (
              <p className="border-t border-linea px-7 py-4 text-sm text-muted">
                Disponible cuando tu cuenta esté activa.
              </p>
            ) : assignments.length === 0 ? (
              <p className="border-t border-linea px-7 py-4 text-sm text-muted">
                Aún no tienes turnos asignados.
              </p>
            ) : (
              <ul className="divide-y divide-linea border-t border-linea">
                {assignments.map((a) => (
                  <li key={a.id} className="px-7 py-4">
                    <p className="text-sm font-medium text-navy">{a.activity.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {fmt(a.activity.starts_at)}
                      {a.activity.location ? ` · ${a.activity.location}` : ""}
                      {a.duty ? ` · ${a.duty}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* ===== Asistencia (solo lectura) ===== */}
          <Card className="p-0">
            <div className="p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-card bg-granate-50 text-granate-600">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-navy">Asistencia</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Registro de tu participación, marcado por el coordinador el día
                de cada actividad.
              </p>
            </div>
            {!isActive ? (
              <p className="border-t border-linea px-7 py-4 text-sm text-muted">
                Disponible cuando tu cuenta esté activa.
              </p>
            ) : attendance.length === 0 ? (
              <p className="border-t border-linea px-7 py-4 text-sm text-muted">
                Aún no se registra asistencia a tu nombre.
              </p>
            ) : (
              <ul className="divide-y divide-linea border-t border-linea">
                {attendance.map((a) => (
                  <li key={a.id} className="px-7 py-4">
                    <p className="text-sm font-medium text-navy">{a.activity.title}</p>
                    <p className="mt-1 text-xs text-muted">{fmt(a.checked_in_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* ===== Evidencias ===== */}
          <Card className="p-0">
            <div className="p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-card bg-granate-50 text-granate-600">
                <Camera className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-navy">Evidencias</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Bitácora fotográfica de tus intervenciones para el informe
                final del proyecto RSU.
              </p>
            </div>
            {!isActive ? (
              <p className="border-t border-linea px-7 py-4 text-sm text-muted">
                Disponible cuando tu cuenta esté activa.
              </p>
            ) : (
              <div className="border-t border-linea p-7">
                <EvidenceUploadForm activities={activities} />
              </div>
            )}
          </Card>
        </div>

        {isActive && evidence.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-navy">Mis evidencias</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {evidence.map((ev) => {
                const evStatus = evidenceStatusCopy[ev.status];
                return (
                  <Card key={ev.id} className="overflow-hidden p-0">
                    {ev.signedUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ev.signedUrl}
                        alt={ev.caption ?? "Evidencia"}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted">{fmt(ev.created_at)}</p>
                        <Badge tone={evStatus.tone}>{evStatus.label}</Badge>
                      </div>
                      {ev.caption && (
                        <p className="mt-2 text-sm text-ink">{ev.caption}</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-card border border-linea bg-white p-7 shadow-z1">
          <h2 className="microlabel text-muted">
            Mi perfil
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted">Nombre</dt>
              <dd className="mt-0.5 font-medium text-navy">
                {profile?.full_name || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Correo</dt>
              <dd className="mt-0.5 font-medium text-navy">{profile?.email}</dd>
            </div>
            <div>
              <dt className="text-muted">CUI</dt>
              <dd className="mt-0.5 font-medium text-navy">
                {profile?.cui || "No registrado"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Rol</dt>
              <dd className="mt-0.5 font-medium capitalize text-navy">
                {profile?.role === "coordinator" ? "Coordinador" : "Brigadista"}
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
