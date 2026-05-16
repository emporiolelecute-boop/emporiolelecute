
CREATE TABLE IF NOT EXISTS public.seo_strategy_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  snapshot_date timestamptz NOT NULL DEFAULT now(),
  authority_score numeric NOT NULL DEFAULT 0,
  readiness_score numeric NOT NULL DEFAULT 0,
  semantic_coverage numeric NOT NULL DEFAULT 0,
  business_intent_score numeric NOT NULL DEFAULT 0,
  conversion_potential numeric NOT NULL DEFAULT 0,
  editorial_depth numeric NOT NULL DEFAULT 0,
  internal_link_strength numeric NOT NULL DEFAULT 0,
  review_strength numeric NOT NULL DEFAULT 0,
  decay_score numeric NOT NULL DEFAULT 0,
  cannibalization_risk text NOT NULL DEFAULT 'unknown',
  regression_risk text NOT NULL DEFAULT 'unknown',
  strategic_value numeric NOT NULL DEFAULT 0,
  execution_priority numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_strategy_memory_entity ON public.seo_strategy_memory(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_seo_strategy_memory_snapshot ON public.seo_strategy_memory(snapshot_date DESC);

ALTER TABLE public.seo_strategy_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_strategy_memory"
  ON public.seo_strategy_memory
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_seo_strategy_memory_updated_at
  BEFORE UPDATE ON public.seo_strategy_memory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.seo_cluster_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_key text NOT NULL,
  snapshot_date timestamptz NOT NULL DEFAULT now(),
  total_entities int NOT NULL DEFAULT 0,
  avg_authority numeric NOT NULL DEFAULT 0,
  avg_readiness numeric NOT NULL DEFAULT 0,
  avg_roi numeric NOT NULL DEFAULT 0,
  avg_conversion numeric NOT NULL DEFAULT 0,
  orphan_rate numeric NOT NULL DEFAULT 0,
  concentration_risk numeric NOT NULL DEFAULT 0,
  saturation_score numeric NOT NULL DEFAULT 0,
  growth_velocity numeric NOT NULL DEFAULT 0,
  decline_velocity numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_cluster_memory_key ON public.seo_cluster_memory(cluster_key);
CREATE INDEX IF NOT EXISTS idx_seo_cluster_memory_snapshot ON public.seo_cluster_memory(snapshot_date DESC);

ALTER TABLE public.seo_cluster_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_cluster_memory"
  ON public.seo_cluster_memory
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
