import type { Metadata } from "next";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FORUM_SLUG } from "@/features/foro/schema";
import { AforoBar } from "@/features/foro/aforo-bar";
import { RegistrationForm } from "@/features/foro/registration-form";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Foro Ambiental y de Salud 2026",
  description:
    "Inscríbete al Foro Ambiental y de Salud 2026 de la Facultad de Economía (UNSA). Aforo limitado a 130 personas con control en tiempo real.",
  alternates: { canonical: "/foro" },
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
        <h1 className="display text-4xl text-navy">
          El foro aún no está programado.
        </h1>
        <p className="mt-4 font-light text-muted">
          Vuelve pronto para más información.
        </p>
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.starts_at,
    location: {
      "@type": "Place",
      name: event.venue,
      address: "Arequipa, Perú",
    },
    organizer: {
      "@type": "Organization",
      name: "Brigada Ambiental Universitaria — Facultad de Economía, UNSA",
    },
    maximumAttendeeCapacity: capacity,
    isAccessibleForFree: true,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-linea bg-white">
        <div className="pattern-graph" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <p className="microlabel text-granate-700">
              Evento central del proyecto RSU 2026-A
            </p>
            <h1 className="display mt-6 max-w-3xl text-4xl text-navy sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-ink">
              {event.description}
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <dl className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
              {[
                { icon: CalendarDays, label: "Fecha y hora", value: dateLabel, cap: true },
                { icon: MapPin, label: "Lugar", value: event.venue ?? "" },
                {
                  icon: Users,
                  label: "Aforo",
                  value: `${capacity} personas · entrada libre con inscripción`,
                },
              ].map((item) => (
                <div key={item.label} className="border-t border-linea pt-4">
                  <dt className="microlabel flex items-center gap-2 text-faint">
                    <item.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-2 text-sm text-navy ${item.cap ? "capitalize" : ""}`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-neutro py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <div className="rounded-card border border-linea bg-white p-8 shadow-z2 lg:sticky lg:top-24">
              <h2 className="microlabel text-muted">
                Control de aforo automatizado
              </h2>
              <div className="mt-6">
                <AforoBar
                  eventId={event.id}
                  initialRegistered={registered}
                  capacity={capacity}
                />
              </div>
              <p className="mt-8 border-t border-linea pt-6 text-sm font-light leading-relaxed text-muted">
                El límite de {capacity} vacantes se aplica directamente en la
                base de datos: cuando se completa, el sistema cierra las
                inscripciones de forma automática e instantánea.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="display text-3xl text-navy">Reserva tu vacante</h2>
              <p className="mt-3 font-light text-muted">
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
