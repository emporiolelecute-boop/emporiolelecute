
-- Fase 10.3 — Theme Hubs (SAFE MODE)
-- Não afeta tags existentes. Hubs são entidades editoriais opcionais sobre uma tag.

CREATE TABLE IF NOT EXISTS public.theme_hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tag_id uuid NULL,
  intro text NULL,
  editorial_content text NULL,
  hero_image_url text NULL,
  meta_title text NULL,
  meta_description text NULL,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_themes uuid[] NOT NULL DEFAULT '{}',
  related_occasions uuid[] NOT NULL DEFAULT '{}',
  related_segments uuid[] NOT NULL DEFAULT '{}',
  related_posts uuid[] NOT NULL DEFAULT '{}',
  is_approved boolean NOT NULL DEFAULT false,
  is_indexed boolean NOT NULL DEFAULT false,
  authority_score integer NOT NULL DEFAULT 0,
  thin_content_risk boolean NOT NULL DEFAULT true,
  cannibalization_risk text NOT NULL DEFAULT 'unknown',
  discovery_status text NOT NULL DEFAULT 'candidate',
  last_evaluated_at timestamptz NULL,
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_theme_hubs_tag_id ON public.theme_hubs(tag_id);
CREATE INDEX IF NOT EXISTS idx_theme_hubs_is_approved ON public.theme_hubs(is_approved);
CREATE INDEX IF NOT EXISTS idx_theme_hubs_authority ON public.theme_hubs(authority_score DESC);

ALTER TABLE public.theme_hubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage theme_hubs"
  ON public.theme_hubs
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view approved theme_hubs"
  ON public.theme_hubs
  FOR SELECT
  TO public
  USING (is_approved = true);

CREATE TRIGGER trg_theme_hubs_updated
  BEFORE UPDATE ON public.theme_hubs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adiciona related_themes em blog_posts para fortalecer authority score
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS related_themes uuid[] NOT NULL DEFAULT '{}';
