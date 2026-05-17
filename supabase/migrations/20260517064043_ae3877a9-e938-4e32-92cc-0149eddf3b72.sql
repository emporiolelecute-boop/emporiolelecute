CREATE TABLE IF NOT EXISTS public.seo_integrity_grid_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  integrity_grid_score integer,
  executive_integrity_score integer,
  strategic_coherence_score integer,
  systemic_trust_score integer,
  semantic_integrity_score integer,
  continuity_integrity_score integer,
  operational_integrity_score integer,
  governance_integrity_score integer,
  resilience_integrity_score integer,
  convergence_integrity_score integer,
  hidden_fragmentation_risk integer,
  strategic_erosion_risk integer,
  semantic_confusion_risk integer,
  operational_conflict_risk integer,
  continuity_break_risk integer,
  integrity_matrix jsonb,
  strategic_alignment_map jsonb,
  semantic_integrity_map jsonb,
  governance_conflicts jsonb,
  resilience_distribution jsonb,
  continuity_graph jsonb,
  notes text,
  snapshot_type text NOT NULL DEFAULT 'manual'
);

ALTER TABLE public.seo_integrity_grid_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins full access seo_integrity_grid_snapshots"
  ON public.seo_integrity_grid_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_seo_integrity_grid_created_at ON public.seo_integrity_grid_snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_integrity_grid_grid_score ON public.seo_integrity_grid_snapshots (integrity_grid_score);
CREATE INDEX IF NOT EXISTS idx_seo_integrity_grid_exec_score ON public.seo_integrity_grid_snapshots (executive_integrity_score);