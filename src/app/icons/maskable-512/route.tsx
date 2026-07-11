import { ImageResponse } from "next/og";
import { sunIcon } from "@/lib/pwa-icon";

export const dynamic = "force-static";

/** Fondo a sangre completa + logo dentro de la "safe zone" (~80%) para adaptive icons. */
export async function GET() {
  return new ImageResponse(sunIcon({ canvas: 512, radius: 0, iconRatio: 0.42 }), {
    width: 512,
    height: 512,
  });
}
