CREATE TABLE IF NOT EXISTS public.seo_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('semrush','gsc','aggregate')),
  domain text NOT NULL DEFAULT 'emporiolelecute.com.br',
  captured_at timestamptz NOT NULL DEFAULT now(),
  organic_keywords integer,
  organic_traffic integer,
  organic_cost numeric,
  authority_score integer,
  backlinks_total integer,
  referring_domains integer,
  total_impressions bigint,
  total_clicks bigint,
  avg_position numeric,
  top_keywords jsonb DEFAULT '[]'::jsonb,
  raw jsonb DEFAULT '{}'::jsonb,
  notes text
);
CREATE INDEX IF NOT EXISTS idx_seo_snapshots_source_date ON public.seo_snapshots (source, captured_at DESC);
ALTER TABLE public.seo_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_snapshots" ON public.seo_snapshots
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));