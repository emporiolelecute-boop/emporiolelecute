-- Phase 14.1: Strategic Simulation persistence layer
CREATE TABLE IF NOT EXISTS public.seo_strategy_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_name text NOT NULL,
  simulation_type text NOT NULL,
  scenario_type text NOT NULL,
  entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  assumptions jsonb NOT NULL DEFAULT '{}'::jsonb,
  projected_authority numeric NOT NULL DEFAULT 0,
  projected_readiness numeric NOT NULL DEFAULT 0,
  projected_semantic_coverage numeric NOT NULL DEFAULT 0,
  projected_revenue_intent numeric NOT NULL DEFAULT 0,
  projected_cluster_growth numeric NOT NULL DEFAULT 0,
  projected_risk numeric NOT NULL DEFAULT 0,
  projected_operational_load numeric NOT NULL DEFAULT 0,
  projected_execution_cost numeric NOT NULL DEFAULT 0,
  projected_roi numeric NOT NULL DEFAULT 0,
  projected_time_to_impact integer NOT NULL DEFAULT 0,
  projected_decay_risk numeric NOT NULL DEFAULT 0,
  projected_resilience numeric NOT NULL DEFAULT 0,
  projected_sustainability numeric NOT NULL DEFAULT 0,
  confidence_score numeric NOT NULL DEFAULT 0,
  execution_complexity text NOT NULL DEFAULT 'medium',
  simulation_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_strategy_sim_created ON public.seo_strategy_simulations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_strategy_sim_type ON public.seo_strategy_simulations (simulation_type);
CREATE INDEX IF NOT EXISTS idx_seo_strategy_sim_scenario ON public.seo_strategy_simulations (scenario_type);
CREATE INDEX IF NOT EXISTS idx_seo_strategy_sim_confidence ON public.seo_strategy_simulations (confidence_score);

ALTER TABLE public.seo_strategy_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_strategy_simulations"
  ON public.seo_strategy_simulations
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_seo_strategy_simulations_updated
  BEFORE UPDATE ON public.seo_strategy_simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();