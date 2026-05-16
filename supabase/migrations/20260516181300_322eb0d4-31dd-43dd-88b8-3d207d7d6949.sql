CREATE TABLE public.seo_executive_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  operational_state numeric NOT NULL DEFAULT 0,
  strategic_alignment numeric NOT NULL DEFAULT 0,
  semantic_efficiency numeric NOT NULL DEFAULT 0,
  execution_clarity numeric NOT NULL DEFAULT 0,
  authority_resilience numeric NOT NULL DEFAULT 0,
  systemic_entropy numeric NOT NULL DEFAULT 0,
  cognitive_pressure numeric NOT NULL DEFAULT 0,
  strategic_noise numeric NOT NULL DEFAULT 0,
  semantic_decay numeric NOT NULL DEFAULT 0,
  sustainability_score numeric NOT NULL DEFAULT 0,
  adaptability_score numeric NOT NULL DEFAULT 0,
  recovery_readiness numeric NOT NULL DEFAULT 0,
  fragmentation_score numeric NOT NULL DEFAULT 0,
  execution_fatigue numeric NOT NULL DEFAULT 0,
  compounding_capacity numeric NOT NULL DEFAULT 0,
  ecosystem_health numeric NOT NULL DEFAULT 0,
  existential_stability numeric NOT NULL DEFAULT 0,
  predictive_confidence numeric NOT NULL DEFAULT 0,
  long_term_survival numeric NOT NULL DEFAULT 0,
  notes text,
  created_by uuid,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_seo_exec_snap_created ON public.seo_executive_snapshots (created_at DESC);
CREATE INDEX idx_seo_exec_snap_health ON public.seo_executive_snapshots (ecosystem_health);
CREATE INDEX idx_seo_exec_snap_sustain ON public.seo_executive_snapshots (sustainability_score);

ALTER TABLE public.seo_executive_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_executive_snapshots"
ON public.seo_executive_snapshots
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));