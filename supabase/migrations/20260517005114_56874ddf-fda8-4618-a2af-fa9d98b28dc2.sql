CREATE TABLE public.seo_nervous_system_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  nervous_system_score numeric NOT NULL DEFAULT 0,
  systemic_stability numeric NOT NULL DEFAULT 0,
  operational_survival numeric NOT NULL DEFAULT 0,
  strategic_fatigue numeric NOT NULL DEFAULT 0,
  semantic_pressure numeric NOT NULL DEFAULT 0,
  cognitive_efficiency numeric NOT NULL DEFAULT 0,
  authority_dependence numeric NOT NULL DEFAULT 0,
  cluster_fragility numeric NOT NULL DEFAULT 0,
  execution_stability numeric NOT NULL DEFAULT 0,
  entropy_resistance numeric NOT NULL DEFAULT 0,
  semantic_resilience numeric NOT NULL DEFAULT 0,
  strategic_resilience numeric NOT NULL DEFAULT 0,
  operational_resilience numeric NOT NULL DEFAULT 0,
  recovery_intelligence numeric NOT NULL DEFAULT 0,
  adaptive_capacity numeric NOT NULL DEFAULT 0,
  ecosystem_synchronization numeric NOT NULL DEFAULT 0,
  semantic_saturation numeric NOT NULL DEFAULT 0,
  existential_exposure numeric NOT NULL DEFAULT 0,
  collapse_probability numeric NOT NULL DEFAULT 0,
  sustainability_projection numeric NOT NULL DEFAULT 0,
  long_term_viability numeric NOT NULL DEFAULT 0,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text
);

CREATE INDEX idx_nervous_snapshots_created_at ON public.seo_nervous_system_snapshots (created_at DESC);
CREATE INDEX idx_nervous_snapshots_score ON public.seo_nervous_system_snapshots (nervous_system_score);
CREATE INDEX idx_nervous_snapshots_stability ON public.seo_nervous_system_snapshots (systemic_stability);

ALTER TABLE public.seo_nervous_system_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_nervous_system_snapshots"
ON public.seo_nervous_system_snapshots
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));