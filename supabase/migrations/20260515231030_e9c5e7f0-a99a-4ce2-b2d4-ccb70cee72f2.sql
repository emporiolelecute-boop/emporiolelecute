CREATE TABLE IF NOT EXISTS public.telemetry_alert_state (
  id text PRIMARY KEY,
  last_alert_at timestamptz,
  last_count integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telemetry_alert_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view telemetry alert state"
  ON public.telemetry_alert_state FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.telemetry_alert_state (id) VALUES ('error_spike')
  ON CONFLICT (id) DO NOTHING;