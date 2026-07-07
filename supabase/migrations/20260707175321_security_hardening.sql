-- 1) rls_auto_enable: función event_trigger preexistente; revocar EXECUTE público
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

-- 2) La validación de códigos de invitación pasa al servidor (service role)
drop function public.validate_invite_code(text);

-- 3) INSERT del foro con predicado real: solo eventos abiertos
drop policy "public can register to forum" on public.forum_registrations;
create policy "public can register to open forum"
on public.forum_registrations for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.forum_events e
    where e.id = event_id and e.is_open
  )
);
