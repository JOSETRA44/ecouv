import { Metadata } from "next";
import { notFound } from "next/navigation";
import { docentes } from "@/data/docentes";
import ProfileClient from "./ProfileClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const docente = docentes.find((d) => d.slug === slug);

  if (!docente) {
    return { title: "Docente no encontrado" };
  }

  return {
    title: `${docente.fullName} | Perfil Docente UNSA`,
    description: `Perfil académico de ${docente.fullName}, ${docente.rol} en la ${docente.facultad} de la ${docente.institucion}. Investigador RENACYT y docente universitario.`,
    openGraph: {
      title: `${docente.fullName} | Perfil Docente UNSA`,
      description: docente.resumen.substring(0, 160) + "...",
      type: "profile",
    },
  };
}

export default async function DocentePage({ params }: Props) {
  const { slug } = await params;
  const docente = docentes.find((d) => d.slug === slug);

  if (!docente) {
    notFound();
  }

  // Schema.org Person JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: docente.fullName,
    jobTitle: docente.rol,
    worksFor: {
      "@type": "Organization",
      name: docente.institucion,
    },
    url: typeof window !== "undefined" ? window.location.href : "",
    sameAs: [docente.linkedin, `https://orcid.org/${docente.orcid}`],
    description: docente.resumen,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileClient docente={docente} />
    </>
  );
}
