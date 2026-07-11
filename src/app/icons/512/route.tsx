import { ImageResponse } from "next/og";
import { sunIcon } from "@/lib/pwa-icon";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(sunIcon({ canvas: 512, radius: 108, iconRatio: 0.6 }), {
    width: 512,
    height: 512,
  });
}
