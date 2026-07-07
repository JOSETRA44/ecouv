import {
  ArrowRight,
  Scale,
  TrendingDown,
  HeartPulse,
  Recycle,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UvMonitor } from "@/components/site/uv-monitor";
import { Reveal } from "@/components/site/reveal";
import { StatCounter } from "@/components/site/stat-counter";

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-linea">
        <div className="mesh" aria-hidden>
          <i /><i /><i />
        </div>
        <div className="grain relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <Reveal>
              <Badge>PROYECTO RSU 2026-A · FACULTAD DE ECONOMÍA · UNSA</Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display mt-6 text-5xl font-extrabold text-navy sm:text-6xl lg:text-7xl">
                LA PREVENCIÓN
                <br />
                TAMBIÉN ES UNA
                <br />
                <span className="text-guinda-600">DECISIÓN ECONÓMICA.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink">
                Arequipa registra uno de los índices de radiación ultravioleta
                más altos del planeta. La Brigada Ambiental Universitaria
                convierte la teoría de externalidades en acción: vigilancia del
                índice UV, cultura de fotoprotección y cumplimiento del D.S.
                N.° 003-2026-SA en el campus.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/foro">
                  Inscribirme al Foro 2026 <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary">
                  Portal de brigadistas
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="flex justify-center lg:justify-end">
            <UvMonitor />
          </div>
        </div>
      </section>

      {/* ============ CINTA MARQUEE (acento brutalista) ============ */}
      <div className="overflow-hidden border-b border-linea bg-navy py-3.5">
        <div className="flex w-max animate-marquee gap-0">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-10 pr-10 text-sm font-semibold uppercase tracking-[0.18em] text-white/80"
            >
              <span>Protegerse cuesta menos que enfermarse</span>
              <span className="text-naranja">●</span>
              <span>Franja crítica 10:00 — 15:00</span>
              <span className="text-naranja">●</span>
              <span>D.S. N.° 003-2026-SA · medidas preventivas obligatorias</span>
              <span className="text-naranja">●</span>
              <span>Sombrero de ala ancha + bloqueador + sombra</span>
              <span className="text-naranja">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ METAS ============ */}
      <section className="bg-crema py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-guinda-600">
              Metas del semestre
            </p>
            <h2 className="display mt-3 max-w-2xl text-4xl font-bold text-navy sm:text-5xl">
              Un proyecto que se mide en personas.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0.05}>
              <StatCounter
                value={90}
                label="Brigadistas"
                detail="Estudiantes de Economía Política 2, secciones A y B, conforman la brigada activa."
              />
            </Reveal>
            <Reveal delay={0.12}>
              <StatCounter
                value={500}
                label="Sensibilizados"
                detail="Meta de la campaña de difusión en puntos informativos del pabellón de Economía."
              />
            </Reveal>
            <Reveal delay={0.19}>
              <StatCounter
                value={130}
                label="Aforo del foro"
                detail="Vacantes exactas para el Foro Ambiental y de Salud, con control automático."
              />
            </Reveal>
            <Reveal delay={0.26}>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-guinda-600">
              ¿Por qué desde Economía?
            </p>
            <h2 className="display mt-3 max-w-3xl text-4xl font-bold text-navy sm:text-5xl">
              La radiación solar es una externalidad. Gestionarla es economía
              aplicada.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              El proyecto implementa aprendizaje-servicio: los estudiantes no
              solo reciben teoría, gestionan una solución real para una
              problemática latente de su propio entorno universitario.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Reveal delay={0.05}>
              <Card className="h-full">
                <span className="flex h-12 w-12 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
                  <Scale className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-navy">
                  Externalidades negativas
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  La exposición prolongada a la radiación UV genera costos de
                  salud que nadie paga en el mercado: afecciones cutáneas y
                  oculares evitables. El curso las identifica y analiza desde
                  una perspectiva real y local.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.12}>
              <Card className="h-full">
                <span className="flex h-12 w-12 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
                  <TrendingDown className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-navy">
                  Costo-beneficio de prevenir
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Invertir en prevención (señalización, fotoprotección,
                  educación) cuesta una fracción de lo que cuesta tratar
                  enfermedades prevenibles. El proyecto documenta esa brecha
                  con datos del campus.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.19}>
              <Card className="h-full">
                <span className="flex h-12 w-12 items-center justify-center rounded-card bg-guinda-50 text-guinda-600">
                  <HeartPulse className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-navy">
                  Capital humano
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  La salud ambiental preserva el activo más importante de la
                  universidad: sus personas. Bienes públicos y sostenibilidad
                  aplicados al bienestar de la comunidad agustina.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-4 rounded-card border border-guinda-200 bg-guinda-50/60 p-6">
              <Recycle className="mt-0.5 h-6 w-6 shrink-0 text-guinda-600" />
              <p className="text-[15px] leading-relaxed text-ink">
                <strong className="text-navy">Economía circular:</strong> la
                brigada diseña artículos de protección solar fabricados con
                materiales reciclados y propuestas técnicas de mallas
                protectoras, conectando fotoprotección con ecodiseño y
                reducción de residuos.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ NORMATIVA ============ */}
      <section id="normativa" className="bg-crema py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-guinda-600">
                  Marco normativo
                </p>
                <h2 className="display mt-3 text-4xl font-bold text-navy sm:text-5xl">
                  No es solo voluntad: es ley.
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                  Como institución pública, la UNSA tiene el deber de
                  implementar las medidas preventivas frente a la radiación
                  solar. Este proyecto materializa ese cumplimiento.
                </p>
              </div>
            </Reveal>

            <div className="space-y-4">
              {[
                {
                  n: "01",
                  title: "D.S. N.° 003-2026-SA",
                  body: "Dicta medidas preventivas obligatorias ante los efectos nocivos de la radiación solar. Es el fundamento directo de la campaña de difusión y los puntos informativos de salud.",
                },
                {
                  n: "02",
                  title: "Ley N.° 30102 y su reglamento",
                  body: "Ordena medidas de prevención frente a la radiación solar en entidades públicas: convierte a la Facultad de Economía en un entorno académico y laboral seguro.",
                },
                {
                  n: "03",
                  title: "Política Ambiental UNSA 2023-2028",
                  body: "Objetivo Específico 4: desarrollar acciones de participación frente a la problemática ambiental. Lineamiento 14: fomentar el voluntariado ambiental en todos los programas.",
                },
                {
                  n: "04",
                  title: "Reglamento de Voluntariado Agustino (RCU-0583-2022)",
                  body: "Faculta a los estudiantes a organizarse en brigadas para generar impacto social positivo, con documentos de gestión y junta directiva formales.",
                },
              ].map((item, i) => (
                <Reveal key={item.n} delay={i * 0.07}>
                  <div className="group flex gap-6 rounded-card border border-linea bg-white p-7 shadow-z1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-z2">
                    <span className="display text-3xl font-extrabold text-guinda-200 transition-colors group-hover:text-guinda-600">
                      {item.n}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-guinda-600">
              Hoja de ruta · mayo — julio 2026
            </p>
            <h2 className="display mt-3 max-w-2xl text-4xl font-bold text-navy sm:text-5xl">
              Cinco movimientos, un semestre.
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                mes: "Mayo",
                title: "Constitución de la brigada",
                body: "Documentos de gestión, junta directiva y asignación de roles para los 90 brigadistas.",
              },
              {
                mes: "Mayo",
                title: "Material informativo",
                body: "Afiches, infografías y recursos didácticos sobre salud preventiva y cuidado ambiental.",
              },
              {
                mes: "Junio",
                title: "Campaña de sensibilización",
                body: "Puntos informativos de salud en el pabellón de Economía y difusión del D.S. 003-2026-SA.",
              },
              {
                mes: "Julio",
                title: "Foro Ambiental y de Salud",
                body: "Ponencias de especialistas en salud pública y gestión ambiental. Aforo: 130 personas.",
              },
              {
                mes: "Julio",
                title: "Evaluación y cierre",
                body: "Encuestas de satisfacción, bitácora fotográfica e informe final al Departamento Académico.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07}>
                <li className="relative border-t-2 border-guinda-600 pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-guinda-600">
                    {step.mes}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ CTA FORO ============ */}
      <section className="relative overflow-hidden bg-guinda-700">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,0,74,0.95) 0%, rgba(116,0,62,0.92) 45%, rgba(255,97,24,0.55) 130%)",
          }}
        />
        <div className="grain relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <h2 className="display mx-auto max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
              FORO AMBIENTAL Y DE SALUD 2026
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              130 vacantes exactas. Especialistas en salud pública y gestión
              ambiental, con la comunidad universitaria e instituciones de
              Arequipa.
            </p>
            <div className="mt-9">
              <ButtonLink
                href="/foro"
                className="bg-white text-guinda-700 hover:bg-crema active:bg-crema-strong"
              >
                Reservar mi vacante <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
