-- Plataforma RSU "Brigada Ambiental FEC" — esquema inicial
create extension if not exists citext with schema extensions;

-- Esquema privado para helpers no expuestos por la Data API
create schema if not exists private;

-- ===== Tipos =====
create type public.user_role as enum ('coordinator','brigadista');
create type public.member_status as enum ('pending','active','rejected');
create type public.course_section as enum ('A','B');
create type public.affiliation_type as enum ('interno','externo');

-- ===== Perfiles =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  cui text,
  email extensions.citext not null,
  section public.course_section,
  role public.user_role not null default 'brigadista',
  status public.member_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, cui, section)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'cui',''),
    nullif(new.raw_user_meta_data->>'section','')::public.course_section
  );
  return new;
end
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

-- Solo un coordinador puede cambiar role/status/email de un perfil
create function private.is_coordinator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'coordinator' and status = 'active'
  );
$$;

create function private.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'active'
  );
$$;

create function private.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role
      or new.status is distinct from old.status
      or new.email is distinct from old.email)
     and not private.is_coordinator() then
    raise exception 'PERFIL_CAMPOS_PROTEGIDOS';
  end if;
  new.updated_at := now();
  return new;
end
$$;

create trigger trg_protect_profile_columns
before update on public.profiles
for each row execute function private.protect_profile_columns();

-- ===== Códigos de invitación (brigadistas) =====
create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  section public.course_section not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Validación pública de un código concreto (no permite enumerar)
-- NOTA: eliminada en 20260707175321_security_hardening (la validación pasó al
-- servidor con service role).
create function public.validate_invite_code(p_code text)
returns public.course_section
language sql
stable
security definer
set search_path = ''
as $$
  select section from public.invite_codes
  where code = p_code and is_active
  limit 1;
$$;
revoke all on function public.validate_invite_code(text) from public;
grant execute on function public.validate_invite_code(text) to anon, authenticated;

-- ===== Foro: eventos, inscripciones, contador sin PII =====
create table public.forum_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  starts_at timestamptz,
  venue text,
  capacity int not null default 130 check (capacity > 0),
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.forum_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.forum_events(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 3 and 120),
  email extensions.citext not null,
  affiliation public.affiliation_type not null default 'interno',
  organization text,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

create table public.forum_seat_counts (
  event_id uuid primary key references public.forum_events(id) on delete cascade,
  capacity int not null,
  registered int not null default 0
);

-- Límite estricto de aforo en la BD (serializado con advisory lock)
create function private.enforce_forum_capacity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.forum_events%rowtype;
  v_count int;
begin
  perform pg_advisory_xact_lock(hashtext(new.event_id::text));
  select * into v_event from public.forum_events where id = new.event_id;
  if v_event.id is null then
    raise exception 'EVENTO_NO_ENCONTRADO';
  end if;
  if not v_event.is_open then
    raise exception 'INSCRIPCIONES_CERRADAS';
  end if;
  select count(*) into v_count from public.forum_registrations where event_id = new.event_id;
  if v_count >= v_event.capacity then
    raise exception 'AFORO_COMPLETO';
  end if;
  return new;
end
$$;

create trigger trg_enforce_capacity
before insert on public.forum_registrations
for each row execute function private.enforce_forum_capacity();

create function private.sync_seat_counts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.forum_seat_counts (event_id, capacity, registered)
  select e.id, e.capacity,
         (select count(*) from public.forum_registrations r where r.event_id = e.id)
  from public.forum_events e
  where e.id = coalesce(new.event_id, old.event_id)
  on conflict (event_id) do update
    set registered = excluded.registered,
        capacity = excluded.capacity;
  return null;
end
$$;

create trigger trg_sync_seat_counts
after insert or delete on public.forum_registrations
for each row execute function private.sync_seat_counts();

-- ===== Lecturas UV (dataset para análisis empírico) =====
create table public.uv_readings (
  id bigint generated always as identity primary key,
  taken_at timestamptz not null unique,
  uv_index numeric(4,2) not null check (uv_index >= 0),
  source text not null default 'open-meteo',
  created_at timestamptz not null default now()
);

-- ===== Etapa 2: operaciones de brigada (esquema listo desde día cero) =====
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  activity_type text not null default 'turno',
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.activity_assignments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  duty text,
  created_at timestamptz not null default now(),
  unique (activity_id, profile_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_by uuid references public.profiles(id) on delete set null,
  unique (activity_id, profile_id)
);

create type public.evidence_status as enum ('pending','approved','rejected');

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references public.activities(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  caption text,
  taken_at timestamptz,
  status public.evidence_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ===== Seeds =====
insert into public.forum_events (slug, title, description, starts_at, venue, capacity, is_open)
values (
  'foro-ambiental-2026',
  'Foro Ambiental y de Salud 2026',
  'Encuentro académico presencial con especialistas en salud pública y gestión ambiental: integrando la visión económica con la prevención frente a la radiación solar (D.S. N.° 003-2026-SA).',
  '2026-07-10 15:00:00-05',
  'Auditorio de la Facultad de Economía – UNSA',
  130,
  true
);

insert into public.forum_seat_counts (event_id, capacity, registered)
select id, capacity, 0 from public.forum_events where slug = 'foro-ambiental-2026';

insert into public.invite_codes (code, section) values
  ('BRIGADA-A-2026', 'A'),
  ('BRIGADA-B-2026', 'B');
