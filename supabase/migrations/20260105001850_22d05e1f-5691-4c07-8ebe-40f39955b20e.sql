-- Allow public access to payment_config setting
DROP POLICY IF EXISTS "Public can view payment settings" ON public.store_settings;

CREATE POLICY "Public can view payment settings" 
ON public.store_settings 
FOR SELECT 
USING (key = 'payment_config');