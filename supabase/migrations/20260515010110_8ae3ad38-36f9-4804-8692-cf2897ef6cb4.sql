-- Linter fix: revoke EXECUTE on internal trigger/helper SECURITY DEFINER functions
-- These are called only by triggers/handlers, never by the public API.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_coupon_use() FROM PUBLIC, anon, authenticated;