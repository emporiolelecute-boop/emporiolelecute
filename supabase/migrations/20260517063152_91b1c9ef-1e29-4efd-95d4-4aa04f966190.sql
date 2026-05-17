
CREATE TABLE public.seo_stability_fabric_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  stability_fabric_score numeric,
  systemic_integrity_score numeric,
  executive_stability_score numeric,
  semantic_resilience_score numeric,
  operational_resilience_score numeric,
  consensus_integrity_score numeric,
  strategic_equilibrium_score numeric,
  degradation_resistance_score numeric,
  recovery_cohesion_score numeric,
  signal_stability_score numeric,
  silent_degradation_risk numeric,
  semantic_erosion_risk numeric,
  consensus_fragmentation_risk numeric,
  executive_instability_risk numeric,
  systemic_dispersion_risk numeric,
  degradation_map jsonb DEFAULT '{}'::jsonb,
  equilibrium_matrix jsonb DEFAULT '{}'::jsonb,
  resilience_projection jsonb DEFAULT '{}'::jsonb,
  fragmentation_zones jsonb DEFAULT '[]'::jsonb,
  stability_clusters jsonb DEFAULT '[]'::jsonb,
  recovery_paths jsonb DEFAULT '[]'::jsonb,
  notes text,
  snapshot_type text NOT NULL DEFAULT 'manual'
);

ALTER TABLE public.seo_stability_fabric_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access stability fabric"
  ON public.seo_stability_fabric_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_seo_stability_fabric_created_at ON public.seo_stability_fabric_snapshots (created_at DESC);
CREATE INDEX idx_seo_stability_fabric_score ON public.seo_stability_fabric_snapshots (stability_fabric_score);
CREATE INDEX idx_seo_stability_fabric_integrity ON public.seo_stability_fabric_snapshots (systemic_integrity_score);
