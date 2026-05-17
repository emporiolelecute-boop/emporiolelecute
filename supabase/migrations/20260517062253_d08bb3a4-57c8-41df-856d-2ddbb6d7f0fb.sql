
CREATE TABLE public.seo_nexus_convergence_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  convergence_score numeric,
  strategic_consistency_score numeric,
  temporal_coherence_score numeric,
  signal_integrity_score numeric,
  semantic_trust_score numeric,
  governance_confidence_score numeric,
  operational_stability_score numeric,
  causal_alignment_score numeric,
  entropy_resistance_score numeric,
  executive_clarity_score numeric,
  dominant_cluster text,
  weakest_cluster text,
  highest_risk_domain text,
  strongest_domain text,
  convergence_map jsonb DEFAULT '{}'::jsonb,
  trust_matrix jsonb DEFAULT '{}'::jsonb,
  causal_graph jsonb DEFAULT '{}'::jsonb,
  strategic_conflicts jsonb DEFAULT '[]'::jsonb,
  resilience_projection jsonb DEFAULT '{}'::jsonb,
  continuity_projection jsonb DEFAULT '{}'::jsonb,
  notes text,
  snapshot_type text NOT NULL DEFAULT 'manual'
);

ALTER TABLE public.seo_nexus_convergence_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access nexus convergence"
  ON public.seo_nexus_convergence_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_seo_nexus_conv_created_at ON public.seo_nexus_convergence_snapshots (created_at DESC);
CREATE INDEX idx_seo_nexus_conv_score ON public.seo_nexus_convergence_snapshots (convergence_score);
CREATE INDEX idx_seo_nexus_conv_consistency ON public.seo_nexus_convergence_snapshots (strategic_consistency_score);
