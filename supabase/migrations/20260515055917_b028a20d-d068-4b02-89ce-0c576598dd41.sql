
-- 1) Nova tabela imutável
CREATE TABLE IF NOT EXISTS public.admin_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  reviewed_by_email text,
  rejection_reason text,
  user_email_snapshot text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Garante 1 pendente por usuário
CREATE UNIQUE INDEX IF NOT EXISTS admin_access_requests_one_pending
  ON public.admin_access_requests(user_id) WHERE status = 'pending';

-- Índices de performance para a UI de auditoria
CREATE INDEX IF NOT EXISTS admin_access_requests_status_requested_idx
  ON public.admin_access_requests(status, requested_at DESC);
CREATE INDEX IF NOT EXISTS admin_access_requests_user_idx
  ON public.admin_access_requests(user_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS admin_access_requests_requested_at_idx
  ON public.admin_access_requests(requested_at DESC);
CREATE INDEX IF NOT EXISTS admin_access_requests_email_idx
  ON public.admin_access_requests(lower(user_email_snapshot));

-- Índice equivalente em role_promotion_audit (acelera auditoria)
CREATE INDEX IF NOT EXISTS role_promotion_audit_created_at_idx
  ON public.role_promotion_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS role_promotion_audit_target_email_idx
  ON public.role_promotion_audit(lower(target_email));

ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;

-- Admins podem ver tudo
DROP POLICY IF EXISTS "Admins view access requests" ON public.admin_access_requests;
CREATE POLICY "Admins view access requests"
  ON public.admin_access_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem aprovar/negar (UPDATE)
DROP POLICY IF EXISTS "Admins update access requests" ON public.admin_access_requests;
CREATE POLICY "Admins update access requests"
  ON public.admin_access_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Usuários veem somente as próprias
DROP POLICY IF EXISTS "Users view own access requests" ON public.admin_access_requests;
CREATE POLICY "Users view own access requests"
  ON public.admin_access_requests FOR SELECT
  USING (auth.uid() = user_id);

-- IMPORTANTE: nenhuma policy de INSERT (somente via RPC SECURITY DEFINER)
-- IMPORTANTE: nenhuma policy de DELETE (imutável)

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_admin_access_requests_updated_at ON public.admin_access_requests;
CREATE TRIGGER trg_admin_access_requests_updated_at
  BEFORE UPDATE ON public.admin_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Migrar pendentes existentes (preserva dados)
INSERT INTO public.admin_access_requests (user_id, status, requested_at, user_email_snapshot)
SELECT id, 'pending', COALESCE(access_requested_at, now()), email
FROM public.profiles
WHERE access_requested = true
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_access_requests r
    WHERE r.user_id = public.profiles.id AND r.status = 'pending'
  );

-- 3) Remover triggers/funções antigas que dependem de profiles.access_requested
DROP TRIGGER IF EXISTS trg_notify_admins_on_access_request ON public.profiles;
DROP TRIGGER IF EXISTS trg_guard_profiles_access_requested ON public.profiles;
DROP FUNCTION IF EXISTS public.guard_profiles_access_requested();

-- 4) Recriar RPC de solicitação para usar a nova tabela
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
  v_pending_id uuid;
  v_last timestamptz;
  v_new_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role = 'admin')
    INTO v_already_admin;
  IF v_already_admin THEN
    RETURN jsonb_build_object('success', true, 'already_admin', true);
  END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = v_uid;

  SELECT id INTO v_pending_id
    FROM public.admin_access_requests
   WHERE user_id = v_uid AND status = 'pending'
   LIMIT 1;
  IF v_pending_id IS NOT NULL THEN
    RAISE EXCEPTION 'Sua solicitação ainda está em análise pela administração.'
      USING ERRCODE = '23505', HINT = 'pending';
  END IF;

  SELECT max(requested_at) INTO v_last
    FROM public.admin_access_requests
   WHERE user_id = v_uid;
  IF v_last IS NOT NULL AND v_last > now() - interval '24 hours' THEN
    RAISE EXCEPTION 'Você já solicitou acesso recentemente. Tente novamente em 24 horas.'
      USING ERRCODE = '23505', HINT = 'rate_limited';
  END IF;

  INSERT INTO public.admin_access_requests (user_id, status, requested_at, user_email_snapshot)
  VALUES (v_uid, 'pending', now(), v_email)
  RETURNING id INTO v_new_id;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_uid, v_email, v_uid, v_email, 'admin', 'requested',
          'Solicitação de acesso registrada (request_id=' || v_new_id || ').');

  RETURN jsonb_build_object('success', true, 'request_id', v_new_id, 'requested_at', now());
END;
$$;

-- 5) promote_user_to_admin: marcar request como approved
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
    VALUES (v_caller, v_caller_email, _email, 'admin', 'error',
            'Usuário não encontrado. Peça que ele faça login pelo menos uma vez.');
    RETURN jsonb_build_object('success', false, 'error', 'Usuário não encontrado. Peça para ele fazer login uma vez antes.');
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_target_id AND role = 'admin')
    INTO v_already;

  -- Marca pendente como approved (se houver)
  UPDATE public.admin_access_requests
     SET status = 'approved',
         reviewed_at = now(),
         reviewed_by = v_caller,
         reviewed_by_email = v_caller_email,
         updated_at = now()
   WHERE user_id = v_target_id AND status = 'pending';

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

-- 6) reject_admin_request
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
  v_updated int;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
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

  UPDATE public.admin_access_requests
     SET status = 'denied',
         reviewed_at = now(),
         reviewed_by = v_caller,
         reviewed_by_email = v_caller_email,
         rejection_reason = trim(_reason),
         updated_at = now()
   WHERE user_id = _user_id AND status = 'pending';
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, _user_id, v_target_email, 'admin', 'rejected',
          'Solicitação reprovada. Motivo: ' || trim(_reason));

  RETURN jsonb_build_object('success', true, 'updated', v_updated);
END;
$$;

-- 7) Novo trigger de notificação no INSERT da nova tabela
CREATE OR REPLACE FUNCTION public.notify_admins_on_access_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_url  text;
  v_anon text;
  v_email text;
BEGIN
  IF NEW.status <> 'pending' THEN RETURN NEW; END IF;

  SELECT email INTO v_email FROM public.profiles WHERE id = NEW.user_id;

  BEGIN
    v_url  := current_setting('app.supabase_url', true);
    v_anon := current_setting('app.supabase_anon_key', true);
    IF v_url IS NOT NULL AND v_anon IS NOT NULL THEN
      PERFORM net.http_post(
        url     := v_url || '/functions/v1/notify-admins-new-request',
        headers := jsonb_build_object(
          'Content-Type','application/json',
          'Authorization','Bearer ' || v_anon
        ),
        body    := jsonb_build_object(
          'user_id',      NEW.user_id,
          'email',        coalesce(v_email, NEW.user_email_snapshot),
          'requested_at', NEW.requested_at,
          'request_id',   NEW.id
        )
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_access_request_insert ON public.admin_access_requests;
CREATE TRIGGER trg_notify_admins_on_access_request_insert
  AFTER INSERT ON public.admin_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_access_request();

-- 8) Por fim, remover as colunas legadas de profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS access_requested;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS access_requested_at;
