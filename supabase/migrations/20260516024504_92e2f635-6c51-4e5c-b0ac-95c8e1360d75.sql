
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS h1_override text,
  ADD COLUMN IF NOT EXISTS description_seo text,
  ADD COLUMN IF NOT EXISTS is_indexed boolean NOT NULL DEFAULT true;

ALTER TABLE public.occasions
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS h1_override text,
  ADD COLUMN IF NOT EXISTS description_seo text,
  ADD COLUMN IF NOT EXISTS is_indexed boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_categories_is_indexed ON public.categories(is_indexed);
CREATE INDEX IF NOT EXISTS idx_occasions_is_indexed ON public.occasions(is_indexed);
