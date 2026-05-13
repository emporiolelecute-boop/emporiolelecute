CREATE TABLE public.instagram_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT 'Empório LeleCute - Instagram',
  post_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible instagram posts"
ON public.instagram_posts FOR SELECT
USING (is_visible = true);

CREATE POLICY "Admins can manage instagram posts"
ON public.instagram_posts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_instagram_posts_updated_at
BEFORE UPDATE ON public.instagram_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_instagram_posts_position ON public.instagram_posts(position);