ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS topical_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS authority_contribution integer NOT NULL DEFAULT 0;

ALTER TABLE public.theme_hubs
  ADD COLUMN IF NOT EXISTS readiness_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS topical_coverage integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS internal_links_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_authority_refresh timestamptz;

ALTER TABLE public.combination_pages_registry
  ADD COLUMN IF NOT EXISTS readiness_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS topical_coverage integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS internal_links_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cannibalization_risk text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS last_authority_refresh timestamptz;