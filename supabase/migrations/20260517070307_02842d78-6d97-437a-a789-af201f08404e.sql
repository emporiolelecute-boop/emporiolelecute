CREATE TABLE public.seo_execution_orchestrator_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_sustainability_score NUMERIC,
  operational_rhythm_score NUMERIC,
  strategic_focus_score NUMERIC,
  compounding_leverage_score NUMERIC,
  execution_overload_score NUMERIC,
  maintenance_pressure_score NUMERIC,
  recovery_capacity_score NUMERIC,
  strategic_fatigue_score NUMERIC,
  operational_drag_score NUMERIC,
  execution_clarity_score NUMERIC,
  queue_conflict_score NUMERIC,
  cadence_stability_score NUMERIC,
  notes TEXT,
  payload JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_execution_orchestrator_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to execution orchestrator snapshots"
ON public.seo_execution_orchestrator_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_seo_exec_orch_created_at ON public.seo_execution_orchestrator_snapshots(created_at DESC);
CREATE INDEX idx_seo_exec_orch_sustainability ON public.seo_execution_orchestrator_snapshots(execution_sustainability_score);
CREATE INDEX idx_seo_exec_orch_focus ON public.seo_execution_orchestrator_snapshots(strategic_focus_score);