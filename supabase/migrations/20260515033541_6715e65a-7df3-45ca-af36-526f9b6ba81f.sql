CREATE TABLE public.instagram_feed_embeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_url text NOT NULL,
  caption text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.instagram_feed_embeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active feed embeds"
  ON public.instagram_feed_embeds FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage feed embeds"
  ON public.instagram_feed_embeds FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_instagram_feed_embeds_updated_at
  BEFORE UPDATE ON public.instagram_feed_embeds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_instagram_feed_embeds_position ON public.instagram_feed_embeds(position);