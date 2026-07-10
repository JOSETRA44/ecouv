import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            Proyecto RSU 2026-A · Facultad de Economía · UNSA
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 980,
              fontSize: 56,
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#0A1F33",
            }}
          >
            <div style={{ display: "flex" }}>La prevención también es una</div>
            <div style={{ display: "flex", fontWeight: 500, color: "#5E151D" }}>
              decisión económica.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 48 }}>
          {[
            ["90", "Brigadistas"],
            ["500", "Sensibilizados"],
            ["130", "Aforo del foro"],
          ].map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 34, fontWeight: 300, color: "#0A1F33" }}>
                {value}
              </span>
              <span style={{ fontSize: 14, color: "#64748D" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
