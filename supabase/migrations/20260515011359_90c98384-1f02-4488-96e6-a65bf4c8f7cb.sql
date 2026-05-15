
-- 1) Remover trigger antigo (será substituído por lógica atômica dentro da RPC)
DROP TRIGGER IF EXISTS trg_record_coupon_use ON public.orders;
DROP TRIGGER IF EXISTS record_coupon_use_trigger ON public.orders;

-- Procurar nome real do trigger
DO $$
DECLARE
  trg record;
BEGIN
  FOR trg IN
    SELECT tgname FROM pg_trigger
    WHERE tgrelid = 'public.orders'::regclass
      AND NOT tgisinternal
      AND tgname ILIKE '%coupon%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.orders', trg.tgname);
  END LOOP;
END $$;

-- 2) Substituir create_order_with_items para validar + marcar uso do cupom atomicamente
CREATE OR REPLACE FUNCTION public.create_order_with_items(_order jsonb, _items jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_order_id uuid;
  new_order_code text;
  item_count int;
  v_coupon_code text;
  v_subtotal numeric;
  v_discount numeric;
  c record;
BEGIN
  IF _order IS NULL OR _items IS NULL THEN
    RAISE EXCEPTION 'Missing order or items';
  END IF;

  item_count := jsonb_array_length(_items);
  IF item_count = 0 OR item_count > 200 THEN
    RAISE EXCEPTION 'Invalid items count';
  END IF;

  IF coalesce(length(_order->>'customer_name'),0) = 0
     OR coalesce(length(_order->>'customer_email'),0) = 0
     OR coalesce(length(_order->>'order_code'),0) = 0 THEN
    RAISE EXCEPTION 'Missing required customer fields';
  END IF;

  IF length(_order->>'customer_name')  > 200
     OR length(_order->>'customer_email') > 320
     OR length(coalesce(_order->>'customer_phone','')) > 40 THEN
    RAISE EXCEPTION 'Field too long';
  END IF;

  v_coupon_code := NULLIF(_order->>'coupon_code','');
  v_subtotal := coalesce((_order->>'subtotal')::numeric, 0);
  v_discount := coalesce((_order->>'discount_amount')::numeric, 0);

  -- Validação atômica do cupom com lock
  IF v_coupon_code IS NOT NULL THEN
    SELECT * INTO c FROM public.coupons
      WHERE upper(code) = upper(v_coupon_code)
      FOR UPDATE;
    IF NOT FOUND OR NOT c.is_active THEN
      RAISE EXCEPTION 'Cupom inválido ou inativo';
    END IF;
    IF c.valid_from IS NOT NULL AND now() < c.valid_from THEN
      RAISE EXCEPTION 'Cupom ainda não disponível';
    END IF;
    IF c.valid_until IS NOT NULL AND now() > c.valid_until THEN
      RAISE EXCEPTION 'Cupom expirado';
    END IF;
    IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
      RAISE EXCEPTION 'Cupom esgotado';
    END IF;
    IF v_subtotal < c.min_subtotal THEN
      RAISE EXCEPTION 'Valor mínimo não atingido para o cupom';
    END IF;
  END IF;

  INSERT INTO public.orders (
    order_code, customer_name, customer_email, customer_phone,
    address_cep, address_street, address_number, address_complement,
    address_neighborhood, address_city, address_state,
    shipping_method, shipping_company, shipping_days, shipping_price,
    subtotal, total, status, coupon_code, discount_amount
  ) VALUES (
    _order->>'order_code',
    _order->>'customer_name',
    _order->>'customer_email',
    _order->>'customer_phone',
    _order->>'address_cep',
    _order->>'address_street',
    _order->>'address_number',
    _order->>'address_complement',
    _order->>'address_neighborhood',
    _order->>'address_city',
    _order->>'address_state',
    coalesce(_order->>'shipping_method','A calcular via WhatsApp'),
    _order->>'shipping_company',
    NULLIF(_order->>'shipping_days','')::int,
    coalesce((_order->>'shipping_price')::numeric, 0),
    v_subtotal,
    coalesce((_order->>'total')::numeric, 0),
    coalesce(_order->>'status','pending'),
    v_coupon_code,
    v_discount
  )
  RETURNING id, order_code INTO new_order_id, new_order_code;

  INSERT INTO public.order_items (
    order_id, product_name, product_slug, product_image, quantity, unit_price, personalization
  )
  SELECT
    new_order_id,
    item->>'product_name',
    item->>'product_slug',
    item->>'product_image',
    coalesce((item->>'quantity')::int, 1),
    coalesce((item->>'unit_price')::numeric, 0),
    item->>'personalization'
  FROM jsonb_array_elements(_items) AS item;

  -- Marcar uso do cupom dentro da mesma transação
  IF v_coupon_code IS NOT NULL THEN
    INSERT INTO public.coupon_uses (coupon_id, order_id, subtotal, discount_applied)
    VALUES (c.id, new_order_id, v_subtotal, v_discount);

    UPDATE public.coupons SET used_count = used_count + 1, updated_at = now() WHERE id = c.id;
  END IF;

  RETURN jsonb_build_object('id', new_order_id, 'order_code', new_order_code);
END;
$function$;

-- 3) Trigger genérico para criar redirect 301 quando slug muda
CREATE OR REPLACE FUNCTION public.auto_create_redirect_on_slug_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_prefix text;
  v_from text;
  v_to text;
BEGIN
  IF OLD.slug IS NULL OR NEW.slug IS NULL OR OLD.slug = NEW.slug THEN
    RETURN NEW;
  END IF;

  v_prefix := CASE TG_TABLE_NAME
    WHEN 'products'   THEN '/produto/'
    WHEN 'categories' THEN '/categoria/'
    WHEN 'tags'       THEN '/tag/'
    WHEN 'occasions'  THEN '/ocasiao/'
    ELSE NULL
  END;

  IF v_prefix IS NULL THEN
    RETURN NEW;
  END IF;

  v_from := v_prefix || OLD.slug;
  v_to   := v_prefix || NEW.slug;

  -- Evitar duplicar
  INSERT INTO public.redirects (from_path, to_path, status_code, is_active, notes)
  VALUES (v_from, v_to, 301, true, 'Auto-gerado: slug alterado em ' || TG_TABLE_NAME)
  ON CONFLICT DO NOTHING;

  -- Atualizar redirects existentes que apontavam para o slug antigo
  UPDATE public.redirects SET to_path = v_to, updated_at = now()
   WHERE to_path = v_from AND is_active = true;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.auto_create_redirect_on_slug_change() FROM PUBLIC, anon, authenticated;

-- Anexar aos 4 alvos
DROP TRIGGER IF EXISTS trg_redirect_on_slug_products ON public.products;
CREATE TRIGGER trg_redirect_on_slug_products
  BEFORE UPDATE OF slug ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();

DROP TRIGGER IF EXISTS trg_redirect_on_slug_categories ON public.categories;
CREATE TRIGGER trg_redirect_on_slug_categories
  BEFORE UPDATE OF slug ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();

DROP TRIGGER IF EXISTS trg_redirect_on_slug_tags ON public.tags;
CREATE TRIGGER trg_redirect_on_slug_tags
  BEFORE UPDATE OF slug ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();

DROP TRIGGER IF EXISTS trg_redirect_on_slug_occasions ON public.occasions;
CREATE TRIGGER trg_redirect_on_slug_occasions
  BEFORE UPDATE OF slug ON public.occasions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();
