
ALTER TABLE public.product_reviews
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_product_reviews_position
  ON public.product_reviews(product_id, is_visible, position, is_featured DESC, review_date DESC NULLS LAST);

-- Insert default home sections for kits (idempotent)
INSERT INTO public.home_sections (section_key, component_name, label, description, is_visible, position, editable_props)
VALUES
  ('home_kits_montar', 'FeaturedKits', 'Monte seu kit',
    'Sugestões para compor sua ocasião completa', true, 35,
    '{"title":"Monte seu kit","subtitle":"Combinações pensadas para ocasiões completas","bundleType":"suggested","cta":"Ver kit","ctaPath":"/kits","maxItems":3}'::jsonb),
  ('home_kits_juntos', 'FeaturedKits', 'Mais pedidos juntos',
    'Produtos frequentemente combinados', true, 45,
    '{"title":"Mais pedidos juntos","subtitle":"Combinações que nossas clientes mais escolhem","bundleType":"curated","cta":"Compor","ctaPath":"/kits","maxItems":3}'::jsonb),
  ('home_colecoes_completas', 'FeaturedCollections', 'Coleções completas',
    'Coleções editoriais com tema completo', true, 55,
    '{"title":"Coleções completas","subtitle":"Temas pensados do começo ao fim","maxItems":6}'::jsonb),
  ('home_kits_premium', 'FeaturedKits', 'Kits premium',
    'Composições especiais de maior valor', true, 65,
    '{"title":"Kits premium","subtitle":"Composições especiais com acabamento diferenciado","bundleType":"premium","cta":"Conhecer","ctaPath":"/kits","maxItems":3}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;
