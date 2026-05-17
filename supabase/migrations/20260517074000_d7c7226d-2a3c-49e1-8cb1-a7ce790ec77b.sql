CREATE TABLE public.seo_final_governance_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  governance_maturity_score numeric,
  sustainable_complexity_score numeric,
  maintenance_liability_score numeric,
  documentation_reliability_score numeric,
  commercial_leverage_score numeric,
  performance_pressure_score numeric,
  cache_pressure_score numeric,
  operational_bloat_score numeric,
  simplification_backlog_score numeric,
  operational_sustainability_score numeric,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.seo_final_governance_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view final governance snapshots"
ON public.seo_final_governance_snapshots FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert final governance snapshots"
ON public.seo_final_governance_snapshots FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete final governance snapshots"
ON public.seo_final_governance_snapshots FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_sfgs_created_at ON public.seo_final_governance_snapshots(created_at DESC);
CREATE INDEX idx_sfgs_governance ON public.seo_final_governance_snapshots(governance_maturity_score);
CREATE INDEX idx_sfgs_sustainable ON public.seo_final_governance_snapshots(sustainable_complexity_score);