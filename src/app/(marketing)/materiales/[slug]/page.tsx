import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMaterialBySlug, materialPublicUrl } from "@/features/materiales/queries";
import { CATEGORY_LABEL, iconForMime } from "@/features/materiales/material-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

const PREVIEWABLE_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const material = await getMaterialBySlug(supabase, slug);
  if (!material) return {};

  return {
    title: material.title,
    description: material.description,
    alternates: { canonical: `/materiales/${slug}` },
    openGraph: {
      title: material.title,
      description: material.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: material.title,
      description: material.description,
    },
  };
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const material = await getMaterialBySlug(supabase, slug);
  if (!material) notFound();

  const fileUrl = materialPublicUrl(supabase, material.storage_path);
  const Icon = iconForMime(material.mime_type);
  const dateLabel = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeZone: "America/Lima",
  }).format(new Date(material.published_at));
  const sizeLabel = `${(material.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`;
  const extension = material.storage_path.split(".").pop()?.toUpperCase() ?? "";

  return (
    <section className="border-b border-linea bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          {material.category && (
            <Badge tone="neutral" className="mb-4">
              {CATEGORY_LABEL[material.category] ?? material.category}
            </Badge>
          )}
          <h1 className="display text-4xl text-navy sm:text-5xl">{material.title}</h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-ink">
            {material.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-linea pt-6 sm:grid-cols-3">
            <div>
              <dt className="microlabel flex items-center gap-2 text-faint">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} /> Publicado
              </dt>
              <dd className="mt-1 text-sm text-navy">{dateLabel}</dd>
            </div>
            <div>
              <dt className="microlabel flex items-center gap-2 text-faint">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> Formato
              </dt>
              <dd className="mt-1 text-sm uppercase text-navy">{extension}</dd>
            </div>
            <div>
              <dt className="microlabel text-faint">Tamaño</dt>
              <dd className="tnum mt-1 text-sm text-navy">{sizeLabel}</dd>
            </div>
          </dl>

          <div className="mt-10">
            <ButtonLink href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> Descargar material
            </ButtonLink>
          </div>

          {PREVIEWABLE_MIME.has(material.mime_type) && (
            <div className="mt-12 overflow-hidden rounded-card border border-linea">
              {material.mime_type === "application/pdf" ? (
                <iframe src={fileUrl} className="h-[600px] w-full" title={material.title} />
              ) : (
                // Contenido subido por el coordinador, servido desde un bucket
                // público sin dominio configurado en next/image; <img> plano evita
                // acoplar la config de imágenes remotas a un caso de uso puntual.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fileUrl} alt={material.title} className="w-full" />
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
