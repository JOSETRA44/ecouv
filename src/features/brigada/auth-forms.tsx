"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import {
  signInBrigadista,
  signUpBrigadista,
  type AuthState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: AuthState = { status: "idle" };

function StatusBanner({ state }: { state: AuthState }) {
  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-card border border-[#a7f3d0] bg-[#d1fae5] p-4 text-sm text-[#065f46]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        {state.message}
      </div>
    );
  }
  if (state.status === "error" && state.message) {
    return (
      <div className="flex items-start gap-3 rounded-card border border-[#fecaca] bg-[#fee2e2] p-4 text-sm text-[#991b1b]">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        {state.message}
      </div>
    );
  }
  return null;
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    signInBrigadista,
    initialState,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError>{state.fieldErrors?.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError>{state.fieldErrors?.password}</FieldError>
      </div>

      <TurnstileWidget />

      <StatusBanner state={state} />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Ingresando…
          </>
        ) : (
          "Ingresar al portal"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-granate-600 hover:underline">
          Regístrate como brigadista
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpBrigadista,
    initialState,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input id="fullName" name="fullName" autoComplete="name" required />
        <FieldError>{state.fieldErrors?.fullName}</FieldError>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="cui">
            CUI <span className="font-normal text-muted">(opcional)</span>
          </Label>
          <Input id="cui" name="cui" inputMode="numeric" placeholder="20260000" />
          <FieldError>{state.fieldErrors?.cui}</FieldError>
        </div>
        <div>
          <Label htmlFor="inviteCode">Código de sección</Label>
          <Input
            id="inviteCode"
            name="inviteCode"
            placeholder="BRIGADA-A-2026"
            className="uppercase"
            required
          />
          <FieldError>{state.fieldErrors?.inviteCode}</FieldError>
        </div>
      </div>
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@unsa.edu.pe"
          required
        />
        <FieldError>{state.fieldErrors?.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
        />
        <FieldError>{state.fieldErrors?.password}</FieldError>
      </div>

      <TurnstileWidget />

      <StatusBanner state={state} />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta…
          </>
        ) : (
          "Crear mi cuenta de brigadista"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-granate-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
