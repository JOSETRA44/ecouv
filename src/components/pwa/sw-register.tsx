"use client";

import { useEffect } from "react";

/**
 * Registra el service worker sólo en producción.
 *
 * En desarrollo NO debe registrarse: `sw.js` cachea `/_next/static/*` con
 * estrategia cache-first sin revalidar. En producción eso es correcto porque
 * Next.js pone un content-hash en el nombre de cada chunk (URL nueva por
 * build → cache miss → descarga fresca), pero Turbopack en dev sirve los
 * chunks en URLs estables cuyo contenido cambia en cada edición. Cache-first
 * congela entonces la primera versión que vio el navegador, mientras que las
 * navegaciones (network-first) sí traen HTML nuevo. Ese desajuste —HTML nuevo
 * + JS viejo— es lo que provoca el "Hydration failed": el mismo componente
 * renderizado por dos versiones distintas del código.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      /* Limpia cualquier SW instalado por una sesión de dev anterior: sin esto
         el que ya está registrado seguiría sirviendo chunks obsoletos. */
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
        .then(() => caches?.keys())
        .then((keys) => Promise.all((keys ?? []).map((k) => caches.delete(k))))
        .catch(() => {});
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
