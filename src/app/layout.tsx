import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brigada Ambiental FEC · RSU UNSA 2026-A",
    template: "%s · Brigada Ambiental FEC",
  },
  description:
    "Plataforma del proyecto de Responsabilidad Social Universitaria de la Facultad de Economía (UNSA): prevención frente a la radiación solar en Arequipa, monitor UV en vivo, brigada estudiantil y Foro Ambiental y de Salud 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${archivo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
