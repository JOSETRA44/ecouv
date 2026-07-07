import type { Metadata } from "next";
import { SignUpForm } from "@/features/brigada/auth-forms";

export const metadata: Metadata = { title: "Registro de brigadistas" };

export default function RegistroPage() {
  return (
    <div className="w-full max-w-md rounded-card border border-linea bg-white p-8 shadow-z3 sm:p-10">
      <h1 className="display text-3xl font-bold text-navy">
        Únete a la brigada
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Necesitas el código de tu sección (lo entrega el docente coordinador).
        Tu cuenta queda pendiente hasta su aprobación.
      </p>
      <div className="mt-8">
        <SignUpForm />
      </div>
    </div>
  );
}
