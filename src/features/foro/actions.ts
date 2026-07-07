"use server";

import { createClient } from "@/lib/supabase/server";
import { FORUM_SLUG, registrationSchema, type RegistrationState } from "./schema";

export async function registerForForum(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const parsed = registrationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    affiliation: formData.get("affiliation"),
    organization: formData.get("organization"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const fieldErrors: RegistrationState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  // Honeypot con contenido → respuesta de éxito falsa para el bot.
  if (parsed.data.website) {
    return { status: "success", message: "¡Inscripción registrada!" };
  }

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("forum_events")
    .select("id, is_open")
    .eq("slug", FORUM_SLUG)
    .maybeSingle();

  if (!event) {
    return { status: "error", message: "El evento no está disponible." };
  }

  const { error } = await supabase.from("forum_registrations").insert({
    event_id: event.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    affiliation: parsed.data.affiliation,
    organization: parsed.data.organization || null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "Este correo ya cuenta con una vacante reservada.",
      };
    }
    if (error.message.includes("AFORO_COMPLETO")) {
      return {
        status: "error",
        message:
          "El aforo de 130 vacantes se ha completado. ¡Gracias por tu interés!",
      };
    }
    if (
      error.message.includes("INSCRIPCIONES_CERRADAS") ||
      error.message.includes("row-level security")
    ) {
      return {
        status: "error",
        message: "Las inscripciones están cerradas por el momento.",
      };
    }
    return {
      status: "error",
      message: "No pudimos registrar tu inscripción. Inténtalo de nuevo.",
    };
  }

  return {
    status: "success",
    message:
      "¡Vacante reservada! Te esperamos en el Foro Ambiental y de Salud 2026.",
  };
}
