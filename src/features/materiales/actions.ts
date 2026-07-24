"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireCoordinator } from "@/features/coordinacion/guard";
import { createMaterialSchema, slugify, type ActionState } from "./schema";

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const ALLOWED_MIME_TYPES = Object.keys(EXTENSION_BY_MIME);
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB — igual al límite del bucket

export async function createMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const parsed = createMaterialSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: "Revisa el título y la descripción." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona un archivo para subir." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      status: "error",
      message: "Formato no permitido. Usa PDF, imagen, Word, PowerPoint o Excel.",
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { status: "error", message: "El archivo supera los 25 MB." };
  }

  const slug = slugify(parsed.data.title);
  const extension = EXTENSION_BY_MIME[file.type] ?? "bin";
  const path = `${crypto.randomUUID()}-${slug}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("materials")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { status: "error", message: "No pudimos subir el archivo. Inténtalo de nuevo." };
  }

  const { error: insertError } = await supabase.from("materials").insert({
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category ?? null,
    storage_path: path,
    mime_type: file.type,
    file_size_bytes: file.size,
    uploaded_by: guard.userId,
  });

  if (insertError) {
    return {
      status: "error",
      message: "El archivo se subió pero no pudimos registrarlo. Contacta a soporte.",
    };
  }

  revalidatePath("/materiales");
  revalidatePath("/");
  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Material publicado." };
}

export async function deleteMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const guard = await requireCoordinator(supabase);
  if ("error" in guard) return { status: "error", message: guard.error };

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { status: "error", message: "Material inválido." };
  }

  const { data: material } = await supabase
    .from("materials")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error: deleteError } = await supabase.from("materials").delete().eq("id", id);
  if (deleteError) {
    return { status: "error", message: "No se pudo eliminar el material." };
  }

  if (material?.storage_path) {
    await supabase.storage.from("materials").remove([material.storage_path]);
  }

  revalidatePath("/materiales");
  revalidatePath("/");
  revalidatePath("/brigada/coordinacion");
  return { status: "success", message: "Material eliminado." };
}
