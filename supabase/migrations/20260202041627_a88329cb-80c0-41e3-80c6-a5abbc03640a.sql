-- Add RLS policy for merchant feed config (read-only for public access)
CREATE POLICY "Public can view merchant feed config" 
ON public.store_settings 
FOR SELECT 
USING (key = 'merchant_feed_config' OR key = 'last_sitemap_submission');

-- Enable pg_cron and pg_net extensions for scheduled sitemap submission
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;