CREATE TABLE public.seo_strategic_reality_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  strategic_reality_score numeric,
  operational_truth_score numeric,
  semantic_grounding_score numeric,
  execution_credibility_score numeric,
  sustainability_realism_score numeric,
  resilience_realism_score numeric,
  systemic_truth_score numeric,
  long_term_viability_score numeric,
  strategic_authenticity_score numeric,
  signal_clarity_score numeric,
  illusion_risk_score numeric,
  strategic_self_deception_score numeric,
  semantic_distortion_score numeric,
  operational_fiction_score numeric,
  survivability_gap_score numeric,
  dominant_truth text,
  dominant_distortion text,
  reality_verdict text,
  notes text
);

CREATE INDEX idx_ssrs_created_at ON public.seo_strategic_reality_snapshots (created_at DESC);
CREATE INDEX idx_ssrs_reality_score ON public.seo_strategic_reality_snapshots (strategic_reality_score DESC);
CREATE INDEX idx_ssrs_verdict ON public.seo_strategic_reality_snapshots (reality_verdict);

ALTER TABLE public.seo_strategic_reality_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view strategic reality snapshots"
  ON public.seo_strategic_reality_snapshots FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert strategic reality snapshots"
  ON public.seo_strategic_reality_snapshots FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update strategic reality snapshots"
  ON public.seo_strategic_reality_snapshots FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete strategic reality snapshots"
  ON public.seo_strategic_reality_snapshots FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));