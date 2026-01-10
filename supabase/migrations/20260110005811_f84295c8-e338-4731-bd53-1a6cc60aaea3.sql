-- Drop the overly permissive policies on orders and order_items
DROP POLICY IF EXISTS "Anyone can view orders by code" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;

-- Create restrictive policies - only admins can view orders directly
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create restrictive policies - only admins can view order items directly
CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));