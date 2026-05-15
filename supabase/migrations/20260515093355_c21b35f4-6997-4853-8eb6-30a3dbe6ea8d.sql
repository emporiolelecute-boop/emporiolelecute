-- Revoke EXECUTE from PUBLIC/anon/authenticated on internal functions.
-- These should only run via triggers, server-side admin RPCs, or service-role.

-- Trigger functions (never called directly by clients)
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_coupon_use() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_create_redirect_on_slug_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_role_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_role_revocation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_product_weight_on_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tracking_email_log_set_actor() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_access_request() FROM PUBLIC, anon, authenticated;

-- Admin-only RPCs: keep callable only by authenticated (the function itself checks has_role)
REVOKE EXECUTE ON FUNCTION public.reject_admin_request(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_default_weight(numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_admin_audit_timeline(text, text, text, timestamptz, timestamptz, text, text, integer, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_audit_anomalies(integer, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.refresh_admin_audit_timeline() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_resend_email_cooldown(uuid) FROM PUBLIC, anon;

-- has_role: used in RLS policies via SQL, but should not be exposed for direct RPC by anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;