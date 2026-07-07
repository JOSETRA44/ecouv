"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "/#proyecto", label: "El proyecto" },
  { href: "/#normativa", label: "Normativa" },
  { href: "/#coordinacion", label: "Coordinación" },
  { href: "/foro", label: "Foro 2026" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo-unsa.svg"
            alt="Universidad Nacional de San Agustín de Arequipa"
            width={36}
            height={36}
            unoptimized
            priority
          />
          <Image
            src="/brand/logo-fec.svg"
            alt="Facultad de Economía"
            width={36}
            height={36}
            unoptimized
            priority
          />
          <span className="hidden h-6 w-px bg-linea sm:block" aria-hidden />
          <span className="leading-tight">
            <span className="block text-[14px] font-medium tracking-tight text-navy">
              Brigada Ambiental
            </span>
            <span className="microlabel block text-[9px] text-faint">
              Facultad de Economía · UNSA
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
              className="block border-b border-neutro py-3 text-[15px] text-ink"
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
