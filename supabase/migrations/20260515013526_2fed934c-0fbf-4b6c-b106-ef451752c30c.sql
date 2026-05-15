ALTER TABLE public.instagram_posts
  ADD COLUMN IF NOT EXISTS extraction_status text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS extraction_error text,
  ADD COLUMN IF NOT EXISTS shortcode text,
  ADD COLUMN IF NOT EXISTS last_extracted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS instagram_posts_shortcode_uniq
  ON public.instagram_posts (shortcode) WHERE shortcode IS NOT NULL;