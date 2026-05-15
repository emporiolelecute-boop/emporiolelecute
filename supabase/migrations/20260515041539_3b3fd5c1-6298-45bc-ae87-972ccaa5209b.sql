CREATE TABLE IF NOT EXISTS public.role_promotion_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoted_by uuid,
  promoted_by_email text,
  target_user_id uuid,
  target_email text NOT NULL,
  role text NOT NULL,
  status text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.role_promotion_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role audit"
  ON public.role_promotion_audit FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

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

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = v_target_id AND role = 'admin'
  ) INTO v_already;

  IF v_already THEN
    INSERT INTO public.role_promotion_audit
      (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
    VALUES (v_caller, v_caller_email, v_target_id, _email, 'admin', 'noop', 'Usuário já era admin.');
    RETURN jsonb_build_object('success', true, 'already', true);
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_target_id, 'admin');

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, v_target_id, _email, 'admin', 'success', NULL);

  RETURN jsonb_build_object('success', true, 'user_id', v_target_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated;