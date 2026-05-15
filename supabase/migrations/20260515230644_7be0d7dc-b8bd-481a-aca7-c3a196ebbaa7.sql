CREATE OR REPLACE FUNCTION public.list_cron_jobs()
RETURNS TABLE (
  jobid bigint,
  jobname text,
  schedule text,
  command text,
  active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, cron
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
    SELECT j.jobid, j.jobname::text, j.schedule::text, j.command::text, j.active
    FROM cron.job j
    ORDER BY j.jobid;
END;
$$;

REVOKE ALL ON FUNCTION public.list_cron_jobs() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_cron_jobs() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_cron_runs(p_limit integer DEFAULT 50)
RETURNS TABLE (
  jobid bigint,
  runid bigint,
  job_pid integer,
  database text,
  username text,
  command text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, cron
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
    SELECT r.jobid, r.runid, r.job_pid, r.database::text, r.username::text,
           r.command::text, r.status::text, r.return_message::text,
           r.start_time, r.end_time
    FROM cron.job_run_details r
    ORDER BY r.start_time DESC
    LIMIT GREATEST(1, LEAST(p_limit, 500));
END;
$$;

REVOKE ALL ON FUNCTION public.list_cron_runs(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_cron_runs(integer) TO authenticated;