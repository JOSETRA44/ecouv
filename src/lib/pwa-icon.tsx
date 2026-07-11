export function sunIcon({
  canvas,
  radius,
  iconRatio,
}: {
  canvas: number;
  radius: number;
  iconRatio: number;
}) {
  const s = Math.round(canvas * iconRatio);
  return (
    <div
      style={{
        width: canvas,
        height: canvas,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#5E151D",
        borderRadius: radius,
      }}
    >
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
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
  );
}
