CREATE TABLE public.seo_adaptive_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_type text NOT NULL,
  entity_type text,
  entity_id uuid,
  adaptive_score numeric NOT NULL DEFAULT 0,
  resilience_score numeric NOT NULL DEFAULT 0,
  saturation_score numeric NOT NULL DEFAULT 0,
  volatility_score numeric NOT NULL DEFAULT 0,
  sustainability_score numeric NOT NULL DEFAULT 0,
  semantic_entropy numeric NOT NULL DEFAULT 0,
  strategic_pressure numeric NOT NULL DEFAULT 0,
  collapse_risk numeric NOT NULL DEFAULT 0,
  recovery_potential numeric NOT NULL DEFAULT 0,
  compounding_score numeric NOT NULL DEFAULT 0,
  adaptation_velocity numeric NOT NULL DEFAULT 0,
  semantic_drift numeric NOT NULL DEFAULT 0,
  dependency_risk numeric NOT NULL DEFAULT 0,
  intelligence_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  detected_patterns jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_adaptive_memory_created_at ON public.seo_adaptive_memory(created_at DESC);
CREATE INDEX idx_seo_adaptive_memory_memory_type ON public.seo_adaptive_memory(memory_type);
CREATE INDEX idx_seo_adaptive_memory_entity_type ON public.seo_adaptive_memory(entity_type);
CREATE INDEX idx_seo_adaptive_memory_adaptive_score ON public.seo_adaptive_memory(adaptive_score DESC);

ALTER TABLE public.seo_adaptive_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_adaptive_memory"
ON public.seo_adaptive_memory
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));