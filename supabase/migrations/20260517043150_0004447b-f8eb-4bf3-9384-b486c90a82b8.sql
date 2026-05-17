CREATE TABLE public.seo_civilization_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  civilization_score numeric NOT NULL DEFAULT 0,
  ecosystem_survivability numeric NOT NULL DEFAULT 0,
  semantic_continuity numeric NOT NULL DEFAULT 0,
  authority_legacy numeric NOT NULL DEFAULT 0,
  strategic_longevity numeric NOT NULL DEFAULT 0,
  operational_durability numeric NOT NULL DEFAULT 0,
  systemic_resilience numeric NOT NULL DEFAULT 0,
  semantic_stability numeric NOT NULL DEFAULT 0,
  execution_sustainability numeric NOT NULL DEFAULT 0,
  governance_stability numeric NOT NULL DEFAULT 0,
  adaptive_evolution numeric NOT NULL DEFAULT 0,
  entropy_absorption numeric NOT NULL DEFAULT 0,
  collapse_resistance numeric NOT NULL DEFAULT 0,
  recovery_persistence numeric NOT NULL DEFAULT 0,
  strategic_memory_strength numeric NOT NULL DEFAULT 0,
  continuity_depth numeric NOT NULL DEFAULT 0,
  semantic_coherence numeric NOT NULL DEFAULT 0,
  authority_distribution numeric NOT NULL DEFAULT 0,
  systemic_harmony numeric NOT NULL DEFAULT 0,
  long_term_compounding numeric NOT NULL DEFAULT 0,
  existential_durability numeric NOT NULL DEFAULT 0,
  civilization_integrity numeric NOT NULL DEFAULT 0,
  notes text
);

CREATE INDEX idx_civilization_snapshots_created_at ON public.seo_civilization_snapshots (created_at DESC);
CREATE INDEX idx_civilization_snapshots_score ON public.seo_civilization_snapshots (civilization_score);
CREATE INDEX idx_civilization_snapshots_survivability ON public.seo_civilization_snapshots (ecosystem_survivability);

ALTER TABLE public.seo_civilization_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_civilization_snapshots"
ON public.seo_civilization_snapshots
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));