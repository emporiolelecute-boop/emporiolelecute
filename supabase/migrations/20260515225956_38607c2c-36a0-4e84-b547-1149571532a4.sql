-- Daily cleanup of telemetry logs older than 90 days
CREATE OR REPLACE FUNCTION public.cleanup_stale_bundle_logs()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  DELETE FROM public.stale_bundle_logs
   WHERE occurred_at < now() - interval '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN jsonb_build_object('deleted', v_deleted, 'ran_at', now());
END;
$$;

-- Schedule daily at 03:30 UTC; replace if it already exists
DO $$
DECLARE
  v_job_id bigint;
BEGIN
  SELECT jobid INTO v_job_id FROM cron.job WHERE jobname = 'cleanup-stale-bundle-logs';
  IF v_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(v_job_id);
  END IF;
  PERFORM cron.schedule(
    'cleanup-stale-bundle-logs',
    '30 3 * * *',
    $cron$ SELECT public.cleanup_stale_bundle_logs(); $cron$
  );
END $$;