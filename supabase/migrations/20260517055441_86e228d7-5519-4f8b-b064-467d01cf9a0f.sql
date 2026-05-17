CREATE TABLE IF NOT EXISTS public.seo_governance_matrix_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  governance_matrix_score numeric,
  strategic_integrity_score numeric,
  systemic_alignment_score numeric,
  operational_predictability_score numeric,
  autonomous_stability_score numeric,
  evolutionary_consistency_score numeric,
  governance_entropy_score numeric,
  strategic_cohesion_score numeric,
  execution_integrity_score numeric,
  resilience_projection_score numeric,
  collapse_exposure_score numeric,
  strategic_fragmentation_score numeric,
  operational_conflict_score numeric,
  semantic_drift_score numeric,
  executive_noise_score numeric,
  dominant_risk text,
  dominant_strength text,
  governance_verdict text,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_seo_gov_matrix_created ON public.seo_governance_matrix_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_gov_matrix_score ON public.seo_governance_matrix_snapshots (governance_matrix_score DESC);
CREATE INDEX IF NOT EXISTS idx_seo_gov_matrix_verdict ON public.seo_governance_matrix_snapshots (governance_verdict);

ALTER TABLE public.seo_governance_matrix_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage governance matrix snapshots"
  ON public.seo_governance_matrix_snapshots FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));