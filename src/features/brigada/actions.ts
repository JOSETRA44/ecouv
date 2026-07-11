"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export interface AuthState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const signUpSchema = z.object({
  fullName: z.string().trim().min(3, "Ingresa tu nombre completo.").max(120),
  cui: z
    .string()
    .trim()
    .regex(/^\d{8,10}$/, "Ingresa tu CUI (8 a 10 dígitos).")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email("Ingresa un correo válido."),
  password: z.string().min(8, "Mínimo 8 caracteres."),
  inviteCode: z.string().trim().min(1, "Ingresa el código de tu sección."),
});

const signInSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

function collectErrors(issues: z.ZodError["issues"]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

async function requireTurnstile(formData: FormData): Promise<AuthState | null> {
  const headerList = await headers();
  const remoteIp = headerList.get("cf-connecting-ip") ?? headerList.get("x-forwarded-for") ?? undefined;
  const ok = await verifyTurnstileToken(formData.get("cf-turnstile-response"), remoteIp);
  if (!ok) {
    return {
      status: "error",
      message: "No pudimos verificar que eres una persona. Recarga la página e inténtalo de nuevo.",
    };
  }
  return null;
}

export async function signUpBrigadista(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    cui: formData.get("cui"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: collectErrors(parsed.error.issues),
    };
  }

  const turnstileError = await requireTurnstile(formData);
  if (turnstileError) return turnstileError;

  const service = createServiceClient();
  if (!service) {
    return {
      status: "error",
      message:
        "El registro no está disponible: falta configurar la clave del servidor (SUPABASE_SECRET_KEY).",
    };
  }

  const { data: invite } = await service
    .from("invite_codes")
    .select("section")
    .eq("code", parsed.data.inviteCode.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (!invite) {
    return {
      status: "error",
      fieldErrors: { inviteCode: "Código de invitación inválido o inactivo." },
      message: "Revisa el código entregado por el docente coordinador.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        cui: parsed.data.cui || null,
        section: invite.section,
      },
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        status: "error",
        fieldErrors: { email: "Este correo ya tiene una cuenta." },
        message: "Inicia sesión con tu cuenta existente.",
      };
    }
    return { status: "error", message: error.message };
  }

  if (data.session) redirect("/brigada");

  return {
    status: "success",
    message:
      "Cuenta creada. Revisa tu correo para confirmar tu dirección y luego inicia sesión.",
  };
}

export async function signInBrigadista(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: collectErrors(parsed.error.issues),
    };
  }

  const turnstileError = await requireTurnstile(formData);
  if (turnstileError) return turnstileError;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: "Correo o contraseña incorrectos.",
    };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/brigada");
}

export async function signOutBrigadista() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
