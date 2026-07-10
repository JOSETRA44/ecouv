"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { reviewEvidence } from "./evidence-review-actions";
import type { ActionState } from "./schema";
import { Button } from "@/components/ui/button";

const initialState: ActionState = { status: "idle" };

export function EvidenceReviewButtons({ evidenceId }: { evidenceId: string }) {
  const [approveState, approveAction, approvePending] = useActionState(
    reviewEvidence,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    reviewEvidence,
    initialState,
  );

  if (approveState.status === "success" || rejectState.status === "success") {
    return <p className="text-sm font-medium text-muted">Revisado</p>;
  }

  return (
    <div>
      <div className="flex gap-2">
        <form action={approveAction}>
          <input type="hidden" name="evidenceId" value={evidenceId} />
          <input type="hidden" name="decision" value="approved" />
          <Button type="submit" disabled={approvePending || rejectPending} className="h-9 px-3 text-sm">
            {approvePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Aprobar
          </Button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="evidenceId" value={evidenceId} />
          <input type="hidden" name="decision" value="rejected" />
          <Button
            type="submit"
            variant="secondary"
            disabled={approvePending || rejectPending}
            className="h-9 px-3 text-sm"
          >
            {rejectPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Rechazar
          </Button>
        </form>
      </div>
      {(approveState.status === "error" || rejectState.status === "error") && (
        <p className="mt-1.5 text-xs text-uv-veryhigh">
          {approveState.message || rejectState.message}
        </p>
      )}
    </div>
  );
}
