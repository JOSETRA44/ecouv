import { z } from "zod";

export const CATEGORIES = ["infografia", "documento", "guia"] as const;
export type MaterialCategory = (typeof CATEGORIES)[number];

export const createMaterialSchema = z.object({
  title: z.string().trim().min(3, "Ingresa un título.").max(160),
  description: z.string().trim().min(3, "Ingresa una descripción.").max(600),
  category: z.enum(CATEGORIES).optional(),
});

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

const DIACRITICS = /[̀-ͯ]/g;

/** Slug legible y único: título normalizado + sufijo corto aleatorio. */
export function slugify(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const suffix = crypto.randomUUID().slice(0, 6);
  return `${base || "material"}-${suffix}`;
}
