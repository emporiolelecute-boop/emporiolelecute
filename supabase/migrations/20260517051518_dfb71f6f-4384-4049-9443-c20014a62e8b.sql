-- Phase 15.2: Strategic Operating Fabric

CREATE TABLE IF NOT EXISTS public.seo_operating_fabric_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  operating_fabric_score numeric,
  strategic_cohesion_score numeric,
  semantic_integrity_score numeric,
  authority_integrity_score numeric,
  governance_integrity_score numeric,
  resilience_integrity_score numeric,
  fragmentation_risk numeric,
  dependency_risk numeric,
  execution_pressure numeric,
  operational_debt numeric,
  scaling_risk numeric,
  systemic_complexity numeric,
  explainability_score numeric,
  observability_score numeric,
  consensus_score numeric,
  anomaly_pressure numeric,
  strategic_noise numeric,
  entropy_score numeric,
  scalability_projection numeric,
  future_stability_score numeric,
  sustainability_projection numeric,
  continuity_projection numeric,
  collapse_probability numeric,
  executive_summary jsonb,
  strengths jsonb,
  blockers jsonb,
  recommendations jsonb,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_seo_op_fabric_snap_created ON public.seo_operating_fabric_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_op_fabric_snap_score ON public.seo_operating_fabric_snapshots (operating_fabric_score);
CREATE INDEX IF NOT EXISTS idx_seo_op_fabric_snap_collapse ON public.seo_operating_fabric_snapshots (collapse_probability);

ALTER TABLE public.seo_operating_fabric_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access seo_operating_fabric_snapshots"
ON public.seo_operating_fabric_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.seo_structural_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  dependency_type text,
  source_engine text,
  target_engine text,
  dependency_strength numeric,
  fragility_score numeric,
  failure_impact numeric,
  cascading_risk numeric,
  mitigation_strategy text,
  is_critical boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_seo_struct_dep_source ON public.seo_structural_dependencies (source_engine);
CREATE INDEX IF NOT EXISTS idx_seo_struct_dep_target ON public.seo_structural_dependencies (target_engine);
CREATE INDEX IF NOT EXISTS idx_seo_struct_dep_critical ON public.seo_structural_dependencies (is_critical);

ALTER TABLE public.seo_structural_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access seo_structural_dependencies"
ON public.seo_structural_dependencies
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.seo_causality_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text,
  source_layer text,
  affected_layers jsonb,
  causality_strength numeric,
  propagation_depth numeric,
  propagation_risk numeric,
  description text
);

CREATE INDEX IF NOT EXISTS idx_seo_caus_reg_event ON public.seo_causality_registry (event_type);
CREATE INDEX IF NOT EXISTS idx_seo_caus_reg_source ON public.seo_causality_registry (source_layer);
CREATE INDEX IF NOT EXISTS idx_seo_caus_reg_created ON public.seo_causality_registry (created_at DESC);

ALTER TABLE public.seo_causality_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access seo_causality_registry"
ON public.seo_causality_registry
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
