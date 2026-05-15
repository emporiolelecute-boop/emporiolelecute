
CREATE OR REPLACE FUNCTION public.reject_admin_request(_user_id uuid, _reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  UPDATE public.profiles
     SET access_requested = false, updated_at = now()
   WHERE id = _user_id;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, _user_id, v_target_email, 'admin', 'rejected',
          'Solicitação reprovada. Motivo: ' || trim(_reason));

  RETURN jsonb_build_object('success', true);
END;
$$;
REVOKE ALL ON FUNCTION public.reject_admin_request(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reject_admin_request(uuid, text) TO authenticated;
