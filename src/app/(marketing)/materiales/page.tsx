import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listPublishedMaterials } from "@/features/materiales/queries";
import { MaterialCard } from "@/features/materiales/material-card";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Materiales",
  description:
    "Infografías, guías y documentos publicados por la Brigada Ambiental FEC (UNSA): descarga y comparte los recursos del proyecto.",
  alternates: { canonical: "/materiales" },
};

const PAGE_SIZE = 12;

export default async function MaterialesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { items, hasMore } = await listPublishedMaterials(supabase, {
    limit: PAGE_SIZE,
    offset,
  });

  return (
    <section className="border-b border-linea bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="microlabel text-granate-700">Repositorio</p>
          <h1 className="display mt-4 max-w-2xl text-4xl text-navy sm:text-5xl">
            Materiales de la brigada
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted">
            Infografías, guías y documentos publicados por el coordinador del
            proyecto. Descárgalos y compártelos libremente.
          </p>
        </Reveal>

        {items.length > 0 ? (
          <>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((material) => (
                <Reveal key={material.id}>
                  <MaterialCard material={material} />
                </Reveal>
              ))}
            </div>

            {(page > 1 || hasMore) && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {page > 1 && (
                  <ButtonLink href={`/materiales?page=${page - 1}`} variant="secondary">
                    Anteriores
                  </ButtonLink>
                )}
                {hasMore && (
                  <ButtonLink href={`/materiales?page=${page + 1}`} variant="secondary">
                    Siguientes
                  </ButtonLink>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="mt-14 text-sm text-muted">
            {page > 1 ? "No hay más materiales." : "Aún no hay materiales publicados."}
          </p>
        )}
      </div>
    </section>
  );
}
