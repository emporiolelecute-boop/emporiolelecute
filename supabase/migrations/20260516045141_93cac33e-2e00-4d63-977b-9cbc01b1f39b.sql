
-- Fase 7: Reviews + Editorial Content (aditivo, não destrutivo)

-- 1) Campo editorial opcional no produto
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS editorial_content text;

-- 2) Tabela de avaliações (estrutura aberta p/ importar Elo7 futuramente)
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  source text NOT NULL DEFAULT 'manual',
  source_url text,
  is_verified boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  review_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product
  ON public.product_reviews (product_id, is_visible);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible reviews" ON public.product_reviews;
CREATE POLICY "Anyone can view visible reviews"
  ON public.product_reviews
  FOR SELECT
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins manage reviews" ON public.product_reviews;
CREATE POLICY "Admins manage reviews"
  ON public.product_reviews
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS trg_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER trg_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) View agregada (média + contagem) para schema.org e exibição rápida
CREATE OR REPLACE VIEW public.product_review_stats AS
SELECT
  product_id,
  count(*)::int                      AS review_count,
  round(avg(rating)::numeric, 2)     AS avg_rating
FROM public.product_reviews
WHERE is_visible = true
GROUP BY product_id;

GRANT SELECT ON public.product_review_stats TO anon, authenticated;
