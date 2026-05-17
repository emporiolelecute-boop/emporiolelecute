
CREATE TABLE public.seo_continuum_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  strategic_continuum_score numeric,
  continuity_strength_score numeric,
  operational_persistence_score numeric,
  semantic_continuity_score numeric,
  authority_continuity_score numeric,
  resilience_continuity_score numeric,
  execution_continuity_score numeric,
  strategic_longevity_score numeric,
  entropy_resistance_score numeric,
  systemic_persistence_score numeric,
  continuity_break_risk_score numeric,
  entropy_accumulation_score numeric,
  execution_decay_score numeric,
  semantic_instability_score numeric,
  authority_fragmentation_score numeric,
  dominant_continuity_signal text,
  dominant_decay_signal text,
  continuum_verdict text,
  notes text
);

CREATE INDEX idx_seo_continuum_snapshots_created_at ON public.seo_continuum_snapshots (created_at DESC);
CREATE INDEX idx_seo_continuum_snapshots_score ON public.seo_continuum_snapshots (strategic_continuum_score DESC);
CREATE INDEX idx_seo_continuum_snapshots_verdict ON public.seo_continuum_snapshots (continuum_verdict);

ALTER TABLE public.seo_continuum_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to continuum snapshots"
ON public.seo_continuum_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
