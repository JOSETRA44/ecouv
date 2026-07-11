import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brigada Ambiental FEC — RSU UNSA 2026-A",
    short_name: "Brigada Ambiental",
    description:
      "Monitor UV en vivo, brigada estudiantil y Foro Ambiental y de Salud 2026 — Facultad de Economía, UNSA.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#5E151D",
    lang: "es",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
