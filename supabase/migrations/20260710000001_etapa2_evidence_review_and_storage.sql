-- ===== Etapa 2: bucket de evidencias + auditoría de revisión =====

-- Bucket privado (no público), con límite de tamaño y tipos MIME permitidos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidence', 'evidence', false, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Columnas de auditoría: quién revisó la evidencia y cuándo
alter table public.evidence
  add column reviewed_by uuid references public.profiles(id) on delete set null,
  add column reviewed_at timestamptz;

-- Índices parciales para las colas de revisión del coordinador
create index idx_evidence_pending on public.evidence (created_at) where status = 'pending';
create index idx_profiles_pending on public.profiles (created_at) where status = 'pending';

-- ===== Políticas RLS en storage.objects (bucket 'evidence') =====
-- Convención de ruta: {auth.uid()}/{uuid}.{ext}

create policy "active members upload own evidence files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'evidence'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and private.is_active_member()
);

create policy "owner or coordinator reads evidence files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or private.is_coordinator()
  )
);

-- Deliberadamente SIN políticas de UPDATE/DELETE para authenticated:
-- ni el autor ni nadie más puede alterar o borrar evidencia ya subida
-- desde el cliente (integridad del registro para el informe final).
