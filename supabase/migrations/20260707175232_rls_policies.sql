-- RLS para todas las tablas expuestas
alter table public.profiles enable row level security;
alter table public.invite_codes enable row level security;
alter table public.forum_events enable row level security;
alter table public.forum_registrations enable row level security;
alter table public.forum_seat_counts enable row level security;
alter table public.uv_readings enable row level security;
alter table public.activities enable row level security;
alter table public.activity_assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.evidence enable row level security;

-- ===== profiles =====
create policy "own or coordinator can select profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or private.is_coordinator());

create policy "own or coordinator can update profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or private.is_coordinator())
with check ((select auth.uid()) = id or private.is_coordinator());

-- ===== invite_codes: solo coordinador (validación server-side) =====
create policy "coordinator manages invite codes"
on public.invite_codes for all
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

-- ===== forum_events: lectura pública, gestión del coordinador =====
create policy "public can read events"
on public.forum_events for select
to anon, authenticated
using (true);

create policy "coordinator manages events"
on public.forum_events for insert
to authenticated
with check (private.is_coordinator());

create policy "coordinator updates events"
on public.forum_events for update
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "coordinator deletes events"
on public.forum_events for delete
to authenticated
using (private.is_coordinator());

-- ===== forum_registrations: el público SOLO inserta; jamás lee =====
-- NOTA: reemplazada en 20260707175321_security_hardening por un predicado real.
create policy "public can register to forum"
on public.forum_registrations for insert
to anon, authenticated
with check (true); -- aforo y cierre se validan en trigger con lock

create policy "coordinator reads registrations"
on public.forum_registrations for select
to authenticated
using (private.is_coordinator());

create policy "coordinator deletes registrations"
on public.forum_registrations for delete
to authenticated
using (private.is_coordinator());

-- ===== forum_seat_counts: contador sin PII, lectura pública (Realtime) =====
create policy "public can read seat counts"
on public.forum_seat_counts for select
to anon, authenticated
using (true);

-- ===== uv_readings: lectura pública; escritura solo service_role =====
create policy "public can read uv readings"
on public.uv_readings for select
to anon, authenticated
using (true);

-- ===== Etapa 2: miembros activos leen; coordinador gestiona =====
-- NOTA: políticas de activities/assignments/attendance consolidadas en
-- 20260707193506_perf_tuning.
create policy "active members read activities"
on public.activities for select
to authenticated
using (private.is_active_member());

create policy "coordinator manages activities"
on public.activities for all
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "members read own assignments"
on public.activity_assignments for select
to authenticated
using (profile_id = (select auth.uid()) or private.is_coordinator());

create policy "coordinator manages assignments"
on public.activity_assignments for all
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "members read own attendance"
on public.attendance for select
to authenticated
using (profile_id = (select auth.uid()) or private.is_coordinator());

create policy "coordinator manages attendance"
on public.attendance for all
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "members manage own evidence"
on public.evidence for select
to authenticated
using (profile_id = (select auth.uid()) or private.is_coordinator());

create policy "active members insert own evidence"
on public.evidence for insert
to authenticated
with check (profile_id = (select auth.uid()) and private.is_active_member());

create policy "coordinator updates evidence"
on public.evidence for update
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "coordinator deletes evidence"
on public.evidence for delete
to authenticated
using (private.is_coordinator());

-- ===== Realtime para la barra de aforo =====
alter publication supabase_realtime add table public.forum_seat_counts;
