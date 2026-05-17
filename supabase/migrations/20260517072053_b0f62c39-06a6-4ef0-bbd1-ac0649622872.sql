ALTER TABLE public.seo_system_finalization_snapshots
  ADD COLUMN IF NOT EXISTS signal_efficiency_score INTEGER,
  ADD COLUMN IF NOT EXISTS telemetry_density_score INTEGER,
  ADD COLUMN IF NOT EXISTS operational_drag_score INTEGER,
  ADD COLUMN IF NOT EXISTS governance_overhead_score INTEGER,
  ADD COLUMN IF NOT EXISTS dashboard_noise_score INTEGER,
  ADD COLUMN IF NOT EXISTS dependency_complexity_score INTEGER,
  ADD COLUMN IF NOT EXISTS strategic_friction_score INTEGER,
  ADD COLUMN IF NOT EXISTS simplification_readiness_score INTEGER,
  ADD COLUMN IF NOT EXISTS scalability_score INTEGER;