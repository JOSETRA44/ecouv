"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB — igual al límite del bucket

export interface EvidenceUploadState {
  status: "idle" | "success" | "error";
  message?: string;
}

const captionSchema = z.string().trim().max(280).optional().or(z.literal(""));

export async function uploadEvidence(
  _prev: EvidenceUploadState,
  formData: FormData,
): Promise<EvidenceUploadState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Debes iniciar sesión." };
  }

  // Defensa en profundidad: revalida el estado propio antes de intentar subir
  // (la RLS del bucket es el límite real, esto solo da un mensaje claro).
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.status !== "active") {
    return {
      status: "error",
      message: "Solo brigadistas activos pueden subir evidencias.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona una foto para subir." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      status: "error",
      message: "Formato no permitido. Usa JPG, PNG o WEBP.",
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { status: "error", message: "La imagen supera los 8 MB." };
  }

  const captionParsed = captionSchema.safeParse(formData.get("caption"));
  if (!captionParsed.success) {
    return { status: "error", message: "El texto de la foto es muy largo." };
  }

  const activityIdRaw = formData.get("activityId");
  const activityId =
    typeof activityIdRaw === "string" && activityIdRaw.length > 0
      ? activityIdRaw
      : null;

  const extension = file.name.split(".").pop()?.toLowerCase().slice(0, 5) ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("evidence")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return {
      status: "error",
      message: "No pudimos subir la imagen. Inténtalo de nuevo.",
    };
  }

  const { error: insertError } = await supabase.from("evidence").insert({
    profile_id: user.id,
    activity_id: activityId,
    storage_path: path,
    caption: captionParsed.data || null,
    taken_at: new Date().toISOString(),
  });

  if (insertError) {
    return {
      status: "error",
      message: "La imagen se subió pero no pudimos registrarla. Contacta al coordinador.",
    };
  }

  revalidatePath("/brigada");
  return { status: "success", message: "Evidencia enviada para revisión." };
}
