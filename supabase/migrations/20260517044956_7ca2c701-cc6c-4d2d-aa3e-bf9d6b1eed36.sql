
CREATE TABLE public.seo_unified_bus_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  operational_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  intelligence_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  governance_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  semantic_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  authority_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  resilience_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  continuity_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  anomaly_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  explainability_signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  kernel_score numeric NOT NULL DEFAULT 0,
  coherence_score numeric NOT NULL DEFAULT 0,
  resilience_score numeric NOT NULL DEFAULT 0,
  entropy_score numeric NOT NULL DEFAULT 0,
  observability_score numeric NOT NULL DEFAULT 0,
  anomaly_score numeric NOT NULL DEFAULT 0,
  governance_score numeric NOT NULL DEFAULT 0,
  system_consistency_score numeric NOT NULL DEFAULT 0,
  future_viability_score numeric NOT NULL DEFAULT 0,
  notes text
);
ALTER TABLE public.seo_unified_bus_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_unified_bus_snapshots"
  ON public.seo_unified_bus_snapshots FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_seo_unified_bus_created ON public.seo_unified_bus_snapshots (created_at DESC);
CREATE INDEX idx_seo_unified_bus_kernel ON public.seo_unified_bus_snapshots (kernel_score);
CREATE INDEX idx_seo_unified_bus_coherence ON public.seo_unified_bus_snapshots (coherence_score);
CREATE INDEX idx_seo_unified_bus_future ON public.seo_unified_bus_snapshots (future_viability_score);

CREATE TABLE public.seo_engine_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  engine_a text NOT NULL,
  engine_b text NOT NULL,
  conflict_type text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  description text,
  affected_entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  resolution_suggestion text,
  resolved boolean NOT NULL DEFAULT false
);
ALTER TABLE public.seo_engine_conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_engine_conflicts"
  ON public.seo_engine_conflicts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_seo_engine_conflicts_severity ON public.seo_engine_conflicts (severity);
CREATE INDEX idx_seo_engine_conflicts_resolved ON public.seo_engine_conflicts (resolved);
CREATE INDEX idx_seo_engine_conflicts_created ON public.seo_engine_conflicts (created_at DESC);

CREATE TABLE public.seo_metric_consistency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  source_engine text NOT NULL,
  normalized_value numeric NOT NULL DEFAULT 0,
  raw_value numeric NOT NULL DEFAULT 0,
  confidence_score numeric NOT NULL DEFAULT 0,
  variance_score numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_metric_consistency ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_metric_consistency"
  ON public.seo_metric_consistency FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_seo_metric_consistency_metric ON public.seo_metric_consistency (metric_name);
CREATE INDEX idx_seo_metric_consistency_created ON public.seo_metric_consistency (created_at DESC);
