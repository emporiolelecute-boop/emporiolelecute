CREATE TABLE public.seo_consolidation_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compression_score NUMERIC,
  observability_efficiency NUMERIC,
  signal_noise_ratio NUMERIC,
  executive_clarity_score NUMERIC,
  systemic_complexity_score NUMERIC,
  redundancy_score NUMERIC,
  strategic_focus_score NUMERIC,
  telemetry_entropy_score NUMERIC,
  operational_noise_score NUMERIC,
  executive_signal_quality NUMERIC,
  consolidation_confidence NUMERIC,
  notes TEXT,
  payload JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_consolidation_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to consolidation snapshots"
ON public.seo_consolidation_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_seo_consolidation_snapshots_created_at ON public.seo_consolidation_snapshots(created_at DESC);
CREATE INDEX idx_seo_consolidation_snapshots_compression ON public.seo_consolidation_snapshots(compression_score);
CREATE INDEX idx_seo_consolidation_snapshots_clarity ON public.seo_consolidation_snapshots(executive_clarity_score);