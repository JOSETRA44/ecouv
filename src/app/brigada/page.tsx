import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarClock,
  Camera,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutBrigadista } from "@/features/brigada/actions";
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
    body: "Tu cuenta está activa. Los módulos operativos se habilitan conforme avanza el cronograma del proyecto.",
  },
  rejected: {
    tone: "alert" as const,
    label: "Registro observado",
    body: "Tu registro fue observado. Acércate al docente coordinador para regularizar tu situación.",
  },
};

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
          <form action={signOutBrigadista}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-btn px-3 py-2 text-sm text-ink transition-colors hover:bg-guinda-50 hover:text-guinda-700"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="microlabel text-guinda-700">
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
          <Card>
            <span className="flex h-11 w-11 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
              <CalendarClock className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-navy">Mis turnos</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Programación de turnos de vigilancia ambiental en los puntos
              informativos del pabellón.
            </p>
            <Badge tone="neutral" className="mt-4">Disponible en la etapa 2</Badge>
          </Card>

          <Card>
            <span className="flex h-11 w-11 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-navy">Asistencia</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Registro de participación en campañas, capacitaciones y el Foro
              Ambiental y de Salud.
            </p>
            <Badge tone="neutral" className="mt-4">Disponible en la etapa 2</Badge>
          </Card>

          <Card>
            <span className="flex h-11 w-11 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
              <Camera className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-navy">Evidencias</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Bitácora fotográfica de las intervenciones para el informe final
              del proyecto RSU.
            </p>
            <Badge tone="neutral" className="mt-4">Disponible en la etapa 2</Badge>
          </Card>
        </div>

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
