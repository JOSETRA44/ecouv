"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sun } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "/#proyecto", label: "El proyecto" },
  { href: "/#normativa", label: "Normativa" },
  { href: "/#actividades", label: "Actividades" },
  { href: "/foro", label: "Foro 2026" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-guinda-600 text-white shadow-z1">
            <Sun className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="leading-none">
            <span className="display block text-[15px] font-bold tracking-tight text-navy">
              BRIGADA AMBIENTAL
            </span>
            <span className="block text-[11px] font-medium tracking-[0.14em] text-muted">
              FACULTAD DE ECONOMÍA · UNSA
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-under text-sm text-ink transition-colors hover:text-guinda-600"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="/login" variant="secondary" className="h-9 px-4 text-sm">
            Portal de brigadistas
          </ButtonLink>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-btn text-navy md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-linea bg-white px-4 pb-5 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-superficie py-3 text-[15px] text-ink"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink
            href="/login"
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            Portal de brigadistas
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
