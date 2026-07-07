import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-linea bg-neutro">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-unsa.svg"
                alt="Universidad Nacional de San Agustín de Arequipa"
                width={44}
                height={44}
                unoptimized
              />
              <Image
                src="/brand/logo-fec.svg"
                alt="Facultad de Economía"
                width={44}
                height={44}
                unoptimized
              />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Proyecto de Responsabilidad Social Universitaria 2026-A ·
              Asignatura Economía Política 2 (secciones A y B) · Universidad
              Nacional de San Agustín de Arequipa.
            </p>
          </div>

          <div>
            <h3 className="microlabel text-faint">Plataforma</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#proyecto" className="text-ink transition-colors hover:text-guinda-600">El proyecto</Link></li>
              <li><Link href="/#normativa" className="text-ink transition-colors hover:text-guinda-600">Marco normativo</Link></li>
              <li><Link href="/foro" className="text-ink transition-colors hover:text-guinda-600">Foro Ambiental y de Salud</Link></li>
              <li><Link href="/login" className="text-ink transition-colors hover:text-guinda-600">Portal de brigadistas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="microlabel text-faint">Marco de referencia</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>D.S. N.° 003-2026-SA</li>
              <li>Ley N.° 30102 — Fotoprotección</li>
              <li>Política Ambiental UNSA 2023-2028</li>
              <li>Reglamento de Voluntariado RCU-0583-2022</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-linea pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Brigada Ambiental Universitaria — Facultad de Economía, UNSA.</p>
          <p>Docente coordinador: José Zuzunaga Melgar</p>
        </div>
      </div>
    </footer>
  );
}
