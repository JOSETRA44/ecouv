import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getMaterialBySlug } from "@/features/materiales/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABEL: Record<string, string> = {
  infografia: "Infografía",
  documento: "Documento",
  guia: "Guía",
};

export default async function MaterialOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const material = await getMaterialBySlug(supabase, slug);

  const eyebrow = material?.category
    ? (CATEGORY_LABEL[material.category] ?? material.category)
    : "Material";
  const title = material?.title ?? "Brigada Ambiental FEC";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#5E151D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
              <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1.5" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22.5" />
                <line x1="1.5" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22.5" y2="12" />
                <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
                <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
                <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
                <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
              </g>
            </svg>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#0A1F33",
            }}
          >
            Brigada Ambiental FEC
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#5E151D",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              width: 980,
              fontSize: 52,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#0A1F33",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 15,
            color: "#64748D",
          }}
        >
          Proyecto RSU 2026-A · Facultad de Economía · UNSA
        </div>
      </div>
    ),
    { ...size },
  );
}
