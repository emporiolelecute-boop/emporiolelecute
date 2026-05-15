-- Histórico detalhado por post
CREATE TABLE IF NOT EXISTS public.instagram_post_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.instagram_posts(id) ON DELETE CASCADE,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  image_url text,
  title text,
  error_message text,
  meta_used text
);

ALTER TABLE public.instagram_post_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage instagram_post_attempts"
ON public.instagram_post_attempts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_ig_attempts_post ON public.instagram_post_attempts(post_id, attempted_at DESC);