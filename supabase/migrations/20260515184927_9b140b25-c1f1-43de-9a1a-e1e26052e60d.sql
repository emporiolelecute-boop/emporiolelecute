
CREATE TABLE IF NOT EXISTS public.seo_url_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  coverage_state text,
  indexing_state text,
  verdict text,
  last_crawl_time timestamptz,
  page_fetch_state text,
  robots_txt_state text,
  google_canonical text,
  user_canonical text,
  referring_urls jsonb,
  raw jsonb,
  checked_at timestamptz NOT NULL DEFAULT now(),
  has_issue boolean NOT NULL DEFAULT false,
  alerted boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_seo_url_status_url ON public.seo_url_status (url);
CREATE INDEX IF NOT EXISTS idx_seo_url_status_checked_at ON public.seo_url_status (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_url_status_has_issue ON public.seo_url_status (has_issue) WHERE has_issue = true;

ALTER TABLE public.seo_url_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read seo_url_status" ON public.seo_url_status;
CREATE POLICY "Admins can read seo_url_status"
  ON public.seo_url_status FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.mark_sitemap_dirty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.store_settings (key, value, updated_at)
  VALUES (
    'sitemap_dirty',
    jsonb_build_object('dirty', true, 'marked_at', now(), 'source', TG_TABLE_NAME),
    now()
  )
  ON CONFLICT (key) DO UPDATE
    SET value = jsonb_build_object('dirty', true, 'marked_at', now(), 'source', TG_TABLE_NAME),
        updated_at = now();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_mark_sitemap ON public.products;
CREATE TRIGGER trg_products_mark_sitemap
  AFTER INSERT OR UPDATE OF slug, is_active, name OR DELETE ON public.products
  FOR EACH STATEMENT EXECUTE FUNCTION public.mark_sitemap_dirty();

DROP TRIGGER IF EXISTS trg_categories_mark_sitemap ON public.categories;
CREATE TRIGGER trg_categories_mark_sitemap
  AFTER INSERT OR UPDATE OF slug, name OR DELETE ON public.categories
  FOR EACH STATEMENT EXECUTE FUNCTION public.mark_sitemap_dirty();

DROP TRIGGER IF EXISTS trg_pages_mark_sitemap ON public.pages;
CREATE TRIGGER trg_pages_mark_sitemap
  AFTER INSERT OR UPDATE OF slug, status, title OR DELETE ON public.pages
  FOR EACH STATEMENT EXECUTE FUNCTION public.mark_sitemap_dirty();
