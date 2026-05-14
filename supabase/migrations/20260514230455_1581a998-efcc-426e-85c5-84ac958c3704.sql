
CREATE POLICY "Public can view trust badges config"
ON public.store_settings FOR SELECT
USING (key = 'trust_badges_config');
