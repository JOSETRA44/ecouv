"use client";

import { useActionState } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { registerForForum } from "./actions";
import type { RegistrationState } from "./schema";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: RegistrationState = { status: "idle" };

export function RegistrationForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(
    registerForForum,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-card border border-[#a7f3d0] bg-[#d1fae5] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#065f46]" />
        <h3 className="mt-4 text-lg font-semibold text-[#065f46]">
          {state.message}
        </h3>
        <p className="mt-2 text-sm text-[#047857]">
          Guarda este correo como constancia. La asistencia se registra en la
          entrada del auditorio.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <div className="space-y-5">
        <div>
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Nombres y apellidos"
            disabled={disabled || pending}
            required
          />
          <FieldError>{state.fieldErrors?.fullName}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@unsa.edu.pe"
            disabled={disabled || pending}
            required
          />
          <FieldError>{state.fieldErrors?.email}</FieldError>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="affiliation">Afiliación</Label>
            <Select
              id="affiliation"
              name="affiliation"
              defaultValue="interno"
              disabled={disabled || pending}
            >
              <option value="interno">Comunidad UNSA</option>
              <option value="externo">Institución externa</option>
            </Select>
            <FieldError>{state.fieldErrors?.affiliation}</FieldError>
          </div>
          <div>
            <Label htmlFor="organization">
              Institución <span className="font-normal text-muted">(opcional)</span>
            </Label>
            <Input
              id="organization"
              name="organization"
              placeholder="Escuela, empresa u ONG"
              disabled={disabled || pending}
            />
          </div>
        </div>

        {/* Honeypot: invisible para humanos */}
        <div className="absolute -left-[9999px]" aria-hidden>
          <label htmlFor="website">No completar</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <TurnstileWidget />

        {state.status === "error" && !state.fieldErrors && (
          <div className="flex items-start gap-3 rounded-card border border-[#fecaca] bg-[#fee2e2] p-4 text-sm text-[#991b1b]">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {state.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={disabled || pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Registrando…
            </>
          ) : disabled ? (
            "Aforo completo"
          ) : (
            "Reservar mi vacante"
          )}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted">
          Tus datos se usan únicamente para la gestión del aforo y la
          constancia de participación del proyecto RSU.
        </p>
      </div>
    </form>
  );
}
