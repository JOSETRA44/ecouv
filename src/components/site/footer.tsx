import Link from "next/link";
import { Sun } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-guinda-600 text-white">
                <Sun className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="display text-lg font-bold tracking-tight">
                BRIGADA AMBIENTAL FEC
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Proyecto de Responsabilidad Social Universitaria 2026-A ·
              Asignatura Economía Política 2 (secciones A y B) · Universidad
              Nacional de San Agustín de Arequipa.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Plataforma
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#proyecto" className="text-white/70 transition-colors hover:text-white">El proyecto</Link></li>
              <li><Link href="/#normativa" className="text-white/70 transition-colors hover:text-white">Marco normativo</Link></li>
              <li><Link href="/foro" className="text-white/70 transition-colors hover:text-white">Foro Ambiental y de Salud</Link></li>
              <li><Link href="/login" className="text-white/70 transition-colors hover:text-white">Portal de brigadistas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Marco de referencia
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>D.S. N.° 003-2026-SA</li>
              <li>Ley N.° 30102 — Fotoprotección</li>
              <li>Política Ambiental UNSA 2023-2028</li>
              <li>Reglamento de Voluntariado RCU-0583-2022</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Brigada Ambiental Universitaria — Facultad de Economía,
            UNSA.
          </p>
          <p>Docente coordinador: José Zuzunaga Melgar</p>
        </div>
      </div>
    </footer>
  );
}
