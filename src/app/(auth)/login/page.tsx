import type { Metadata } from "next";
import { LoginForm } from "@/features/brigada/auth-forms";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="w-full max-w-md rounded-card border border-linea bg-white p-8 shadow-z3 sm:p-10">
      <h1 className="display text-3xl text-navy">
        Portal de brigadistas
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Acceso exclusivo para los estudiantes de la Brigada Ambiental —
        Economía Política 2, secciones A y B.
      </p>
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
