"use client";

import { useActionState, useRef } from "react";
import { CheckCircle2, CircleAlert, Loader2, Upload } from "lucide-react";
import { uploadEvidence, type EvidenceUploadState } from "./evidence-actions";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import type { Activity } from "@/lib/supabase/types";

const initialState: EvidenceUploadState = { status: "idle" };

export function EvidenceUploadForm({ activities }: { activities: Pick<Activity, "id" | "title">[] }) {
  const [state, formAction, pending] = useActionState(uploadEvidence, initialState);
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
        <Label htmlFor="file">Foto de la intervención</Label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="block w-full text-sm text-ink file:mr-4 file:rounded-btn file:border-0 file:bg-granate-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-granate-700 hover:file:bg-granate-100"
        />
      </div>

      {activities.length > 0 && (
        <div>
          <Label htmlFor="activityId">
            Actividad <span className="font-normal text-muted">(opcional)</span>
          </Label>
          <Select id="activityId" name="activityId" defaultValue="">
            <option value="">Sin actividad asociada</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="caption">
          Descripción <span className="font-normal text-muted">(opcional)</span>
        </Label>
        <input
          id="caption"
          name="caption"
          maxLength={280}
          placeholder="Ej. Punto informativo — pabellón de Economía"
          className="h-11 w-full rounded-btn border border-linea bg-white px-4 text-[15px] text-navy placeholder:text-muted/70 focus:border-granate-600 focus:outline-none focus:ring-[3px] focus:ring-granate-600/10"
        />
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
            <Loader2 className="h-4 w-4 animate-spin" /> Subiendo…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Subir evidencia
          </>
        )}
      </Button>
    </form>
  );
}
