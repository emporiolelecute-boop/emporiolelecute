
-- 1) REVOKE EXECUTE on SECURITY DEFINER functions and grant minimal scopes
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated;

REVOKE ALL ON FUNCTION public.request_admin_access() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_admin_access() TO authenticated;

REVOKE ALL ON FUNCTION public.validate_coupon(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.create_order_with_items(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, jsonb) TO anon, authenticated;

-- Trigger-only functions: callable solely by Postgres triggers
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_coupon_use() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_create_redirect_on_slug_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_role_change() FROM PUBLIC, anon, authenticated;

-- 2) Tighten permissive INSERT policies (telemetry tables)
DROP POLICY IF EXISTS "Anyone can insert ig_embed_failures" ON public.instagram_embed_failures;
CREATE POLICY "Anyone can insert ig_embed_failures"
  ON public.instagram_embed_failures FOR INSERT TO anon, authenticated
  WITH CHECK (
    coalesce(length(route), 0) <= 500
    AND coalesce(length(post_url), 0) <= 1000
    AND coalesce(length(user_agent), 0) <= 1000
    AND coalesce(ms_to_fallback, 0) BETWEEN 0 AND 600000
  );

DROP POLICY IF EXISTS "Anyone can insert stale_bundle_logs" ON public.stale_bundle_logs;
CREATE POLICY "Anyone can insert stale_bundle_logs"
  ON public.stale_bundle_logs FOR INSERT TO anon, authenticated
  WITH CHECK (
    coalesce(length(route), 0) <= 500
    AND coalesce(length(message), 0) <= 2000
    AND coalesce(length(stack), 0) <= 8000
    AND coalesce(length(user_agent), 0) <= 1000
  );

-- 3) Storage: drop broad listing policies for product-images.
-- Public bucket continues serving files via /object/public URLs (RLS bypassed for public buckets).
DROP POLICY IF EXISTS "Authenticated read product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read product-images by direct path" ON storage.objects;

-- 4) Audit revocation of admin role
CREATE OR REPLACE FUNCTION public.audit_role_revocation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_caller_email text;
  v_target_email text;
BEGIN
  IF OLD.role <> 'admin' THEN
    RETURN OLD;
  END IF;
  SELECT email INTO v_caller_email FROM public.profiles WHERE id = v_caller;
  SELECT email INTO v_target_email FROM public.profiles WHERE id = OLD.user_id;
  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_caller, v_caller_email, OLD.user_id, coalesce(v_target_email, '(desconhecido)'),
          'admin', 'revoked', 'Papel admin removido.');
  RETURN OLD;
END;
$$;
REVOKE ALL ON FUNCTION public.audit_role_revocation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_audit_role_revocation ON public.user_roles;
CREATE TRIGGER trg_audit_role_revocation
  AFTER DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_revocation();

-- Allow admins to delete role_promotion_audit cleanups? (leave append-only)
-- 5) Allow admin INSERT on audit so triggers always succeed (kept as definer; no policy change needed since SECURITY DEFINER bypasses RLS).

-- 6) Notification: extend request_admin_access to dispatch best-effort email to admins
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

  UPDATE public.profiles
     SET access_requested = true,
         access_requested_at = now(),
         updated_at = now()
   WHERE id = v_uid;

  INSERT INTO public.role_promotion_audit
    (promoted_by, promoted_by_email, target_user_id, target_email, role, status, message)
  VALUES (v_uid, v_email, v_uid, v_email, 'admin', 'requested', 'Solicitação de acesso enviada pelo próprio usuário.');

  -- Best-effort: notify admins via edge function
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
$$;
REVOKE ALL ON FUNCTION public.request_admin_access() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_admin_access() TO authenticated;
