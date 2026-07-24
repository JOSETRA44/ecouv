"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // El usuario canceló el share sheet nativo — no es un error real.
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="secondary" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-4 w-4" /> Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" /> Compartir
        </>
      )}
    </Button>
  );
}
