"use client";

import { useActionState } from "react";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { assignBrigadista } from "./activity-actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import type { Activity, Profile } from "@/lib/supabase/types";

const initialState: ActionState = { status: "idle" };

interface AssignFormProps {
  activities: Pick<Activity, "id" | "title">[];
  members: Pick<Profile, "id" | "full_name" | "section">[];
}

export function AssignForm({ activities, members }: AssignFormProps) {
  const [state, formAction, pending] = useActionState(assignBrigadista, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-3">
      <div>
        <Label htmlFor="activityId">Actividad</Label>
        <Select id="activityId" name="activityId" required defaultValue="">
          <option value="" disabled>
            Selecciona…
          </option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="profileId">Brigadista</Label>
        <Select id="profileId" name="profileId" required defaultValue="">
          <option value="" disabled>
            Selecciona…
          </option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name} {m.section ? `— Sección ${m.section}` : ""}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="duty">
          Rol <span className="font-normal text-muted">(opcional)</span>
        </Label>
        <Input id="duty" name="duty" placeholder="Punto informativo" />
      </div>

      {state.status === "error" && (
        <div className="flex items-start gap-2 rounded-card border border-[#fecaca] bg-[#fee2e2] p-3 text-sm text-[#991b1b] sm:col-span-3">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div className="flex items-start gap-2 rounded-card border border-[#a7f3d0] bg-[#d1fae5] p-3 text-sm text-[#065f46] sm:col-span-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {state.message}
        </div>
      )}

      <div className="sm:col-span-3">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Asignar
        </Button>
      </div>
    </form>
  );
}
