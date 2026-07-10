import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().trim().min(3, "Ingresa un título.").max(160),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  activityType: z.string().trim().min(2).max(60).default("turno"),
  startsAt: z.string().trim().optional().or(z.literal("")),
  endsAt: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
});

export const assignmentSchema = z.object({
  activityId: z.string().uuid("Selecciona una actividad."),
  profileId: z.string().uuid("Selecciona un brigadista."),
  duty: z.string().trim().max(120).optional().or(z.literal("")),
});

export const attendanceSchema = z.object({
  activityId: z.string().uuid(),
  profileId: z.string().uuid(),
});

export const memberDecisionSchema = z.object({
  profileId: z.string().uuid(),
});

export const evidenceReviewSchema = z.object({
  evidenceId: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
});

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}
