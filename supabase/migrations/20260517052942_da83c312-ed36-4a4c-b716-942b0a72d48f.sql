-- Phase 15.3 — Cognitive Orchestration Layer
CREATE TABLE public.seo_cognitive_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  cognitive_stability_score numeric NOT NULL DEFAULT 0,
  decision_synthesis_score numeric NOT NULL DEFAULT 0,
  systemic_reasoning_score numeric NOT NULL DEFAULT 0,
  strategic_signal_clarity numeric NOT NULL DEFAULT 0,
  operational_signal_clarity numeric NOT NULL DEFAULT 0,
  semantic_signal_clarity numeric NOT NULL DEFAULT 0,
  authority_signal_clarity numeric NOT NULL DEFAULT 0,
  orchestration_efficiency numeric NOT NULL DEFAULT 0,
  orchestration_fragmentation numeric NOT NULL DEFAULT 0,
  orchestration_noise numeric NOT NULL DEFAULT 0,
  orchestration_alignment numeric NOT NULL DEFAULT 0,
  orchestration_entropy numeric NOT NULL DEFAULT 0,
  decision_confidence_score numeric NOT NULL DEFAULT 0,
  decision_traceability_score numeric NOT NULL DEFAULT 0,
  decision_conflict_score numeric NOT NULL DEFAULT 0,
  decision_consistency_score numeric NOT NULL DEFAULT 0,
  decision_latency_score numeric NOT NULL DEFAULT 0,
  cognitive_load_score numeric NOT NULL DEFAULT 0,
  strategic_confusion_score numeric NOT NULL DEFAULT 0,
  semantic_confusion_score numeric NOT NULL DEFAULT 0,
  authority_confusion_score numeric NOT NULL DEFAULT 0,
  governance_confusion_score numeric NOT NULL DEFAULT 0,
  cognitive_resilience_score numeric NOT NULL DEFAULT 0,
  cognitive_decay_risk numeric NOT NULL DEFAULT 0,
  orchestration_scalability_score numeric NOT NULL DEFAULT 0,
  strategic_survival_projection numeric NOT NULL DEFAULT 0,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  blockers jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text
);
CREATE INDEX idx_seo_cognitive_snapshots_created_at ON public.seo_cognitive_snapshots(created_at DESC);
CREATE INDEX idx_seo_cognitive_snapshots_stability ON public.seo_cognitive_snapshots(cognitive_stability_score);
CREATE INDEX idx_seo_cognitive_snapshots_synthesis ON public.seo_cognitive_snapshots(decision_synthesis_score);
ALTER TABLE public.seo_cognitive_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_cognitive_snapshots" ON public.seo_cognitive_snapshots
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.seo_decision_lineage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  decision_type text,
  originating_engine text,
  affected_engines jsonb NOT NULL DEFAULT '[]'::jsonb,
  lineage_depth numeric NOT NULL DEFAULT 0,
  confidence_score numeric NOT NULL DEFAULT 0,
  conflict_probability numeric NOT NULL DEFAULT 0,
  reasoning_chain jsonb NOT NULL DEFAULT '[]'::jsonb,
  decision_summary text
);
CREATE INDEX idx_seo_decision_lineage_type ON public.seo_decision_lineage(decision_type);
CREATE INDEX idx_seo_decision_lineage_engine ON public.seo_decision_lineage(originating_engine);
CREATE INDEX idx_seo_decision_lineage_confidence ON public.seo_decision_lineage(confidence_score);
ALTER TABLE public.seo_decision_lineage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_decision_lineage" ON public.seo_decision_lineage
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.seo_reasoning_conflicts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  conflict_type text,
  layer_a text,
  layer_b text,
  severity text,
  reasoning_divergence numeric NOT NULL DEFAULT 0,
  strategic_impact numeric NOT NULL DEFAULT 0,
  description text,
  mitigation text,
  resolved boolean NOT NULL DEFAULT false
);
CREATE INDEX idx_seo_reasoning_conflicts_created_at ON public.seo_reasoning_conflicts(created_at DESC);
CREATE INDEX idx_seo_reasoning_conflicts_severity ON public.seo_reasoning_conflicts(severity);
ALTER TABLE public.seo_reasoning_conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_reasoning_conflicts" ON public.seo_reasoning_conflicts
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));