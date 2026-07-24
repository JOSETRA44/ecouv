-- Bucket público: la descarga por URL directa no pasa por RLS de storage.objects,
-- así que una política SELECT amplia solo sirve para permitir listar el bucket
-- completo vía la API autenticada — innecesario, ya que la app lista materiales
-- desde la tabla public.materials, no desde el storage. Advisor: public_bucket_allows_listing.
drop policy "public reads material files" on storage.objects;
