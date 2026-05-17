-- Phase 15.5: Executive Synthesis Core + Systemic Strategy Layer

CREATE TABLE IF NOT EXISTS public.seo_executive_core_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  executive_core_score numeric,
  systemic_strategy_score numeric,
  strategic_alignment_score numeric,
  execution_alignment_score numeric,
  operational_sustainability_score numeric,
  strategic_resilience_score numeric,
  systemic_stability_score numeric,
  orchestration_integrity_score numeric,
  intelligence_integrity_score numeric,
  governance_integrity_score numeric,
  semantic_integrity_score numeric,
  authority_integrity_score numeric,
  hidden_risk_score numeric,
  collapse_exposure_score numeric,
  strategic_fragility_score numeric,
  execution_fragility_score numeric,
  governance_fragility_score numeric,
  semantic_fragility_score numeric,
  long_term_viability_score numeric,
  strategic_continuity_score numeric,
  scalability_viability_score numeric,
  sustainability_projection_score numeric,
  future_collapse_probability numeric,
  strategic_signal_quality numeric,
  systemic_confidence_score numeric,
  decision_reliability_score numeric,
  coherence_depth_score numeric,
  explainability_depth_score numeric,
  executive_summary jsonb,
  executive_priorities jsonb,
  executive_risks jsonb,
  executive_recommendations jsonb,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_seo_exec_core_created ON public.seo_executive_core_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_exec_core_score ON public.seo_executive_core_snapshots (executive_core_score);
CREATE INDEX IF NOT EXISTS idx_seo_exec_core_strat ON public.seo_executive_core_snapshots (systemic_strategy_score);
CREATE INDEX IF NOT EXISTS idx_seo_exec_core_collapse ON public.seo_executive_core_snapshots (future_collapse_probability);

ALTER TABLE public.seo_executive_core_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage executive core snapshots"
  ON public.seo_executive_core_snapshots FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.seo_systemic_risk_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  risk_type text,
  affected_systems jsonb,
  risk_severity text,
  propagation_probability numeric,
  collapse_probability numeric,
  resilience_impact numeric,
  mitigation_complexity numeric,
  description text,
  suggested_action text,
  resolved boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_seo_risk_type ON public.seo_systemic_risk_registry (risk_type);
CREATE INDEX IF NOT EXISTS idx_seo_risk_sev ON public.seo_systemic_risk_registry (risk_severity);
CREATE INDEX IF NOT EXISTS idx_seo_risk_resolved ON public.seo_systemic_risk_registry (resolved);
CREATE INDEX IF NOT EXISTS idx_seo_risk_created ON public.seo_systemic_risk_registry (created_at DESC);

ALTER TABLE public.seo_systemic_risk_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage systemic risk registry"
  ON public.seo_systemic_risk_registry FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.seo_strategy_alignment_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  strategy_layer text,
  execution_layer text,
  alignment_score numeric,
  divergence_score numeric,
  execution_gap_score numeric,
  confidence_score numeric,
  explanation text
);

CREATE INDEX IF NOT EXISTS idx_seo_strat_align_created ON public.seo_strategy_alignment_registry (created_at DESC);

ALTER TABLE public.seo_strategy_alignment_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage strategy alignment registry"
  ON public.seo_strategy_alignment_registry FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));