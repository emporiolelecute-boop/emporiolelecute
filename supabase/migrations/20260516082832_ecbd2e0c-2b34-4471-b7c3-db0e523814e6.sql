
CREATE TABLE public.seo_simulation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_name text NOT NULL,
  simulation_type text NOT NULL,
  scenario_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NULL,
  input_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  simulation_inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  predicted_authority numeric NOT NULL DEFAULT 0,
  predicted_semantic_coverage numeric NOT NULL DEFAULT 0,
  predicted_resilience numeric NOT NULL DEFAULT 0,
  predicted_operational_load numeric NOT NULL DEFAULT 0,
  predicted_execution_cost numeric NOT NULL DEFAULT 0,
  predicted_growth_velocity numeric NOT NULL DEFAULT 0,
  predicted_decay_risk numeric NOT NULL DEFAULT 0,
  predicted_collapse_risk numeric NOT NULL DEFAULT 0,
  predicted_saturation numeric NOT NULL DEFAULT 0,
  predicted_roi numeric NOT NULL DEFAULT 0,
  predicted_cluster_health numeric NOT NULL DEFAULT 0,
  predicted_recovery_time numeric NOT NULL DEFAULT 0,
  confidence_score numeric NOT NULL DEFAULT 0,
  simulation_notes text NULL
);

CREATE INDEX idx_seo_sim_runs_created_at ON public.seo_simulation_runs(created_at DESC);
CREATE INDEX idx_seo_sim_runs_type ON public.seo_simulation_runs(simulation_type);
CREATE INDEX idx_seo_sim_runs_scenario ON public.seo_simulation_runs(scenario_type);

ALTER TABLE public.seo_simulation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_simulation_runs"
  ON public.seo_simulation_runs
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
