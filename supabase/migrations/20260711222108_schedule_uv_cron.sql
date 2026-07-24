-- Reconstruida a partir del estado real del proyecto remoto (aplicada originalmente
-- vía mcp__supabase__apply_migration en una sesión anterior; nunca se había comiteado
-- este archivo, por lo que el repo no reflejaba lo que corre en producción).
--
-- El secreto 'service_role_key' se crea aparte con vault.create_secret(...) vía
-- execute_sql (no en una migración versionada) para no comitear la service role key.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select
  cron.schedule(
    'fetch-uv-every-30-min',
    '*/30 * * * *',
    $$
    select net.http_post(
      url := 'https://dypkkwbxrgwokeppkdce.supabase.co/functions/v1/fetch-uv',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'service_role_key'
        )
      ),
      body := '{}'::jsonb
    );
    $$
  );
