import Image from "next/image";
import {
  ArrowRight,
  Recycle,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { UvMonitor } from "@/components/site/uv-monitor";
import { HeroBackdrop } from "@/components/site/hero-backdrop";
import { Reveal } from "@/components/site/reveal";
import { StatCounter } from "@/components/site/stat-counter";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Brigada Ambiental Universitaria — Facultad de Economía, UNSA",
  description:
    "Proyecto de Responsabilidad Social Universitaria 2026-A: prevención frente a la radiación solar en Arequipa.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Nacional de San Agustín de Arequipa",
  },
};

export default function HomePage() {
  return (
    <main className="relative">
      {/* ============ GRID ARQUITECTÓNICO (BLUEPRINT GLOBAL) ============ */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1920px] justify-between px-4 sm:px-6 lg:px-16 2xl:px-24 [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]" 
        aria-hidden="true" 
      >
        <div className="h-full w-px bg-linea/70" />
        <div className="h-full w-px bg-linea/70" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden border-b border-linea bg-white">
        <div className="pattern-graph" aria-hidden />
        {/* Fondo vectorial a medida: curvas de indiferencia + red de datos */}
        <HeroBackdrop />

        {/* ── Baño de luz fluida (Fondo Personalizado) ── 
             1. DOM Order / Z-index: Al no tener -z-10 y estar después de HeroBackdrop, se pinta SOBRE los nodos.
             2. Responsive Flow: En móvil se ancla abajo (h-[60%]) y se rota para enmarcar la tarjeta; en desktop a la derecha. */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-full md:inset-y-0 md:h-full md:w-[60%] lg:w-[50%]" aria-hidden="true">
          <Image
            src="/brand/fondo_1.svg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.9] mix-blend-multiply rotate-90 scale-125 md:rotate-0 md:scale-100 md:object-left"
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <p className="microlabel animate-fade-up text-granate-700">
              Proyecto RSU 2026-A · Facultad de Economía · UNSA
            </p>
            <h1
              className="display animate-fade-up mt-6 text-5xl text-navy sm:text-6xl lg:text-[64px]"
              style={{ animationDelay: "80ms" }}
            >
              La prevención también es una{" "}
              <span className="font-normal text-granate-600">
                decisión económica
              </span>
              .
            </h1>
            <p
              className="animate-fade-up mt-7 max-w-xl text-lg font-light leading-relaxed text-ink"
              style={{ animationDelay: "160ms" }}
            >
              Arequipa registra uno de los índices de radiación ultravioleta
              más altos del planeta. La Brigada Ambiental Universitaria
              convierte la teoría de externalidades en acción: vigilancia del
              índice UV, cultura de fotoprotección y cumplimiento del D.S.
              N.° 003-2026-SA en el campus.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink href="/foro">
                Inscribirme al Foro 2026 <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/login" variant="ghost">
                Portal de brigadistas
              </ButtonLink>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <UvMonitor />
          </div>
        </div>
      </section>

      {/* ============ FRANJA DE DATOS CLAVE ============ */}
      <div className="border-b border-linea bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-linea px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            ["Franja crítica diaria", "10:00 — 15:00"],
            ["Norma vigente", "D.S. N.° 003-2026-SA"],
            ["Protocolo", "Sombrero de ala ancha · bloqueador · sombra"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 py-5 sm:px-8 sm:first:pl-0">
              <span className="microlabel text-faint">{k}</span>
              <span className="tnum text-sm text-navy">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ METAS ============ */}
      <section className="bg-neutro py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="microlabel text-granate-700">Metas del semestre</p>
            <h2 className="display mt-4 max-w-2xl text-4xl text-navy sm:text-5xl">
              Un proyecto que se mide en personas.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0.05}>
              <StatCounter
                value={90}
                label="Brigadistas"
                detail="Estudiantes de Economía Política 2, secciones A y B, conforman la brigada activa."
              />
            </Reveal>
            <Reveal delay={0.11}>
              <StatCounter
                value={500}
                label="Sensibilizados"
                detail="Meta de la campaña de difusión en puntos informativos del pabellón de Economía."
              />
            </Reveal>
            <Reveal delay={0.17}>
              <StatCounter
                value={130}
                label="Aforo del foro"
                detail="Vacantes exactas para el Foro Ambiental y de Salud, con control automático."
              />
            </Reveal>
            <Reveal delay={0.23}>
              <StatCounter
                value={11}
                suffix="+"
                label="Índice UV extremo"
                detail="Nivel que Arequipa alcanza en temporada alta: de los más severos del mundo."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ JUSTIFICACIÓN ECONÓMICA ============ */}
      <section id="proyecto" className="border-y border-linea bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="microlabel text-granate-700">¿Por qué desde Economía?</p>
            <h2 className="display mt-4 max-w-3xl text-4xl text-navy sm:text-5xl">
              La radiación solar es una externalidad. Gestionarla es economía
              aplicada.
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted">
              El proyecto implementa aprendizaje-servicio: los estudiantes no
              solo reciben teoría, gestionan una solución real para una
              problemática latente de su propio entorno universitario.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                src: "/brand/radiacion/ExternalidadesNegativas.svg",
                title: "Externalidades negativas",
              },
              {
                src: "/brand/radiacion/CostoBeneficio.svg",
                title: "Costo-beneficio de prevenir",
              },
              {
                src: "/brand/radiacion/CapitalHumano.svg",
                title: "Capital humano",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={0.05 + i * 0.07}>
                <article className="group relative overflow-hidden rounded-[24px] border border-linea bg-neutro shadow-z1 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-z3">
                  <Image
                    src={card.src}
                    alt={card.title}
                    width={800}
                    height={800}
                    className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Subtle glare effect on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-white/40" />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-4 rounded-card border border-linea bg-neutro p-6">
              <Recycle className="mt-0.5 h-5 w-5 shrink-0 text-granate-600" strokeWidth={1.6} />
              <p className="text-[15px] font-light leading-relaxed text-ink">
                <span className="font-medium text-navy">Economía circular:</span>{" "}
                la brigada diseña artículos de protección solar fabricados con
                materiales reciclados y propuestas técnicas de mallas
                protectoras, conectando fotoprotección con ecodiseño y
                reducción de residuos.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ NORMATIVA ============ */}
      <section id="normativa" className="bg-neutro py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <p className="microlabel text-granate-700">Marco normativo</p>
                <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">
                  No es solo voluntad: es ley.
                </h2>
                <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-muted">
                  Como institución pública, la UNSA tiene el deber de
                  implementar las medidas preventivas frente a la radiación
                  solar. Este proyecto materializa ese cumplimiento.
                </p>
              </div>
            </Reveal>

            <div className="space-y-4">
              {[
                {
                  title: "D.S. N.° 003-2026-SA",
                  body: "Dicta medidas preventivas obligatorias ante los efectos nocivos de la radiación solar. Es el fundamento directo de la campaña de difusión y los puntos informativos de salud.",
                },
                {
                  title: "Ley N.° 30102 y su reglamento",
                  body: "Ordena medidas de prevención frente a la radiación solar en entidades públicas: convierte a la Facultad de Economía en un entorno académico y laboral seguro.",
                },
                {
                  title: "Política Ambiental UNSA 2023-2028",
                  body: "Objetivo Específico 4: desarrollar acciones de participación frente a la problemática ambiental. Lineamiento 14: fomentar el voluntariado ambiental en todos los programas.",
                },
                {
                  title: "Reglamento de Voluntariado Agustino (RCU-0583-2022)",
                  body: "Faculta a los estudiantes a organizarse en brigadas para generar impacto social positivo, con documentos de gestión y junta directiva formales.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <article className="rounded-card border border-linea bg-white p-7 transition-shadow duration-300 hover:shadow-z2">
                    <h3 className="text-base font-medium text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-light leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ACTIVIDADES ============ */}
      <section id="actividades" className="border-y border-linea bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="microlabel text-granate-700">
              Hoja de ruta · mayo — julio 2026
            </p>
            <h2 className="display mt-4 max-w-2xl text-4xl text-navy sm:text-5xl">
              Cinco movimientos, un semestre.
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                mes: "May",
                title: "Constitución de la brigada",
                body: "Documentos de gestión, junta directiva y asignación de roles para los 90 brigadistas.",
              },
              {
                mes: "May",
                title: "Material informativo",
                body: "Afiches, infografías y recursos didácticos sobre salud preventiva y cuidado ambiental.",
              },
              {
                mes: "Jun",
                title: "Campaña de sensibilización",
                body: "Puntos informativos de salud en el pabellón de Economía y difusión del D.S. 003-2026-SA.",
              },
              {
                mes: "Jul",
                title: "Foro Ambiental y de Salud",
                body: "Ponencias de especialistas en salud pública y gestión ambiental. Aforo: 130 personas.",
              },
              {
                mes: "Jul",
                title: "Evaluación y cierre",
                body: "Encuestas de satisfacción, bitácora fotográfica e informe final al Departamento Académico.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="relative border-t border-linea pt-5">
                  <span
                    className="absolute -top-px left-0 h-[2px] w-8 bg-granate-600"
                    aria-hidden
                  />
                  <span className="microlabel text-faint">{step.mes} 2026</span>
                  <h3 className="mt-2 text-base font-medium leading-snug text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ COORDINACIÓN ============ */}
      <section id="coordinacion" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <Reveal>
              <figure className="relative mx-auto w-full max-w-xs">
                <div className="overflow-hidden rounded-card border border-linea shadow-z2">
                  <Image
                    src="/brand/jose-zuzunaga.svg"
                    alt="José Zuzunaga Melgar, docente coordinador del proyecto"
                    width={480}
                    height={480}
                    unoptimized
                    className="h-auto w-full"
                  />
                </div>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="microlabel text-granate-700">Coordinación del proyecto</p>
              <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">
                José Zuzunaga Melgar
              </h2>
              <p className="mt-2 text-sm text-muted">
                Docente coordinador · Departamento Académico de Economía
              </p>
              <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-ink">
                Dirige la asignatura Economía Política 2 (secciones A y B) y
                coordina a los 90 estudiantes de la brigada. El proyecto forma
                parte del Plan Anual de Responsabilidad Social del Departamento
                Académico de Economía, bajo el enfoque de aprendizaje-servicio.
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-6">
                <div className="border-t border-linea pt-4">
                  <dt className="microlabel text-faint">Asignatura</dt>
                  <dd className="mt-1 text-sm text-navy">Economía Política 2</dd>
                </div>
                <div className="border-t border-linea pt-4">
                  <dt className="microlabel text-faint">Periodo</dt>
                  <dd className="tnum mt-1 text-sm text-navy">Mayo — Julio 2026</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA FORO ============ */}
      <section className="border-t border-linea bg-granate-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="microlabel text-white/60">Evento central · Julio 2026</p>
            <h2 className="display mx-auto mt-4 max-w-3xl text-4xl text-white sm:text-5xl">
              Foro Ambiental y de Salud 2026
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-white/75">
              130 vacantes exactas. Especialistas en salud pública y gestión
              ambiental, con la comunidad universitaria e instituciones de
              Arequipa.
            </p>
            <div className="mt-9">
              <ButtonLink
                href="/foro"
                variant="secondary"
                className="border-transparent"
              >
                Reservar mi vacante <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
