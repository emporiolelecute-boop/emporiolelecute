CREATE TABLE public.occasion_landings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_slug text NOT NULL UNIQUE,
  occasion_slug text NOT NULL,
  h1 text NOT NULL,
  hero_badge text NOT NULL,
  hero_subtitle text NOT NULL,
  theme_accent text NOT NULL DEFAULT 'from-pink-100 to-rose-100',
  seo_title text NOT NULL,
  seo_description text NOT NULL,
  seo_copy text NOT NULL,
  whatsapp_message text NOT NULL,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  testimonials jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_proof_stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_route_slugs text[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.occasion_landings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published landings"
  ON public.occasion_landings FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all landings"
  ON public.occasion_landings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage landings"
  ON public.occasion_landings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_occasion_landings_updated_at
  BEFORE UPDATE ON public.occasion_landings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_occasion_landings_route_slug ON public.occasion_landings(route_slug);
CREATE INDEX idx_occasion_landings_published ON public.occasion_landings(is_published) WHERE is_published = true;