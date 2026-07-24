-- Advisor: multiple_permissive_policies — "coordinator manages materials" (FOR ALL)
-- se solapaba con "public can read materials" (FOR SELECT) para authenticated,
-- obligando a evaluar ambas políticas en cada SELECT. Se separa en policies
-- específicas de escritura para que SELECT quede cubierto por una sola.
drop policy "coordinator manages materials" on public.materials;

create policy "coordinator inserts materials"
on public.materials for insert
to authenticated
with check (private.is_coordinator());

create policy "coordinator updates materials"
on public.materials for update
to authenticated
using (private.is_coordinator())
with check (private.is_coordinator());

create policy "coordinator deletes materials"
on public.materials for delete
to authenticated
using (private.is_coordinator());

-- Advisor: unindexed_foreign_keys — materials.uploaded_by sin índice de cobertura.
create index idx_materials_uploaded_by on public.materials (uploaded_by);
