-- Fase 12 — Knowledge Graph + SEO Memory Layer
-- Nota: a tabela "seo_snapshots" já existe (snapshots SEMrush a nível de domínio).
-- Criamos "seo_entity_snapshots" para histórico por entidade.

CREATE TABLE IF NOT EXISTS public.seo_entity_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id   text NOT NULL,
  entity_slug text,
  entity_name text,
  authority_score        integer NOT NULL DEFAULT 0,
  maturity_score         integer NOT NULL DEFAULT 0,
  readiness_score        integer NOT NULL DEFAULT 0,
  topical_coverage       integer NOT NULL DEFAULT 0,
  internal_links_count   integer NOT NULL DEFAULT 0,
  reviews_count          integer NOT NULL DEFAULT 0,
  faq_count              integer NOT NULL DEFAULT 0,
  editorial_size         integer NOT NULL DEFAULT 0,
  semantic_connectivity  integer NOT NULL DEFAULT 0,
  orphan_risk            boolean NOT NULL DEFAULT false,
  cannibalization_risk   text    NOT NULL DEFAULT 'unknown',
  thin_content_risk      boolean NOT NULL DEFAULT false,
  metadata               jsonb   NOT NULL DEFAULT '{}'::jsonb,
  snapshot_date          timestamptz NOT NULL DEFAULT now(),
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_entity_snapshots_entity
  ON public.seo_entity_snapshots (entity_type, entity_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_entity_snapshots_date
  ON public.seo_entity_snapshots (snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_entity_snapshots_authority
  ON public.seo_entity_snapshots (authority_score DESC);

ALTER TABLE public.seo_entity_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_entity_snapshots"
  ON public.seo_entity_snapshots
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Execution memory: ações editoriais/SEO registradas
CREATE TABLE IF NOT EXISTS public.seo_execution_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id   text NOT NULL,
  entity_slug text,
  action_type text NOT NULL,       -- faq_added | editorial_expanded | links_added | review_added | hub_approved | thin_fixed | other
  description text,
  impact_score integer NOT NULL DEFAULT 0,
  performed_by uuid,
  performed_by_email text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_execution_log_entity
  ON public.seo_execution_log (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_execution_log_action
  ON public.seo_execution_log (action_type, created_at DESC);

ALTER TABLE public.seo_execution_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo_execution_log"
  ON public.seo_execution_log
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));