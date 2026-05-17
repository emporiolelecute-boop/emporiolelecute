
CREATE TABLE IF NOT EXISTS public.seo_operational_reality_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operational_value_score NUMERIC,
  dashboard_utilization_score NUMERIC,
  performance_pressure_score NUMERIC,
  maintenance_burden_score NUMERIC,
  documentation_health_score NUMERIC,
  commercial_opportunity_score NUMERIC,
  pruning_readiness_score NUMERIC,
  complexity_cost_score NUMERIC,
  human_operability_score NUMERIC,
  sustainability_score NUMERIC,
  governance_maturity_score NUMERIC,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_operational_reality_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view operational reality snapshots"
  ON public.seo_operational_reality_snapshots FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert operational reality snapshots"
  ON public.seo_operational_reality_snapshots FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_seo_op_reality_created_at
  ON public.seo_operational_reality_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_op_reality_op_value
  ON public.seo_operational_reality_snapshots (operational_value_score);
CREATE INDEX IF NOT EXISTS idx_seo_op_reality_sustain
  ON public.seo_operational_reality_snapshots (sustainability_score);
