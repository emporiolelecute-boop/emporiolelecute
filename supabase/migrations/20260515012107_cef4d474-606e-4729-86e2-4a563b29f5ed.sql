
-- Histórico de sincronizações do Instagram
CREATE TABLE IF NOT EXISTS public.instagram_sync_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'manual', -- manual | scheduled | validate | preview
  action text NOT NULL DEFAULT 'sync',
  status text NOT NULL DEFAULT 'success', -- success | error | skipped
  synced_count integer NOT NULL DEFAULT 0,
  selected_count integer,
  error_message text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  triggered_by uuid
);

ALTER TABLE public.instagram_sync_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage instagram_sync_history"
  ON public.instagram_sync_history FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_ig_sync_history_ran_at ON public.instagram_sync_history(ran_at DESC);

-- Garantir extensões
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
