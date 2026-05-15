-- 1. Add request flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS access_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS access_requested_at timestamptz;

-- 2. RPC: any authenticated user can request admin access for themselves
CREATE OR REPLACE FUNCTION public.request_admin_access()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = v_uid;

  UPDATE public.profiles
     SET access_requested = true,
         access_requested_at = now(),
         updated_at = now()
   WHERE id = v_uid;

  -- Audit entry (status=requested) for visibility in /admin/usuarios
  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_uid, v_email, v_uid, v_email, 'admin', 'requested', 'Solicitação de acesso enviada pelo próprio usuário.');

  RETURN jsonb_build_object('success', true, 'requested_at', now());
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_admin_access() TO authenticated;

-- 3. Trigger: notify edge function when a user becomes admin
CREATE OR REPLACE FUNCTION public.notify_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_url text;
  v_anon text;
BEGIN
  IF NEW.role <> 'admin' THEN
    RETURN NEW;
  END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = NEW.user_id;

  -- Best-effort: invoke notify-role-change edge function via pg_net if available.
  -- Failures are swallowed so role insertion never fails because of mail.
  BEGIN
    v_url := current_setting('app.supabase_url', true);
    v_anon := current_setting('app.supabase_anon_key', true);
    IF v_url IS NOT NULL AND v_anon IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_url || '/functions/v1/notify-role-change',
        headers := jsonb_build_object(
          'Content-Type','application/json',
          'Authorization','Bearer ' || v_anon
        ),
        body := jsonb_build_object(
          'user_id', NEW.user_id,
          'email', v_email,
          'role', NEW.role::text,
          'event', 'role_granted'
        )
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- ignore: notification is best-effort
    NULL;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_roles_notify ON public.user_roles;
CREATE TRIGGER trg_user_roles_notify
AFTER INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.notify_role_change();