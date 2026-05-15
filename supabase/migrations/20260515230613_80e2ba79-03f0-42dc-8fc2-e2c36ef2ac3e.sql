CREATE OR REPLACE FUNCTION public.cleanup_seo_url_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.seo_url_status
  WHERE checked_at < (now() - interval '180 days');
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_seo_url_status() FROM PUBLIC, anon, authenticated;

SELECT cron.schedule(
  'cleanup-seo-url-status-daily',
  '0 4 * * *',
  $$ SELECT public.cleanup_seo_url_status(); $$
);