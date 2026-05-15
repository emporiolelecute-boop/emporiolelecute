-- 1. Rate-limited request_admin_access
CREATE OR REPLACE FUNCTION public.request_admin_access()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_already_admin boolean;
  v_last_request timestamptz;
  v_pending boolean;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;

  -- Already admin? short-circuit
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role = 'admin')
    INTO v_already_admin;
  IF v_already_admin THEN
    RETURN jsonb_build_object('success', true, 'already_admin', true);
  END IF;

  SELECT email, access_requested, access_requested_at
    INTO v_email, v_pending, v_last_request
  FROM public.profiles WHERE id = v_uid;

  -- Pending request still open
  IF v_pending IS TRUE THEN
    RAISE EXCEPTION 'Sua solicitação ainda está em análise pela administração.'
      USING ERRCODE = '23505', HINT = 'pending';
  END IF;

  -- 24h rate-limit
  IF v_last_request IS NOT NULL AND v_last_request > now() - interval '24 hours' THEN
    RAISE EXCEPTION 'Você já solicitou acesso recentemente. Tente novamente em 24 horas.'
      USING ERRCODE = '23505', HINT = 'rate_limited';
  END IF;

  UPDATE public.profiles
     SET access_requested = true,
         access_requested_at = now(),
         updated_at = now()
   WHERE id = v_uid;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_uid, v_email, v_uid, v_email, 'admin', 'requested', 'Solicitação de acesso enviada pelo próprio usuário.');

  RETURN jsonb_build_object('success', true, 'requested_at', now());
END;
$$;

-- 2. Idempotent promotion: trigger only fires on real INSERT, so the existing
-- `promote_user_to_admin` already short-circuits when the role exists.
-- Patch it to also clear the access_requested flag on success.
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  IF v_already THEN
    -- idempotent: clear flag, audit noop, do NOT INSERT (so trigger doesn't fire)
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
$$;