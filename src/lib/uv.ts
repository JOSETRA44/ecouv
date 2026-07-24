export interface UvLevel {
  label: string;
  /** Tokens del design system (escala OMS) */
  colorClass: string;
  bgClass: string;
  /** Chip tintado: fondo suave + texto del nivel */
  chipClass: string;
  advice: string;
}

/** Clasificación del índice UV según la escala de la OMS. */
export function uvLevel(index: number): UvLevel {
  if (index < 3)
    return {
      label: "Bajo",
      colorClass: "text-uv-low",
      bgClass: "bg-uv-low",
      chipClass: "border-uv-low/25 bg-uv-low/8 text-uv-low",
      advice: "Riesgo mínimo. Puedes circular con normalidad.",
    };
  if (index < 6)
    return {
      label: "Moderado",
      colorClass: "text-uv-moderate",
      bgClass: "bg-uv-moderate",
      chipClass: "border-uv-moderate/25 bg-uv-moderate/8 text-uv-moderate",
      advice: "Usa bloqueador y busca sombra al mediodía.",
    };
  if (index < 8)
    return {
      label: "Alto",
      colorClass: "text-uv-high",
      bgClass: "bg-uv-high",
      chipClass: "border-uv-high/25 bg-uv-high/8 text-uv-high",
      advice: "Sombrero de ala ancha, bloqueador y sombra: obligatorios.",
    };
  if (index < 11)
    return {
      label: "Muy alto",
      colorClass: "text-uv-veryhigh",
      bgClass: "bg-uv-veryhigh",
      chipClass: "border-uv-veryhigh/25 bg-uv-veryhigh/8 text-uv-veryhigh",
      advice: "Evita exponerte entre 10:00 y 15:00. Protección completa.",
    };
  return {
    label: "Extremo",
    colorClass: "text-uv-extreme",
    bgClass: "bg-uv-extreme",
    chipClass: "border-uv-extreme/25 bg-uv-extreme/8 text-uv-extreme",
    advice: "Permanece bajo techo en las horas críticas. Riesgo severo.",
  };
}

export interface UvPayload {
  uvIndex: number;
  todayMax: number | null;
  takenAt: string;
  stale: boolean;
  source: "supabase";
}
