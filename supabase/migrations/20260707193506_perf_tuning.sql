-- Índices para claves foráneas sin cobertura
create index idx_activities_created_by on public.activities (created_by);
create index idx_activity_assignments_profile on public.activity_assignments (profile_id);
create index idx_attendance_profile on public.attendance (profile_id);
create index idx_attendance_checked_by on public.attendance (checked_by);
create index idx_evidence_activity on public.evidence (activity_id);
create index idx_evidence_profile on public.evidence (profile_id);
create index idx_forum_registrations_event on public.forum_registrations (event_id);

-- Consolidar políticas permisivas duplicadas (una por comando)
drop policy "active members read activities" on public.activities;
drop policy "coordinator manages activities" on public.activities;
create policy "members and coordinator read activities"
on public.activities for select to authenticated
using (private.is_active_member() or private.is_coordinator());
create policy "coordinator inserts activities"
on public.activities for insert to authenticated
with check (private.is_coordinator());
create policy "coordinator updates activities"
on public.activities for update to authenticated
using (private.is_coordinator()) with check (private.is_coordinator());
create policy "coordinator deletes activities"
on public.activities for delete to authenticated
using (private.is_coordinator());

drop policy "members read own assignments" on public.activity_assignments;
drop policy "coordinator manages assignments" on public.activity_assignments;
create policy "own or coordinator reads assignments"
on public.activity_assignments for select to authenticated
using (profile_id = (select auth.uid()) or private.is_coordinator());
create policy "coordinator inserts assignments"
on public.activity_assignments for insert to authenticated
with check (private.is_coordinator());
create policy "coordinator updates assignments"
on public.activity_assignments for update to authenticated
using (private.is_coordinator()) with check (private.is_coordinator());
create policy "coordinator deletes assignments"
on public.activity_assignments for delete to authenticated
using (private.is_coordinator());

drop policy "members read own attendance" on public.attendance;
drop policy "coordinator manages attendance" on public.attendance;
create policy "own or coordinator reads attendance"
on public.attendance for select to authenticated
using (profile_id = (select auth.uid()) or private.is_coordinator());
create policy "coordinator inserts attendance"
on public.attendance for insert to authenticated
with check (private.is_coordinator());
create policy "coordinator updates attendance"
on public.attendance for update to authenticated
using (private.is_coordinator()) with check (private.is_coordinator());
create policy "coordinator deletes attendance"
on public.attendance for delete to authenticated
using (private.is_coordinator());
