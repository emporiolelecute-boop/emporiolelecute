CREATE TABLE public.seo_system_finalization_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maintainability_score INTEGER,
  operational_simplicity_score INTEGER,
  telemetry_efficiency_score INTEGER,
  executive_clarity_score INTEGER,
  runtime_stability_score INTEGER,
  governance_integrity_score INTEGER,
  documentation_completeness_score INTEGER,
  scalability_risk_score INTEGER,
  operational_overload_score INTEGER,
  observability_efficiency_score INTEGER,
  performance_pressure_score INTEGER,
  finalization_confidence_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_system_finalization_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access finalization snapshots"
ON public.seo_system_finalization_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_finalization_snap_created_at ON public.seo_system_finalization_snapshots(created_at DESC);
CREATE INDEX idx_finalization_snap_maint ON public.seo_system_finalization_snapshots(maintainability_score);
CREATE INDEX idx_finalization_snap_clarity ON public.seo_system_finalization_snapshots(executive_clarity_score);