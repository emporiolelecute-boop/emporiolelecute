CREATE TABLE public.stale_bundle_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  route text,
  message text,
  stack text,
  user_agent text,
  reloaded boolean NOT NULL DEFAULT false
);
ALTER TABLE public.stale_bundle_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert stale_bundle_logs" ON public.stale_bundle_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view stale_bundle_logs" ON public.stale_bundle_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete stale_bundle_logs" ON public.stale_bundle_logs FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE INDEX idx_stale_bundle_logs_occurred_at ON public.stale_bundle_logs(occurred_at DESC);
CREATE INDEX idx_stale_bundle_logs_route ON public.stale_bundle_logs(route);

CREATE TABLE public.instagram_embed_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  post_url text,
  route text,
  ms_to_fallback integer,
  user_agent text
);
ALTER TABLE public.instagram_embed_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert ig_embed_failures" ON public.instagram_embed_failures FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view ig_embed_failures" ON public.instagram_embed_failures FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete ig_embed_failures" ON public.instagram_embed_failures FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE INDEX idx_ig_embed_failures_occurred_at ON public.instagram_embed_failures(occurred_at DESC);

-- Configuração pública do hard-reload (toggle e intervalo mínimo) — leitura pública para o cliente respeitar
CREATE POLICY "Public can view stale_bundle_config" ON public.store_settings FOR SELECT USING (key = 'stale_bundle_config');