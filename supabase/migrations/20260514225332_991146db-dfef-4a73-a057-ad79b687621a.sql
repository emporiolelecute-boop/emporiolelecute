
-- Remove anonymous INSERT policies on orders/order_items; route through SECURITY DEFINER function
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

CREATE OR REPLACE FUNCTION public.create_order_with_items(
  _order jsonb,
  _items jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id uuid;
  new_order_code text;
  item_count int;
BEGIN
  -- Basic validation
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

  INSERT INTO public.orders (
    order_code, customer_name, customer_email, customer_phone,
    address_cep, address_street, address_number, address_complement,
    address_neighborhood, address_city, address_state,
    shipping_method, shipping_company, shipping_days, shipping_price,
    subtotal, total, status
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
    coalesce((_order->>'subtotal')::numeric, 0),
    coalesce((_order->>'total')::numeric, 0),
    coalesce(_order->>'status','pending')
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

  RETURN jsonb_build_object('id', new_order_id, 'order_code', new_order_code);
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_items(jsonb, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(jsonb, jsonb) TO anon, authenticated;
