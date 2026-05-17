CREATE TABLE public.seo_meta_governance_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  governance_score numeric NOT NULL DEFAULT 0,
  systemic_consistency numeric NOT NULL DEFAULT 0,
  strategic_governability numeric NOT NULL DEFAULT 0,
  operational_predictability numeric NOT NULL DEFAULT 0,
  semantic_cohesion numeric NOT NULL DEFAULT 0,
  authority_balance numeric NOT NULL DEFAULT 0,
  ecosystem_integrity numeric NOT NULL DEFAULT 0,
  resilience_continuity numeric NOT NULL DEFAULT 0,
  contradiction_pressure numeric NOT NULL DEFAULT 0,
  strategic_fragmentation numeric NOT NULL DEFAULT 0,
  operational_noise numeric NOT NULL DEFAULT 0,
  semantic_instability numeric NOT NULL DEFAULT 0,
  authority_distortion numeric NOT NULL DEFAULT 0,
  sustainability_continuity numeric NOT NULL DEFAULT 0,
  adaptability_continuity numeric NOT NULL DEFAULT 0,
  recovery_continuity numeric NOT NULL DEFAULT 0,
  execution_continuity numeric NOT NULL DEFAULT 0,
  long_horizon_survivability numeric NOT NULL DEFAULT 0,
  systemic_trustworthiness numeric NOT NULL DEFAULT 0,
  existential_stability numeric NOT NULL DEFAULT 0,
  notes text,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_meta_gov_created_at ON public.seo_meta_governance_snapshots (created_at DESC);
CREATE INDEX idx_meta_gov_governance_score ON public.seo_meta_governance_snapshots (governance_score);
CREATE INDEX idx_meta_gov_consistency ON public.seo_meta_governance_snapshots (systemic_consistency);

ALTER TABLE public.seo_meta_governance_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_meta_governance_snapshots"
ON public.seo_meta_governance_snapshots
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));