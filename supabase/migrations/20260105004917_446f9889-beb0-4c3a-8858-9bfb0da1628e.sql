-- Add RLS policy for public access to seo_config
CREATE POLICY "Public can view SEO settings"
ON public.store_settings
FOR SELECT
USING (key = 'seo_config' OR key = 'last_sitemap_update');