"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { approveMember, rejectMember } from "./member-actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function MemberRowActions({ profileId }: { profileId: string }) {
  const [approveState, approveAction, approvePending] = useActionState(
    approveMember,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    rejectMember,
    initialState,
  );

  if (approveState.status === "success" || rejectState.status === "success") {
    return <span className="text-sm font-medium text-muted">Actualizado</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <form action={approveAction}>
          <input type="hidden" name="profileId" value={profileId} />
          <Button type="submit" disabled={approvePending || rejectPending} className="h-9 px-3 text-sm">
            {approvePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Aprobar
          </Button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="profileId" value={profileId} />
          <Button
            type="submit"
            variant="secondary"
            disabled={approvePending || rejectPending}
            className="h-9 px-3 text-sm"
          >
            {rejectPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Rechazar
          </Button>
        </form>
      </div>
      {(approveState.status === "error" || rejectState.status === "error") && (
        <p className="text-xs text-uv-veryhigh">
          {approveState.message || rejectState.message}
        </p>
      )}
    </div>
  );
}
