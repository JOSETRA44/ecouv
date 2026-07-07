import type { Metadata } from "next";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FORUM_SLUG } from "@/features/foro/schema";
import { AforoBar } from "@/features/foro/aforo-bar";
import { RegistrationForm } from "@/features/foro/registration-form";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Foro Ambiental y de Salud 2026",
  description:
    "Inscríbete al Foro Ambiental y de Salud 2026 de la Facultad de Economía (UNSA). Aforo limitado a 130 personas con control en tiempo real.",
};

export default async function ForoPage() {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("forum_events")
    .select("id, title, description, starts_at, venue, capacity, is_open")
    .eq("slug", FORUM_SLUG)
    .maybeSingle();

  const { data: seats } = event
    ? await supabase
        .from("forum_seat_counts")
        .select("registered, capacity")
        .eq("event_id", event.id)
        .maybeSingle()
    : { data: null };

  if (!event) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-28 text-center">
        <h1 className="display text-4xl font-bold text-navy">
          El foro aún no está programado.
        </h1>
        <p className="mt-4 text-muted">Vuelve pronto para más información.</p>
      </section>
    );
  }

  const registered = seats?.registered ?? 0;
  const capacity = seats?.capacity ?? event.capacity;
  const full = registered >= capacity;
  const dateLabel = event.starts_at
    ? new Intl.DateTimeFormat("es-PE", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "America/Lima",
      }).format(new Date(event.starts_at))
    : "Fecha por confirmar";

  return (
    <>
      <section className="relative overflow-hidden border-b border-linea">
        <div className="mesh" aria-hidden>
          <i /><i /><i />
        </div>
        <div className="grain relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <Badge>EVENTO CENTRAL DEL PROYECTO RSU 2026-A</Badge>
            <h1 className="display mt-6 max-w-3xl text-4xl font-extrabold text-navy sm:text-5xl lg:text-6xl">
              {event.title.toUpperCase()}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
              {event.description}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-guinda-600" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Fecha y hora
                  </dt>
                  <dd className="mt-1 text-sm font-medium capitalize text-navy">
                    {dateLabel}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-guinda-600" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Lugar
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {event.venue}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-1 h-5 w-5 shrink-0 text-guinda-600" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Aforo
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy">
                    {capacity} personas · entrada libre con inscripción
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-crema py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
          <Reveal>
            <div className="rounded-card border border-linea bg-white p-8 shadow-z2 lg:sticky lg:top-24">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Control de aforo automatizado
              </h2>
              <div className="mt-6">
                <AforoBar
                  eventId={event.id}
                  initialRegistered={registered}
                  capacity={capacity}
                />
              </div>
              <p className="mt-8 border-t border-superficie pt-6 text-sm leading-relaxed text-muted">
                El límite de {capacity} vacantes se aplica directamente en la
                base de datos: cuando se completa, el sistema cierra las
                inscripciones de forma automática e instantánea.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="display text-3xl font-bold text-navy">
                Reserva tu vacante
              </h2>
              <p className="mt-3 text-muted">
                {full
                  ? "El aforo se ha completado. ¡Gracias por el enorme interés!"
                  : "Completa tus datos: la confirmación es inmediata."}
              </p>
              <div className="mt-8">
                <RegistrationForm disabled={full || !event.is_open} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
