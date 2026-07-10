"use client";

import { useActionState } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { createActivity } from "./activity-actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: ActionState = { status: "idle" };

export function CreateActivityForm() {
  const [state, formAction, pending] = useActionState(createActivity, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Turno de vigilancia UV — pabellón A" required />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="description">
          Descripción <span className="font-normal text-muted">(opcional)</span>
        </Label>
        <Input id="description" name="description" placeholder="Detalle de la actividad" />
      </div>
      <div>
        <Label htmlFor="startsAt">Inicio</Label>
        <Input id="startsAt" name="startsAt" type="datetime-local" />
      </div>
      <div>
        <Label htmlFor="endsAt">Fin</Label>
        <Input id="endsAt" name="endsAt" type="datetime-local" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="location">
          Lugar <span className="font-normal text-muted">(opcional)</span>
        </Label>
        <Input id="location" name="location" placeholder="Pabellón de Economía" />
      </div>

      {state.status === "error" && (
        <div className="flex items-start gap-2 rounded-card border border-[#fecaca] bg-[#fee2e2] p-3 text-sm text-[#991b1b] sm:col-span-2">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div className="flex items-start gap-2 rounded-card border border-[#a7f3d0] bg-[#d1fae5] p-3 text-sm text-[#065f46] sm:col-span-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Crear actividad
        </Button>
      </div>
    </form>
  );
}
