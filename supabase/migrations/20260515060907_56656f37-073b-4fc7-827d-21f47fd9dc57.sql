-- Materialized view consolidating audit sources
DROP MATERIALIZED VIEW IF EXISTS public.admin_audit_timeline;

CREATE MATERIALIZED VIEW public.admin_audit_timeline AS
SELECT
  'audit'::text                AS source,
  id                           AS event_id,
  created_at,
  status,
  role,
  target_user_id,
  target_email,
  promoted_by_email            AS actor_email,
  message                      AS details
FROM public.role_promotion_audit
UNION ALL
SELECT
  'request'::text,
  id,
  requested_at                 AS created_at,
  status,
  'admin'::text                AS role,
  user_id                      AS target_user_id,
  user_email_snapshot          AS target_email,
  reviewed_by_email            AS actor_email,
  COALESCE(rejection_reason,
    CASE status
      WHEN 'pending'  THEN 'Solicitação pendente'
      WHEN 'approved' THEN 'Solicitação aprovada'
      WHEN 'denied'   THEN 'Solicitação reprovada'
      ELSE status
    END)                       AS details
FROM public.admin_access_requests
UNION ALL
SELECT
  'notification'::text,
  id,
  created_at,
  status,
  'admin'::text                AS role,
  requester_id                 AS target_user_id,
  requester_email              AS target_email,
  NULL::text                   AS actor_email,
  COALESCE(
    error_message,
    'Notificação enviada para ' || sent_count::text || '/' || admin_count::text || ' admin(s)'
  )                            AS details
FROM public.access_request_notifications;

-- Required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX admin_audit_timeline_pk
  ON public.admin_audit_timeline(source, event_id);
CREATE INDEX admin_audit_timeline_created_at_idx
  ON public.admin_audit_timeline(created_at DESC);
CREATE INDEX admin_audit_timeline_status_idx
  ON public.admin_audit_timeline(status);
CREATE INDEX admin_audit_timeline_source_idx
  ON public.admin_audit_timeline(source);
CREATE INDEX admin_audit_timeline_target_user_idx
  ON public.admin_audit_timeline(target_user_id);
CREATE INDEX admin_audit_timeline_target_email_idx
  ON public.admin_audit_timeline(lower(target_email));

-- Lock down direct access; reads must go through SECURITY DEFINER RPCs
REVOKE ALL ON public.admin_audit_timeline FROM PUBLIC;
REVOKE ALL ON public.admin_audit_timeline FROM anon, authenticated;

-- Refresh function (admin only)
CREATE OR REPLACE FUNCTION public.refresh_admin_audit_timeline()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem atualizar a auditoria';
  END IF;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.admin_audit_timeline;
  RETURN jsonb_build_object('success', true, 'refreshed_at', now());
EXCEPTION WHEN OTHERS THEN
  -- Fallback to non-concurrent refresh if concurrent fails (e.g. first run)
  REFRESH MATERIALIZED VIEW public.admin_audit_timeline;
  RETURN jsonb_build_object('success', true, 'refreshed_at', now(), 'mode', 'non_concurrent');
END $$;

