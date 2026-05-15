CREATE POLICY "Public can view instagram feed embed config"
  ON public.store_settings FOR SELECT
  USING (key = 'instagram_feed_embed_config');