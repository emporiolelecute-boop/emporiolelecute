CREATE TABLE public.seo_metric_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text NOT NULL UNIQUE,
  metric_name text NOT NULL,
  domain text,
  category text,
  description text,
  source_engine text,
  calculation_type text,
  scale_min numeric NOT NULL DEFAULT 0,
  scale_max numeric NOT NULL DEFAULT 100,
  is_normalized boolean NOT NULL DEFAULT true,
  confidence_weight numeric NOT NULL DEFAULT 1,
  redundancy_group text,
  canonical_metric boolean NOT NULL DEFAULT false,
  deprecated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_metric_registry_key ON public.seo_metric_registry (metric_key);
CREATE INDEX idx_metric_registry_domain ON public.seo_metric_registry (domain);
CREATE INDEX idx_metric_registry_redundancy ON public.seo_metric_registry (redundancy_group);
ALTER TABLE public.seo_metric_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_metric_registry" ON public.seo_metric_registry
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.seo_engine_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_key text NOT NULL UNIQUE,
  engine_name text NOT NULL,
  domain text,
  description text,
  input_count integer NOT NULL DEFAULT 0,
  output_count integer NOT NULL DEFAULT 0,
  complexity_score numeric NOT NULL DEFAULT 0,
  overlap_risk numeric NOT NULL DEFAULT 0,
  confidence_score numeric NOT NULL DEFAULT 0,
  maintenance_cost numeric NOT NULL DEFAULT 0,
  deprecated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_engine_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_engine_registry" ON public.seo_engine_registry
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.seo_metric_lineage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text NOT NULL,
  depends_on text[] NOT NULL DEFAULT '{}',
  derived_from_engines text[] NOT NULL DEFAULT '{}',
  lineage_depth integer NOT NULL DEFAULT 0,
  confidence numeric NOT NULL DEFAULT 0,
  volatility numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_metric_lineage_key ON public.seo_metric_lineage (metric_key);
CREATE INDEX idx_metric_lineage_depth ON public.seo_metric_lineage (lineage_depth);
ALTER TABLE public.seo_metric_lineage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_metric_lineage" ON public.seo_metric_lineage
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.seo_kernel_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  kernel_coherence numeric NOT NULL DEFAULT 0,
  metric_redundancy numeric NOT NULL DEFAULT 0,
  engine_overlap numeric NOT NULL DEFAULT 0,
  explainability_score numeric NOT NULL DEFAULT 0,
  observability_score numeric NOT NULL DEFAULT 0,
  telemetry_quality numeric NOT NULL DEFAULT 0,
  diagnostic_consistency numeric NOT NULL DEFAULT 0,
  systemic_noise numeric NOT NULL DEFAULT 0,
  operator_load numeric NOT NULL DEFAULT 0,
  maintainability_score numeric NOT NULL DEFAULT 0,
  tracing_coverage numeric NOT NULL DEFAULT 0,
  lineage_integrity numeric NOT NULL DEFAULT 0,
  confidence_integrity numeric NOT NULL DEFAULT 0,
  normalization_health numeric NOT NULL DEFAULT 0,
  orchestration_stability numeric NOT NULL DEFAULT 0,
  architectural_entropy numeric NOT NULL DEFAULT 0,
  operational_compression numeric NOT NULL DEFAULT 0,
  notes text
);
CREATE INDEX idx_kernel_snapshots_created_at ON public.seo_kernel_snapshots (created_at DESC);
ALTER TABLE public.seo_kernel_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access seo_kernel_snapshots" ON public.seo_kernel_snapshots
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));