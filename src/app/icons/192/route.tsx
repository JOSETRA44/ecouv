import { ImageResponse } from "next/og";
import { sunIcon } from "@/lib/pwa-icon";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(sunIcon({ canvas: 192, radius: 40, iconRatio: 0.6 }), {
    width: 192,
    height: 192,
  });
}
