CREATE TABLE public.seo_consciousness_fabric_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  strategic_consciousness_score numeric,
  cognitive_stability_score numeric,
  executive_awareness_score numeric,
  adaptive_maturity_score numeric,
  systemic_clarity_score numeric,
  operational_coherence_score numeric,
  longitudinal_consistency_score numeric,
  strategic_identity_score numeric,
  existential_stability_score numeric,
  evolutionary_awareness_score numeric,
  cognitive_fragmentation_score numeric,
  strategic_confusion_score numeric,
  executive_dissonance_score numeric,
  systemic_instability_score numeric,
  adaptive_regression_score numeric,
  dominant_pattern text,
  dominant_instability text,
  consciousness_verdict text,
  notes text
);

CREATE INDEX idx_scfs_created_at ON public.seo_consciousness_fabric_snapshots (created_at DESC);
CREATE INDEX idx_scfs_consciousness_score ON public.seo_consciousness_fabric_snapshots (strategic_consciousness_score DESC);
CREATE INDEX idx_scfs_verdict ON public.seo_consciousness_fabric_snapshots (consciousness_verdict);

ALTER TABLE public.seo_consciousness_fabric_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view consciousness fabric snapshots"
  ON public.seo_consciousness_fabric_snapshots FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert consciousness fabric snapshots"
  ON public.seo_consciousness_fabric_snapshots FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update consciousness fabric snapshots"
  ON public.seo_consciousness_fabric_snapshots FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete consciousness fabric snapshots"
  ON public.seo_consciousness_fabric_snapshots FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));