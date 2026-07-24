"use client";

import { useActionState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteMaterial } from "./actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function MaterialDeleteButton({ materialId }: { materialId: string }) {
  const [state, formAction, pending] = useActionState(deleteMaterial, initialState);

  if (state.status === "success") {
    return <span className="text-sm font-medium text-muted">Eliminado</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <form action={formAction}>
        <input type="hidden" name="id" value={materialId} />
        <Button
          type="submit"
          variant="secondary"
          disabled={pending}
          className="h-9 px-3 text-sm"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Eliminar
        </Button>
      </form>
      {state.status === "error" && (
        <p className="text-xs text-uv-veryhigh">{state.message}</p>
      )}
    </div>
  );
}
