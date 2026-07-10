import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5E151D",
        }}
      >
        <svg width="108" height="108" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
          <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round">
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
    ),
    { ...size },
  );
}
