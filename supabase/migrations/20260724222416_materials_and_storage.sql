create table public.materials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  category text,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes int not null,
  cover_image_path text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_materials_published on public.materials (published_at desc);

alter table public.materials enable row level security;

create policy "public can read materials"
on public.materials for select
to anon, authenticated
using (true);

create policy "coordinator manages materials"
on public.materials for all
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('materials', 'materials', true, 26214400, array[
  'application/pdf','image/jpeg','image/png','image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]) on conflict (id) do nothing;

create policy "public reads material files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'materials');

create policy "coordinator writes material files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'materials' and private.is_coordinator());

create policy "coordinator updates material files"
on storage.objects for update
to authenticated
using (bucket_id = 'materials' and private.is_coordinator());

create policy "coordinator deletes material files"
on storage.objects for delete
to authenticated
using (bucket_id = 'materials' and private.is_coordinator());
