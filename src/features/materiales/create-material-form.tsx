"use client";

import { useActionState, useRef } from "react";
import { CheckCircle2, CircleAlert, Loader2, Upload } from "lucide-react";
import { createMaterial } from "./actions";
import { CATEGORY_LABEL } from "./material-card";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";

const initialState: ActionState = { status: "idle" };

export function CreateMaterialForm() {
  const [state, formAction, pending] = useActionState(createMaterial, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Título</Label>
        <input
          id="title"
          name="title"
          placeholder="Guía de fotoprotección para el campus"
          required
          className="h-11 w-full rounded-btn border border-linea bg-white px-4 text-[15px] text-navy placeholder:text-muted/70 focus:border-granate-600 focus:outline-none focus:ring-[3px] focus:ring-granate-600/10"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          maxLength={600}
          placeholder="De qué trata el material y para quién es útil."
          className="w-full rounded-btn border border-linea bg-white px-4 py-2.5 text-[15px] text-navy placeholder:text-muted/70 focus:border-granate-600 focus:outline-none focus:ring-[3px] focus:ring-granate-600/10"
        />
      </div>

      <div>
        <Label htmlFor="category">
          Categoría <span className="font-normal text-muted">(opcional)</span>
        </Label>
        <Select id="category" name="category" defaultValue="">
          <option value="">Sin categoría</option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="file">Archivo</Label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx,.xlsx"
          required
          className="block w-full text-sm text-ink file:mr-4 file:rounded-btn file:border-0 file:bg-granate-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-granate-700 hover:file:bg-granate-100"
        />
        <p className="mt-1.5 text-xs text-muted">
          PDF, imagen, Word, PowerPoint o Excel · hasta 25 MB.
        </p>
      </div>

      {state.status === "error" && (
        <div className="flex items-start gap-2 rounded-card border border-[#fecaca] bg-[#fee2e2] p-3 text-sm text-[#991b1b]">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div className="flex items-start gap-2 rounded-card border border-[#a7f3d0] bg-[#d1fae5] p-3 text-sm text-[#065f46]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Publicando…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Publicar material
          </>
        )}
      </Button>
    </form>
  );
}
