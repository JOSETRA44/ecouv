import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brigada Ambiental FEC · RSU UNSA 2026-A",
    template: "%s · Brigada Ambiental FEC",
  },
  description:
    "Plataforma del proyecto de Responsabilidad Social Universitaria de la Facultad de Economía (UNSA): monitor UV en vivo de Arequipa, prevención frente a la radiación solar (D.S. N.° 003-2026-SA), brigada estudiantil y Foro Ambiental y de Salud 2026.",
  keywords: [
    "RSU",
    "Responsabilidad Social Universitaria",
    "UNSA",
    "Facultad de Economía",
    "radiación solar Arequipa",
    "índice UV Arequipa",
    "fotoprotección",
    "brigada ambiental",
    "D.S. 003-2026-SA",
  ],
  authors: [{ name: "Brigada Ambiental Universitaria — Facultad de Economía, UNSA" }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Brigada Ambiental FEC",
    title: "Brigada Ambiental FEC · RSU UNSA 2026-A",
    description:
      "Prevención frente a la radiación solar en Arequipa: monitor UV en vivo, brigada estudiantil y Foro Ambiental y de Salud 2026.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brigada Ambiental FEC · RSU UNSA 2026-A",
    description:
      "Prevención frente a la radiación solar en Arequipa: monitor UV en vivo, brigada estudiantil y Foro Ambiental y de Salud 2026.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    // Google Search Console — confirma la propiedad del sitio para indexación y métricas.
    google: "54pQ5jP-F_ImfhYpsEoXOVilu9R9brGmOdE-IH9shdY",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${plexMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
