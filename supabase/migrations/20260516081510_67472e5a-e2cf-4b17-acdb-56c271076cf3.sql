
CREATE TABLE public.seo_operational_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date timestamptz NOT NULL DEFAULT now(),
  operational_score numeric NOT NULL DEFAULT 0,
  execution_capacity numeric NOT NULL DEFAULT 0,
  editorial_velocity numeric NOT NULL DEFAULT 0,
  semantic_velocity numeric NOT NULL DEFAULT 0,
  authority_velocity numeric NOT NULL DEFAULT 0,
  recovery_capacity numeric NOT NULL DEFAULT 0,
  risk_pressure numeric NOT NULL DEFAULT 0,
  fragmentation_score numeric NOT NULL DEFAULT 0,
  operational_debt numeric NOT NULL DEFAULT 0,
  editorial_backlog int NOT NULL DEFAULT 0,
  thin_content_entities int NOT NULL DEFAULT 0,
  orphan_entities int NOT NULL DEFAULT 0,
  blocked_entities int NOT NULL DEFAULT 0,
  high_potential_entities int NOT NULL DEFAULT 0,
  strong_clusters int NOT NULL DEFAULT 0,
  weak_clusters int NOT NULL DEFAULT 0,
  collapsing_clusters int NOT NULL DEFAULT 0,
  saturation_pressure numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_op_snap_date ON public.seo_operational_snapshots(snapshot_date DESC);
CREATE INDEX idx_seo_op_snap_score ON public.seo_operational_snapshots(operational_score DESC);

ALTER TABLE public.seo_operational_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_operational_snapshots"
  ON public.seo_operational_snapshots
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
