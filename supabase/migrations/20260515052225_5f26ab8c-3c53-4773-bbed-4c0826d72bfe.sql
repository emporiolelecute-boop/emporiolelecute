
-- =========================================================
-- 1) Email/tracking audit table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tracking_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  order_code text NOT NULL,
  email_type text NOT NULL DEFAULT 'status_update',
  new_status text,
  recipient_email text,
  tracking_code text,
  tracking_carrier text,
  tracking_url text,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  triggered_by uuid,
  triggered_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tracking_email_log_order_idx ON public.tracking_email_log(order_id, created_at DESC);

ALTER TABLE public.tracking_email_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view tracking_email_log" ON public.tracking_email_log;
CREATE POLICY "Admins view tracking_email_log" ON public.tracking_email_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins insert tracking_email_log" ON public.tracking_email_log;
CREATE POLICY "Admins insert tracking_email_log" ON public.tracking_email_log
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 2) Enforce weight > 0 on new products (trigger; CHECK não funciona por causa de updates históricos)
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_product_weight_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND (NEW.weight IS NULL OR NEW.weight <= 0) THEN
    RAISE EXCEPTION 'Peso (kg) é obrigatório e deve ser maior que zero para novos produtos.'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_weight_required ON public.products;
CREATE TRIGGER trg_products_weight_required
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.enforce_product_weight_on_insert();

-- =========================================================
-- 3) Lock down EXECUTE on SECURITY DEFINER functions
-- =========================================================

-- Trigger-only functions: no public execute needed
REVOKE ALL ON FUNCTION public.update_updated_at_column()        FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user()                 FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_coupon_use()               FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_create_redirect_on_slug_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_role_change()              FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.audit_role_revocation()           FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_product_weight_on_insert() FROM PUBLIC, anon, authenticated;

-- has_role: needed by RLS policies (called as authenticated)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Authenticated-only admin RPCs
REVOKE ALL ON FUNCTION public.promote_user_to_admin(text)        FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.promote_user_to_admin(text)    TO authenticated;

REVOKE ALL ON FUNCTION public.reject_admin_request(uuid, text)   FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.reject_admin_request(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.request_admin_access()             FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.request_admin_access()         TO authenticated;

REVOKE ALL ON FUNCTION public.apply_default_weight(numeric)      FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.apply_default_weight(numeric)  TO authenticated;

-- Public RPCs (guest checkout / coupon validation): keep accessible
REVOKE ALL ON FUNCTION public.validate_coupon(text, numeric)     FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.create_order_with_items(jsonb, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.create_order_with_items(jsonb, jsonb) TO anon, authenticated;