-- Paginated, filtered listing
CREATE OR REPLACE FUNCTION public.list_admin_audit_timeline(
  _search    text        DEFAULT NULL,
  _status    text        DEFAULT NULL,
  _source    text        DEFAULT NULL,
  _from      timestamptz DEFAULT NULL,
  _to        timestamptz DEFAULT NULL,
  _sort_key  text        DEFAULT 'created_at',
  _sort_dir  text        DEFAULT 'desc',
  _limit     int         DEFAULT 25,
  _offset    int         DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order  text;
  v_search text := nullif(trim(coalesce(_search, '')), '');
  v_status text := nullif(_status, 'all');
  v_source text := nullif(_source, 'all');
  v_total  bigint;
  v_rows   jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _limit IS NULL OR _limit <= 0 OR _limit > 200 THEN _limit := 25; END IF;
  IF _offset IS NULL OR _offset < 0 THEN _offset := 0; END IF;

  v_order := CASE lower(coalesce(_sort_key,'created_at'))
    WHEN 'status'        THEN 'status'
    WHEN 'target_email'  THEN 'lower(coalesce(target_email,''''))'
    WHEN 'actor_email'   THEN 'lower(coalesce(actor_email,''''))'
    WHEN 'source'        THEN 'source'
    ELSE 'created_at'
  END || CASE WHEN lower(coalesce(_sort_dir,'desc')) = 'asc'
              THEN ' ASC NULLS LAST'
              ELSE ' DESC NULLS LAST'
         END;

  WITH base AS (
    SELECT *
      FROM public.admin_audit_timeline t
     WHERE (v_status IS NULL OR t.status = v_status)
       AND (v_source IS NULL OR t.source = v_source)
       AND (_from   IS NULL OR t.created_at >= _from)
       AND (_to     IS NULL OR t.created_at <= _to)
       AND (
         v_search IS NULL OR
         lower(coalesce(t.target_email,''))  LIKE '%' || lower(v_search) || '%' OR
         lower(coalesce(t.actor_email,''))   LIKE '%' || lower(v_search) || '%' OR
         lower(coalesce(t.details,''))       LIKE '%' || lower(v_search) || '%'
       )
  )
  SELECT count(*) INTO v_total FROM base;

  EXECUTE format($f$
    SELECT coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb)
      FROM (
        SELECT *
          FROM public.admin_audit_timeline t
         WHERE ($1::text        IS NULL OR t.status = $1)
           AND ($2::text        IS NULL OR t.source = $2)
           AND ($3::timestamptz IS NULL OR t.created_at >= $3)
           AND ($4::timestamptz IS NULL OR t.created_at <= $4)
           AND (
             $5::text IS NULL OR
             lower(coalesce(t.target_email,''))  LIKE '%%' || lower($5) || '%%' OR
             lower(coalesce(t.actor_email,''))   LIKE '%%' || lower($5) || '%%' OR
             lower(coalesce(t.details,''))       LIKE '%%' || lower($5) || '%%'
           )
         ORDER BY %s
         LIMIT $6 OFFSET $7
      ) x
  $f$, v_order)
  INTO v_rows
  USING v_status, v_source, _from, _to, v_search, _limit, _offset;

  RETURN jsonb_build_object('total', v_total, 'rows', v_rows);
END $$;

-- Anomaly detection: users with elevated activity in window
CREATE OR REPLACE FUNCTION public.admin_audit_anomalies(
  _window_hours int DEFAULT 24,
  _threshold    int DEFAULT 3
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _window_hours IS NULL OR _window_hours <= 0 OR _window_hours > 24*30 THEN
    _window_hours := 24;
  END IF;
  IF _threshold IS NULL OR _threshold < 2 THEN _threshold := 3; END IF;

  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v FROM (
    SELECT
      target_email,
      target_user_id,
      count(*)                                            AS event_count,
      count(*) FILTER (WHERE status = 'success')          AS approvals,
      count(*) FILTER (WHERE status = 'requested')        AS requests,
      count(*) FILTER (WHERE status IN ('rejected','revoked','error')) AS negatives,
      min(created_at)                                     AS first_event,
      max(created_at)                                     AS last_event
    FROM public.admin_audit_timeline
    WHERE created_at >= now() - make_interval(hours => _window_hours)
      AND target_email IS NOT NULL
      AND status IN ('success','requested','rejected','revoked','error')
    GROUP BY target_email, target_user_id
    HAVING count(*) >= _threshold
    ORDER BY count(*) DESC, max(created_at) DESC
    LIMIT 50
  ) t;

  RETURN jsonb_build_object(
    'window_hours', _window_hours,
    'threshold',    _threshold,
    'items',        v
  );
END $$;

REVOKE ALL ON FUNCTION public.refresh_admin_audit_timeline()       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.list_admin_audit_timeline(text,text,text,timestamptz,timestamptz,text,text,int,int) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_audit_anomalies(int,int)       FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.refresh_admin_audit_timeline()       TO authenticated;
GRANT  EXECUTE ON FUNCTION public.list_admin_audit_timeline(text,text,text,timestamptz,timestamptz,text,text,int,int) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.admin_audit_anomalies(int,int)       TO authenticated;