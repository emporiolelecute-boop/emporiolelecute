ALTER TABLE public.product_reviews
  ADD COLUMN IF NOT EXISTS external_review_id text;

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_reviews_external
  ON public.product_reviews (source, external_review_id)
  WHERE external_review_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_visible
  ON public.product_reviews (product_id, is_visible, is_featured DESC, review_date DESC NULLS LAST);