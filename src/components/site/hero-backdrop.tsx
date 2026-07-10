/**
 * Fondo vectorial a medida — "El plano cartesiano".
 * Dibujo técnico que codifica la identidad del proyecto:
 *  · curvas de indiferencia (rigor económico)
 *  · red de nodos con línea de tendencia (análisis de datos / brigada)
 *  · ticks de eje (precisión académica)
 * Trazos hairline sobre el papel milimetrado; animación de deriva de
 * trazo y pulso de nodos definida en globals.css (respeta reduced-motion).
 * Server component: SVG puro, cero JavaScript en cliente.
 */

const NODES: ReadonlyArray<readonly [number, number]> = [
  [948, 388], [1042, 322], [1120, 356], [1188, 268],
  [1268, 300], [1330, 218], [1398, 244], [1096, 452],
  [1222, 408], [1352, 352],
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6],
  [2, 7], [4, 8], [8, 9], [2, 4], [6, 9],
];

/** Nodos granate (acentos institucionales, con pulso) */
const ACCENT = new Set([1, 4, 9]);

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_115%_100%_at_68%_18%,black_38%,transparent_82%)]"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Familia de curvas de indiferencia ── */}
        <g stroke="#0a1f33" strokeWidth="1">
          <path
            d="M -20 150 C 320 160, 620 230, 860 340 S 1300 610, 1470 660"
            opacity="0.07"
          />
          <path
            d="M -20 90 C 360 100, 700 170, 950 280 S 1360 540, 1470 580"
            opacity="0.055"
          />
          <path
            className="iso-drift"
            d="M -20 220 C 300 235, 580 300, 800 410 S 1240 660, 1470 705"
            opacity="0.09"
            strokeDasharray="5 9"
          />
          <path
            d="M -20 320 C 260 330, 500 390, 690 480 S 1120 700, 1330 740"
            opacity="0.05"
          />
          <path
            className="iso-drift-slow"
            d="M -20 30 C 400 40, 760 110, 1030 220 S 1420 470, 1490 510"
            opacity="0.06"
            strokeDasharray="4 10"
          />
        </g>

        {/* ── Línea de tendencia (regresión) ── */}
        <path
          className="iso-drift-slow"
          d="M 920 470 L 1430 200"
          stroke="#5e151d"
          strokeWidth="1"
          strokeDasharray="3 7"
          opacity="0.16"
        />

        {/* ── Red de datos: aristas (Comentado a petición de diseño para mayor limpieza visual) ── */}
        {/*
        <g stroke="#0a1f33" strokeWidth="0.8" opacity="0.09">
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
            />
          ))}
        </g>
        */}

        {/* ── Red de datos: nodos (Comentado a petición de diseño) ── */}
        {/*
        <g>
          {NODES.map(([x, y], i) =>
            ACCENT.has(i) ? (
              <g key={i}>
                <circle
                  className="node-pulse"
                  cx={x}
                  cy={y}
                  r="7"
                  fill="#5e151d"
                  opacity="0.1"
                  style={{ animationDelay: `${i * 1.4}s` }}
                />
                <circle cx={x} cy={y} r="2.5" fill="#5e151d" opacity="0.3" />
              </g>
            ) : (
              <circle key={i} cx={x} cy={y} r="2" fill="#0a1f33" opacity="0.14" />
            ),
          )}
        </g>
        */}

        {/* ── Puntos de datos dispersos (scatter) - Comentado por limpieza visual ── */}
        {/*
        <g fill="#0a1f33" opacity="0.1">
          {[
            [1010, 250], [1160, 190], [1290, 158], [980, 320],
            [1240, 240], [1390, 300], [1060, 400],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x - 3} ${y} H ${x + 3} M ${x} ${y - 3} V ${y + 3}`}
              stroke="#0a1f33"
              strokeWidth="0.9"
            />
          ))}
        </g>
        */}

        {/* ── Ticks de eje (borde inferior izquierdo) ── */}
        <g stroke="#0a1f33" strokeWidth="1" opacity="0.12">
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1={72 + i * 48}
              y1={664}
              x2={72 + i * 48}
              y2={i % 4 === 0 ? 654 : 658}
            />
          ))}
          <line x1="66" y1="664" x2="462" y2="664" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}
