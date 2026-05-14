
-- 1. REDIRECTS
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  status_code integer NOT NULL DEFAULT 301,
  is_active boolean NOT NULL DEFAULT true,
  hits integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active redirects" ON public.redirects
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage redirects" ON public.redirects
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_redirects_updated_at BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. COUPONS
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  min_subtotal numeric NOT NULL DEFAULT 0,
  valid_from timestamptz,
  valid_until timestamptz,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.coupon_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  subtotal numeric,
  discount_applied numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view coupon uses" ON public.coupon_uses
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. SEO noindex per product
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_noindex boolean NOT NULL DEFAULT false;

-- 4. validate_coupon RPC (SECURITY DEFINER, public)
CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _subtotal numeric)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c record;
  discount numeric := 0;
BEGIN
  SELECT * INTO c FROM public.coupons WHERE upper(code) = upper(_code) LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom não encontrado');
  END IF;
  IF NOT c.is_active THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom inativo');
  END IF;
  IF c.valid_from IS NOT NULL AND now() < c.valid_from THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom ainda não disponível');
  END IF;
  IF c.valid_until IS NOT NULL AND now() > c.valid_until THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom expirado');
  END IF;
  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom esgotado');
  END IF;
  IF _subtotal < c.min_subtotal THEN
    RETURN jsonb_build_object('valid', false, 'error',
      'Valor mínimo de R$ ' || c.min_subtotal::text || ' não atingido');
  END IF;
  IF c.discount_type = 'percent' THEN
    discount := round((_subtotal * c.discount_value / 100)::numeric, 2);
  ELSE
    discount := least(c.discount_value, _subtotal);
  END IF;
  RETURN jsonb_build_object(
    'valid', true,
    'coupon_id', c.id,
    'code', c.code,
    'discount_type', c.discount_type,
    'discount_value', c.discount_value,
    'discount_applied', discount,
    'description', c.description
  );
END;
$$;

-- 5. Public-readable settings keys for tracking + robots
DROP POLICY IF EXISTS "Public can view tracking config" ON public.store_settings;
CREATE POLICY "Public can view tracking config" ON public.store_settings
  FOR SELECT USING (key = 'tracking_config');

DROP POLICY IF EXISTS "Public can view robots config" ON public.store_settings;
CREATE POLICY "Public can view robots config" ON public.store_settings
  FOR SELECT USING (key = 'robots_config');
