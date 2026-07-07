import { z } from "zod";

export const FORUM_SLUG = "foro-ambiental-2026";

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Ingresa tu nombre completo.")
    .max(120, "Máximo 120 caracteres."),
  email: z.string().trim().email("Ingresa un correo válido."),
  affiliation: z.enum(["interno", "externo"], {
    message: "Selecciona tu afiliación.",
  }),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  // Honeypot anti-bots: debe llegar vacío.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export interface RegistrationState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof RegistrationInput, string>>;
}
