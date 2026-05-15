
-- 1) Notification log table (filled by the edge function on each attempt)
CREATE TABLE IF NOT EXISTS public.access_request_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid,
  requester_email text,
  requested_at timestamptz,
  admin_count int NOT NULL DEFAULT 0,
  sent_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.access_request_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view access_request_notifications" ON public.access_request_notifications;
CREATE POLICY "Admins view access_request_notifications"
  ON public.access_request_notifications
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_arn_requester_email ON public.access_request_notifications (requester_email);
CREATE INDEX IF NOT EXISTS idx_arn_created_at ON public.access_request_notifications (created_at DESC);

-- 2) Trigger to BLOCK direct updates of profiles.access_requested.
--    Allowed only inside RPCs that set app.via_access_request_rpc = 'on'.
CREATE OR REPLACE FUNCTION public.guard_profiles_access_requested()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.access_requested IS DISTINCT FROM OLD.access_requested THEN
    IF coalesce(current_setting('app.via_access_request_rpc', true), '') <> 'on' THEN
      RAISE EXCEPTION 'Atualização direta de access_requested não é permitida. Use a função request_admin_access().'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profiles_access_requested ON public.profiles;
CREATE TRIGGER trg_guard_profiles_access_requested
BEFORE UPDATE OF access_requested ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profiles_access_requested();

-- 3) Re-create the controlled RPCs so they mark the bypass setting.
CREATE OR REPLACE FUNCTION public.request_admin_access()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_already_admin boolean;
  v_last_request timestamptz;
  v_pending boolean;
  v_url text;
  v_anon text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role = 'admin')
    INTO v_already_admin;
  IF v_already_admin THEN
    RETURN jsonb_build_object('success', true, 'already_admin', true);
  END IF;

  SELECT email, access_requested, access_requested_at
    INTO v_email, v_pending, v_last_request
  FROM public.profiles WHERE id = v_uid;

  IF v_pending IS TRUE THEN
    RAISE EXCEPTION 'Sua solicitação ainda está em análise pela administração.'
      USING ERRCODE = '23505', HINT = 'pending';
  END IF;

  IF v_last_request IS NOT NULL AND v_last_request > now() - interval '24 hours' THEN
    RAISE EXCEPTION 'Você já solicitou acesso recentemente. Tente novamente em 24 horas.'
      USING ERRCODE = '23505', HINT = 'rate_limited';
  END IF;

  PERFORM set_config('app.via_access_request_rpc', 'on', true);

  UPDATE public.profiles
     SET access_requested = true,
         access_requested_at = now(),
         updated_at = now()
   WHERE id = v_uid;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_uid, v_email, v_uid, v_email, 'admin', 'requested', 'Solicitação de acesso enviada pelo próprio usuário.');

  BEGIN
    v_url := current_setting('app.supabase_url', true);
    v_anon := current_setting('app.supabase_anon_key', true);
    IF v_url IS NOT NULL AND v_anon IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_url || '/functions/v1/notify-role-change',
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || v_anon),
        body := jsonb_build_object('event','access_requested','user_id', v_uid,'email', v_email)
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN jsonb_build_object('success', true, 'requested_at', now());
END;
$function$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_email text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_caller_email text;
  v_target_id uuid;
  v_already boolean;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;
  IF NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem promover usuários';
  END IF;

  SELECT email INTO v_caller_email FROM public.profiles WHERE id = v_caller;
  SELECT id INTO v_target_id FROM public.profiles WHERE lower(email) = lower(_email) LIMIT 1;

  IF v_target_id IS NULL THEN
    INSERT INTO public.role_promotion_audit
      (promoted_by, promoted_by_email, target_email, role, status, message)
    VALUES (v_caller, v_caller_email, _email, 'admin', 'error', 'Usuário não encontrado. Peça que ele faça login pelo menos uma vez.');
    RETURN jsonb_build_object('success', false, 'error', 'Usuário não encontrado. Peça para ele fazer login uma vez antes.');
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_target_id AND role = 'admin')
    INTO v_already;

  PERFORM set_config('app.via_access_request_rpc', 'on', true);

  IF v_already THEN
    UPDATE public.profiles
       SET access_requested = false, updated_at = now()
     WHERE id = v_target_id AND access_requested = true;

    INSERT INTO public.role_promotion_audit
      (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
    VALUES (v_caller, v_caller_email, v_target_id, _email, 'admin', 'noop', 'Usuário já era admin.');
    RETURN jsonb_build_object('success', true, 'already', true);
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_target_id, 'admin');

  UPDATE public.profiles
     SET access_requested = false, updated_at = now()
   WHERE id = v_target_id;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, v_target_id, _email, 'admin', 'success', NULL);

  RETURN jsonb_build_object('success', true, 'user_id', v_target_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_admin_request(_user_id uuid, _reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_caller_email text;
  v_target_email text;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;
  IF NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem reprovar solicitações';
  END IF;
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN
    RAISE EXCEPTION 'Informe um motivo de pelo menos 3 caracteres';
  END IF;

  SELECT email INTO v_caller_email FROM public.profiles WHERE id = v_caller;
  SELECT email INTO v_target_email FROM public.profiles WHERE id = _user_id;

  IF v_target_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  PERFORM set_config('app.via_access_request_rpc', 'on', true);

  UPDATE public.profiles
     SET access_requested = false, updated_at = now()
   WHERE id = _user_id;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, _user_id, v_target_email, 'admin', 'rejected',
          'Solicitação reprovada. Motivo: ' || trim(_reason));

  RETURN jsonb_build_object('success', true);
END;
$function$;
