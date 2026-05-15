-- Cooldown / rate-limit guard for resending order status e-mails
CREATE OR REPLACE FUNCTION public.check_resend_email_cooldown(_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_last  timestamptz;
  v_count int;
  v_cooldown_seconds int := 60;
  v_hourly_limit int := 10;
  v_remaining int;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;
  IF NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem reenviar e-mails';
  END IF;

  SELECT max(created_at) INTO v_last
    FROM public.tracking_email_log
   WHERE order_id = _order_id
     AND email_type = 'resend_status';

  IF v_last IS NOT NULL AND v_last > now() - make_interval(secs => v_cooldown_seconds) THEN
    v_remaining := v_cooldown_seconds - extract(epoch FROM (now() - v_last))::int;
    RAISE EXCEPTION 'Aguarde % segundos antes de reenviar este e-mail.', GREATEST(v_remaining,1)
      USING ERRCODE = '23505', HINT = 'cooldown';
  END IF;

  SELECT count(*) INTO v_count
    FROM public.tracking_email_log
   WHERE triggered_by = v_caller
     AND email_type = 'resend_status'
     AND created_at > now() - interval '1 hour';

  IF v_count >= v_hourly_limit THEN
    RAISE EXCEPTION 'Limite de % reenvios por hora atingido. Tente mais tarde.', v_hourly_limit
      USING ERRCODE = '23505', HINT = 'rate_limited';
  END IF;

  RETURN jsonb_build_object('ok', true, 'cooldown_seconds', v_cooldown_seconds, 'hourly_limit', v_hourly_limit);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_resend_email_cooldown(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_resend_email_cooldown(uuid) TO authenticated;

-- Auto-fill auditing columns when admins insert resend_status logs
CREATE OR REPLACE FUNCTION public.tracking_email_log_set_actor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF NEW.triggered_by IS NULL THEN
    NEW.triggered_by := auth.uid();
  END IF;
  IF NEW.triggered_by_email IS NULL AND NEW.triggered_by IS NOT NULL THEN
    SELECT email INTO v_email FROM public.profiles WHERE id = NEW.triggered_by;
    NEW.triggered_by_email := v_email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_tracking_email_log_actor ON public.tracking_email_log;
CREATE TRIGGER trg_tracking_email_log_actor
BEFORE INSERT ON public.tracking_email_log
FOR EACH ROW EXECUTE FUNCTION public.tracking_email_log_set_actor();

CREATE INDEX IF NOT EXISTS idx_tracking_email_log_order_created
  ON public.tracking_email_log (order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_email_log_status_created
  ON public.tracking_email_log (status, created_at DESC);