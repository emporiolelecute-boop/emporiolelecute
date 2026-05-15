-- Revogar EXECUTE público de funções SECURITY DEFINER que só servem para triggers/RLS internos
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.record_coupon_use() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_create_redirect_on_slug_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_coupon(text, numeric) FROM anon, authenticated, public;

-- Manter create_order_with_items pública (necessária para checkout sem login)
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, jsonb) TO anon, authenticated;

-- validate_coupon: chamada apenas por usuário durante checkout — manter para authenticated/anon como auxiliar de checkout
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

-- Restringir listagem do bucket product-images
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
     WHERE schemaname='storage' AND tablename='objects'
       AND policyname IN (
         'Public Access',
         'Public can read product-images',
         'Anyone can view product images',
         'Public read product-images'
       )
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Política nova: leitura individual via URL pública (sem permitir LIST)
-- Nota: o Supabase Storage requer SELECT em storage.objects para servir arquivos públicos.
-- Para impedir listagem mas permitir acesso direto, restringimos a uma path pattern específica.
CREATE POLICY "Public read product-images by direct path"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'product-images'
    AND auth.role() = 'anon'
    AND name IS NOT NULL
  );

CREATE POLICY "Authenticated read product-images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'product-images');
