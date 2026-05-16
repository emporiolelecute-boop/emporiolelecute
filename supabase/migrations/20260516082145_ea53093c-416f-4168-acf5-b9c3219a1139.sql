
CREATE TABLE public.seo_system_health_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date timestamptz NOT NULL DEFAULT now(),
  system_health_score numeric NOT NULL DEFAULT 0,
  sustainability_score numeric NOT NULL DEFAULT 0,
  execution_efficiency numeric NOT NULL DEFAULT 0,
  semantic_efficiency numeric NOT NULL DEFAULT 0,
  authority_efficiency numeric NOT NULL DEFAULT 0,
  operational_waste numeric NOT NULL DEFAULT 0,
  recovery_backlog numeric NOT NULL DEFAULT 0,
  strategic_alignment numeric NOT NULL DEFAULT 0,
  execution_focus numeric NOT NULL DEFAULT 0,
  volatility_pressure numeric NOT NULL DEFAULT 0,
  saturation_pressure numeric NOT NULL DEFAULT 0,
  semantic_fragmentation numeric NOT NULL DEFAULT 0,
  orphan_pressure numeric NOT NULL DEFAULT 0,
  content_decay_pressure numeric NOT NULL DEFAULT 0,
  competitive_pressure numeric NOT NULL DEFAULT 0,
  system_resilience numeric NOT NULL DEFAULT 0,
  cluster_stability numeric NOT NULL DEFAULT 0,
  execution_noise numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_sys_health_date ON public.seo_system_health_snapshots(snapshot_date DESC);
CREATE INDEX idx_seo_sys_health_score ON public.seo_system_health_snapshots(system_health_score DESC);
CREATE INDEX idx_seo_sys_sustain_score ON public.seo_system_health_snapshots(sustainability_score DESC);

ALTER TABLE public.seo_system_health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_system_health_snapshots"
  ON public.seo_system_health_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
