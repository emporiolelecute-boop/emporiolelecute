-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  cover_image text,
  cover_image_alt text,
  meta_title text,
  meta_description text,
  is_indexed boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author text DEFAULT 'Empório LeleCute',
  reading_time integer,
  featured boolean NOT NULL DEFAULT false,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_products uuid[] NOT NULL DEFAULT '{}',
  related_categories uuid[] NOT NULL DEFAULT '{}',
  related_occasions uuid[] NOT NULL DEFAULT '{}',
  related_segments uuid[] NOT NULL DEFAULT '{}',
  related_tags uuid[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = true;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins manage blog_posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER blog_posts_sitemap_dirty
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH STATEMENT EXECUTE FUNCTION public.mark_sitemap_dirty();

-- Combination pages registry (governance for /segmento/x/ocasiao/y etc.)
CREATE TABLE IF NOT EXISTS public.combination_pages_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  primary_type text NOT NULL,
  primary_slug text NOT NULL,
  secondary_type text NOT NULL,
  secondary_slug text NOT NULL,
  product_count integer NOT NULL DEFAULT 0,
  has_editorial boolean NOT NULL DEFAULT false,
  has_custom_meta boolean NOT NULL DEFAULT false,
  has_faq boolean NOT NULL DEFAULT false,
  seo_score integer NOT NULL DEFAULT 0,
  is_indexable boolean NOT NULL DEFAULT false,
  editorial_content text,
  meta_title text,
  meta_description text,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_evaluated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_combo_pages_path ON public.combination_pages_registry(path);
CREATE INDEX IF NOT EXISTS idx_combo_pages_indexable ON public.combination_pages_registry(is_indexable);

ALTER TABLE public.combination_pages_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view indexable combos"
  ON public.combination_pages_registry FOR SELECT
  USING (is_indexable = true);

CREATE POLICY "Admins manage combo registry"
  ON public.combination_pages_registry FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER combo_pages_updated_at
  BEFORE UPDATE ON public.combination_pages_registry
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();