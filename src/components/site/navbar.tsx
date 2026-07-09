"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { href: "/#proyecto", label: "El proyecto" },
  { href: "/#normativa", label: "Normativa" },
  { href: "/#coordinacion", label: "Coordinación" },
  { href: "/foro", label: "Foro 2026" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "border-b border-linea/70 bg-white/80 shadow-[0_1px_12px_rgb(10_31_51/0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/60 backdrop-blur-md"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-500 ease-out sm:px-6 lg:px-8 ${
          scrolled ? "h-14" : "h-[72px]"
        }`}
      >
        {/* ─── Brand ─── */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <div
              className={`flex items-center justify-center rounded-lg transition-all duration-500 ${
                scrolled
                  ? "h-8 w-8"
                  : "h-9 w-9"
              }`}
            >
              <Image
                src="/brand/logo-unsa.svg"
                alt="Universidad Nacional de San Agustín de Arequipa"
                width={36}
                height={36}
                unoptimized
                priority
                className="h-full w-full object-contain transition-all duration-500"
              />
            </div>
            <div
              className={`flex items-center justify-center rounded-lg transition-all duration-500 ${
                scrolled
                  ? "h-8 w-8"
                  : "h-9 w-9"
              }`}
            >
              <Image
                src="/brand/logo-fec.svg"
                alt="Facultad de Economía"
                width={36}
                height={36}
                unoptimized
                priority
                className="h-full w-full object-contain transition-all duration-500"
              />
            </div>
          </div>

          {/* Separator */}
          <span
            className={`hidden w-px bg-gradient-to-b from-transparent via-linea-strong to-transparent transition-all duration-500 sm:block ${
              scrolled ? "h-5" : "h-6"
            }`}
            aria-hidden
          />

          {/* Text brand */}
          <span className="hidden leading-none sm:block">
            <span
              className={`block font-semibold tracking-tight text-navy transition-all duration-500 group-hover:text-guinda-700 ${
                scrolled ? "text-[13px]" : "text-[14px]"
              }`}
            >
              Brigada Ambiental
            </span>
            <span
              className={`mt-0.5 block font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-faint transition-all duration-500 ${
                scrolled ? "opacity-0 max-h-0" : "opacity-100 max-h-4"
              }`}
            >
              Facultad de Economía · UNSA
            </span>
          </span>
        </Link>

        {/* ─── Desktop nav ─── */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link relative px-3.5 py-2 text-[13.5px] font-medium text-ink/80 transition-colors duration-200 hover:text-navy"
            >
              {l.label}
              {/* Animated underline */}
              <span
                className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] origin-left scale-x-0 rounded-full bg-guinda-600 transition-transform duration-300 ease-out group-hover:scale-x-100"
                aria-hidden
                style={{}}
              />
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/login"
            className={`group/cta relative ml-3 inline-flex items-center gap-2 overflow-hidden rounded-full border border-guinda-600/20 bg-guinda-600 px-5 text-[13px] font-semibold text-white shadow-[0_1px_6px_rgb(139_0_74/0.2)] transition-all duration-300 hover:border-guinda-500/40 hover:bg-guinda-500 hover:shadow-[0_2px_16px_rgb(139_0_74/0.3)] active:scale-[0.97] ${
              scrolled ? "h-8" : "h-9"
            }`}
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
            <span className="relative">Portal brigadistas</span>
            <ArrowRight className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </Link>
        </div>

        {/* ─── Mobile hamburger ─── */}
        <motion.button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-neutro md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.3, ease: "easeOut" },
            }}
            className="overflow-hidden border-t border-linea/60 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="px-4 pb-6 pt-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    delay: 0.06 * i,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group/ml flex items-center justify-between border-b border-neutro py-3.5 text-[15px] font-medium text-navy transition-colors hover:text-guinda-600"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="h-4 w-4 text-faint transition-all duration-200 group-hover/ml:translate-x-1 group-hover/ml:text-guinda-600" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.25, duration: 0.35, ease: "easeOut" }}
              >
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-guinda-600 text-[15px] font-semibold text-white shadow-z1 transition-all duration-200 active:scale-[0.98]"
                >
                  Portal de brigadistas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
