-- Meta Reasoning Snapshots
CREATE TABLE public.seo_meta_reasoning_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  meta_reasoning_score numeric NOT NULL DEFAULT 0,
  strategic_self_awareness_score numeric NOT NULL DEFAULT 0,
  systemic_reflection_score numeric NOT NULL DEFAULT 0,
  cognitive_integrity_score numeric NOT NULL DEFAULT 0,
  reasoning_stability_score numeric NOT NULL DEFAULT 0,
  cross_layer_coherence numeric NOT NULL DEFAULT 0,
  strategic_coherence numeric NOT NULL DEFAULT 0,
  operational_coherence numeric NOT NULL DEFAULT 0,
  semantic_coherence numeric NOT NULL DEFAULT 0,
  authority_coherence numeric NOT NULL DEFAULT 0,
  governance_coherence numeric NOT NULL DEFAULT 0,
  reasoning_reliability_score numeric NOT NULL DEFAULT 0,
  decision_reliability_score numeric NOT NULL DEFAULT 0,
  strategic_confidence_score numeric NOT NULL DEFAULT 0,
  forecast_reliability_score numeric NOT NULL DEFAULT 0,
  traceability_integrity_score numeric NOT NULL DEFAULT 0,
  reasoning_drift_score numeric NOT NULL DEFAULT 0,
  strategic_drift_score numeric NOT NULL DEFAULT 0,
  semantic_drift_score numeric NOT NULL DEFAULT 0,
  operational_drift_score numeric NOT NULL DEFAULT 0,
  governance_drift_score numeric NOT NULL DEFAULT 0,
  cognitive_stability_score numeric NOT NULL DEFAULT 0,
  orchestration_stability_score numeric NOT NULL DEFAULT 0,
  consensus_stability_score numeric NOT NULL DEFAULT 0,
  observability_stability_score numeric NOT NULL DEFAULT 0,
  contradiction_risk_score numeric NOT NULL DEFAULT 0,
  self_conflict_score numeric NOT NULL DEFAULT 0,
  strategic_hallucination_risk numeric NOT NULL DEFAULT 0,
  coherence_collapse_risk numeric NOT NULL DEFAULT 0,
  long_term_reasoning_viability numeric NOT NULL DEFAULT 0,
  strategic_survival_confidence numeric NOT NULL DEFAULT 0,
  systemic_longevity_score numeric NOT NULL DEFAULT 0,
  executive_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  blockers jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text
);
CREATE INDEX idx_mrs_created_at ON public.seo_meta_reasoning_snapshots (created_at DESC);
CREATE INDEX idx_mrs_meta_score ON public.seo_meta_reasoning_snapshots (meta_reasoning_score);
CREATE INDEX idx_mrs_self_aware ON public.seo_meta_reasoning_snapshots (strategic_self_awareness_score);
CREATE INDEX idx_mrs_contradiction ON public.seo_meta_reasoning_snapshots (contradiction_risk_score);
ALTER TABLE public.seo_meta_reasoning_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_meta_reasoning_snapshots"
ON public.seo_meta_reasoning_snapshots FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Reasoning Drift Registry
CREATE TABLE public.seo_reasoning_drift_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  drift_type text,
  affected_layer text,
  severity text,
  drift_score numeric,
  stability_impact numeric,
  contradiction_probability numeric,
  description text,
  mitigation_strategy text,
  resolved boolean NOT NULL DEFAULT false
);
CREATE INDEX idx_drift_type ON public.seo_reasoning_drift_registry (drift_type);
CREATE INDEX idx_drift_layer ON public.seo_reasoning_drift_registry (affected_layer);
CREATE INDEX idx_drift_severity ON public.seo_reasoning_drift_registry (severity);
CREATE INDEX idx_drift_resolved ON public.seo_reasoning_drift_registry (resolved);
ALTER TABLE public.seo_reasoning_drift_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_reasoning_drift_registry"
ON public.seo_reasoning_drift_registry FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Coherence Conflicts
CREATE TABLE public.seo_coherence_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  conflict_type text,
  source_layer text,
  target_layer text,
  coherence_loss numeric,
  systemic_impact numeric,
  contradiction_depth numeric,
  explanation text,
  suggested_resolution text
);
ALTER TABLE public.seo_coherence_conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_coherence_conflicts"
ON public.seo_coherence_conflicts FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));