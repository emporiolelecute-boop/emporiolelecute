
CREATE TABLE public.seo_unified_nexus_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  unified_nexus_score numeric,
  strategic_unification_score numeric,
  systemic_coherence_score numeric,
  operational_harmony_score numeric,
  semantic_alignment_score numeric,
  governance_stability_score numeric,
  resilience_unification_score numeric,
  continuity_alignment_score numeric,
  executive_clarity_score numeric,
  strategic_truth_score numeric,
  systemic_fragmentation_score numeric,
  strategic_instability_score numeric,
  semantic_divergence_score numeric,
  operational_disruption_score numeric,
  executive_entropy_score numeric,
  dominant_systemic_signal text,
  dominant_systemic_risk text,
  nexus_verdict text,
  notes text
);

CREATE INDEX idx_seo_unified_nexus_snapshots_created_at ON public.seo_unified_nexus_snapshots (created_at DESC);
CREATE INDEX idx_seo_unified_nexus_snapshots_score ON public.seo_unified_nexus_snapshots (unified_nexus_score DESC);
CREATE INDEX idx_seo_unified_nexus_snapshots_verdict ON public.seo_unified_nexus_snapshots (nexus_verdict);

ALTER TABLE public.seo_unified_nexus_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to unified nexus snapshots"
ON public.seo_unified_nexus_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
