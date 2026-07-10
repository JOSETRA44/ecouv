"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { markAttendance } from "./attendance-actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function AttendanceMarkButton({
  activityId,
  profileId,
}: {
  activityId: string;
  profileId: string;
}) {
  const [state, action, pending] = useActionState(markAttendance, initialState);

  if (state.status === "success") {
    return <span className="text-sm font-medium text-uv-low">Registrado</span>;
  }

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="activityId" value={activityId} />
      <input type="hidden" name="profileId" value={profileId} />
      <Button type="submit" disabled={pending} className="h-9 px-3 text-sm">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Marcar presente
      </Button>
      {state.status === "error" && (
        <p className="text-xs text-uv-veryhigh">{state.message}</p>
      )}
    </form>
  );
}
