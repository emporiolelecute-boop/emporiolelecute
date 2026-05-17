CREATE TABLE IF NOT EXISTS public.admin_usage_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  version text NOT NULL DEFAULT 'p2.4',
  client_ts timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  total_events integer NOT NULL DEFAULT 0,
  payload jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_usage_aggregates_received_idx
  ON public.admin_usage_aggregates (received_at DESC);
CREATE INDEX IF NOT EXISTS admin_usage_aggregates_session_idx
  ON public.admin_usage_aggregates (session_id);

ALTER TABLE public.admin_usage_aggregates ENABLE ROW LEVEL SECURITY;

-- Only admins can read. Inserts come exclusively from the edge function (service role bypasses RLS).
CREATE POLICY "Admins can read admin usage aggregates"
  ON public.admin_usage_aggregates
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));