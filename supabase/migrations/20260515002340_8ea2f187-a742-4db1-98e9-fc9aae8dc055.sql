CREATE TABLE public.seo_check_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'cron',
  total int NOT NULL DEFAULT 0,
  passed int NOT NULL DEFAULT 0,
  errors int NOT NULL DEFAULT 0,
  warnings int NOT NULL DEFAULT 0,
  checks jsonb NOT NULL DEFAULT '[]'::jsonb,
  alert_sent boolean NOT NULL DEFAULT false,
  alert_error text
);

ALTER TABLE public.seo_check_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_check_runs" ON public.seo_check_runs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_seo_check_runs_ran_at ON public.seo_check_runs (ran_at DESC);