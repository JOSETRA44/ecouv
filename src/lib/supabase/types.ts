/** Alias de conveniencia sobre los tipos generados (`database.types.ts`). */
import type { Tables, Enums } from "./database.types";

export type CourseSection = Enums<"course_section">;
export type UserRole = Enums<"user_role">;
export type MemberStatus = Enums<"member_status">;
export type EvidenceStatus = Enums<"evidence_status">;

export type Profile = Tables<"profiles">;
export type Activity = Tables<"activities">;
export type ActivityAssignment = Tables<"activity_assignments">;
export type Attendance = Tables<"attendance">;
export type Evidence = Tables<"evidence">;
export type Material = Tables<"materials">;
