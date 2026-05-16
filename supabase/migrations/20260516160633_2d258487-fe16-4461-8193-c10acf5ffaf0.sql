CREATE TABLE public.seo_consciousness_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consciousness_type text NOT NULL,
  entity_scope text,
  awareness_score numeric NOT NULL DEFAULT 0,
  systemic_coherence numeric NOT NULL DEFAULT 0,
  semantic_consciousness numeric NOT NULL DEFAULT 0,
  operational_consciousness numeric NOT NULL DEFAULT 0,
  adaptive_consciousness numeric NOT NULL DEFAULT 0,
  cognitive_load numeric NOT NULL DEFAULT 0,
  cognitive_fatigue numeric NOT NULL DEFAULT 0,
  semantic_alignment numeric NOT NULL DEFAULT 0,
  strategic_clarity numeric NOT NULL DEFAULT 0,
  systemic_instability numeric NOT NULL DEFAULT 0,
  semantic_confusion numeric NOT NULL DEFAULT 0,
  evolutionary_coherence numeric NOT NULL DEFAULT 0,
  strategic_awareness numeric NOT NULL DEFAULT 0,
  intelligence_density numeric NOT NULL DEFAULT 0,
  entropy_pressure numeric NOT NULL DEFAULT 0,
  collapse_awareness numeric NOT NULL DEFAULT 0,
  resilience_awareness numeric NOT NULL DEFAULT 0,
  meta_intelligence_score numeric NOT NULL DEFAULT 0,
  consciousness_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  detected_signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  executive_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_scm_created_at ON public.seo_consciousness_memory (created_at DESC);
CREATE INDEX idx_scm_type ON public.seo_consciousness_memory (consciousness_type);
CREATE INDEX idx_scm_awareness ON public.seo_consciousness_memory (awareness_score);
CREATE INDEX idx_scm_meta ON public.seo_consciousness_memory (meta_intelligence_score);

ALTER TABLE public.seo_consciousness_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_consciousness_memory"
ON public.seo_consciousness_memory FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));