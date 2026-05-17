CREATE TABLE IF NOT EXISTS public.seo_coherence_matrix_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  coherence_matrix_score integer,
  systemic_coherence_score integer,
  strategic_alignment_score integer,
  cognitive_consistency_score integer,
  semantic_coherence_score integer,
  operational_alignment_score integer,
  governance_alignment_score integer,
  continuity_coherence_score integer,
  resilience_coherence_score integer,
  execution_coherence_score integer,
  strategic_misalignment_risk integer,
  semantic_divergence_risk integer,
  operational_dispersion_risk integer,
  governance_dissonance_risk integer,
  cognitive_fragmentation_risk integer,
  coherence_map jsonb,
  alignment_matrix jsonb,
  semantic_flow_map jsonb,
  operational_dissonance_map jsonb,
  resilience_alignment_map jsonb,
  continuity_coherence_graph jsonb,
  notes text,
  snapshot_type text NOT NULL DEFAULT 'manual'
);

ALTER TABLE public.seo_coherence_matrix_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access seo_coherence_matrix_snapshots"
  ON public.seo_coherence_matrix_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_seo_coherence_matrix_created_at ON public.seo_coherence_matrix_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_coherence_matrix_score ON public.seo_coherence_matrix_snapshots (coherence_matrix_score);
CREATE INDEX IF NOT EXISTS idx_seo_coherence_systemic_score ON public.seo_coherence_matrix_snapshots (systemic_coherence_score);