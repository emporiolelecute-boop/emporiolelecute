-- Expand combination_pages_registry for Discovery Engine
ALTER TABLE public.combination_pages_registry
  ADD COLUMN IF NOT EXISTS generated_slug text,
  ADD COLUMN IF NOT EXISTS canonical_path text,
  ADD COLUMN IF NOT EXISTS products_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quality_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confidence_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thin_content_risk boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_discovered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS discovery_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS discovery_status text NOT NULL DEFAULT 'candidate',
  ADD COLUMN IF NOT EXISTS discovery_type text;

CREATE INDEX IF NOT EXISTS idx_cpr_generated_slug ON public.combination_pages_registry(generated_slug);
CREATE INDEX IF NOT EXISTS idx_cpr_quality_score ON public.combination_pages_registry(quality_score);
CREATE INDEX IF NOT EXISTS idx_cpr_confidence_score ON public.combination_pages_registry(confidence_score);
CREATE INDEX IF NOT EXISTS idx_cpr_auto_discovered ON public.combination_pages_registry(auto_discovered);
CREATE INDEX IF NOT EXISTS idx_cpr_discovery_status ON public.combination_pages_registry(discovery_status);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_cpr_updated_at ON public.combination_pages_registry;
CREATE TRIGGER trg_cpr_updated_at
  BEFORE UPDATE ON public.combination_pages_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
