export interface UvLevel {
  label: string;
  /** Token de color del design system (escala OMS) */
  colorClass: string;
  bgClass: string;
  advice: string;
}

/** Clasificación del índice UV según la escala de la OMS. */
export function uvLevel(index: number): UvLevel {
  if (index < 3)
    return {
      label: "Bajo",
      colorClass: "text-uv-low",
      bgClass: "bg-uv-low",
      advice: "Riesgo mínimo. Puedes circular con normalidad.",
    };
  if (index < 6)
    return {
      label: "Moderado",
      colorClass: "text-uv-moderate",
      bgClass: "bg-uv-moderate",
      advice: "Usa bloqueador y busca sombra al mediodía.",
    };
  if (index < 8)
    return {
      label: "Alto",
      colorClass: "text-uv-high",
      bgClass: "bg-uv-high",
      advice: "Sombrero de ala ancha, bloqueador y sombra: obligatorios.",
    };
  if (index < 11)
    return {
      label: "Muy alto",
      colorClass: "text-uv-veryhigh",
      bgClass: "bg-uv-veryhigh",
      advice: "Evita exponerte entre 10:00 y 15:00. Protección completa.",
    };
  return {
    label: "Extremo",
    colorClass: "text-uv-extreme",
    bgClass: "bg-uv-extreme",
    advice: "Permanece bajo techo en las horas críticas. Riesgo severo.",
  };
}

export interface UvPayload {
  uvIndex: number;
  todayMax: number;
  takenAt: string;
  source: "open-meteo" | "cache";
}
