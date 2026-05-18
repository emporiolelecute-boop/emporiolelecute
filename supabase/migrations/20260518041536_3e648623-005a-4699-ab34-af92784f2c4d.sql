-- Eventos do funil de conversão da PDP (sticky → whatsapp → confirmação + exit popup)
CREATE TABLE IF NOT EXISTS public.pdp_funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  source text,
  product_slug text,
  quantity int,
  personalized boolean,
  session_id text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pdp_funnel_events_name_chk CHECK (event_name IN (
    'pdp_sticky_view',
    'pdp_quick_summary_view',
    'pdp_whatsapp_click',
    'whatsapp_click_confirmed',
    'exit_popup_open',
    'exit_popup_blocked',
    'exit_popup_close',
    'exit_popup_whatsapp_click'
  ))
);

CREATE INDEX IF NOT EXISTS idx_pdp_funnel_events_name_time
  ON public.pdp_funnel_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdp_funnel_events_time
  ON public.pdp_funnel_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdp_funnel_events_product
  ON public.pdp_funnel_events (product_slug);

ALTER TABLE public.pdp_funnel_events ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante (anon ou autenticado) pode registrar evento de funil.
-- Não há leitura pública: somente admins podem consultar.
CREATE POLICY "anyone can insert funnel events"
  ON public.pdp_funnel_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins can read funnel events"
  ON public.pdp_funnel_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RPC de agregação (somente admins). Retorna contagens por evento + breakdown popup.
CREATE OR REPLACE FUNCTION public.pdp_funnel_stats(
  _from timestamptz DEFAULT (now() - interval '7 days'),
  _to timestamptz DEFAULT now()
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_counts jsonb;
  v_by_source jsonb;
  v_by_block_rule jsonb;
  v_top_products jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT coalesce(jsonb_object_agg(event_name, c), '{}'::jsonb)
    INTO v_counts
  FROM (
    SELECT event_name, count(*)::int AS c
      FROM public.pdp_funnel_events
     WHERE created_at >= _from AND created_at <= _to
     GROUP BY event_name
  ) t;

  SELECT coalesce(jsonb_object_agg(source, c), '{}'::jsonb)
    INTO v_by_source
  FROM (
    SELECT coalesce(source,'(none)') AS source, count(*)::int AS c
      FROM public.pdp_funnel_events
     WHERE event_name = 'pdp_whatsapp_click'
       AND created_at >= _from AND created_at <= _to
     GROUP BY source
  ) t;

  SELECT coalesce(jsonb_object_agg(rule, c), '{}'::jsonb)
    INTO v_by_block_rule
  FROM (
    SELECT coalesce(meta->>'rule','(unknown)') AS rule, count(*)::int AS c
      FROM public.pdp_funnel_events
     WHERE event_name = 'exit_popup_blocked'
       AND created_at >= _from AND created_at <= _to
     GROUP BY rule
  ) t;

  SELECT coalesce(jsonb_agg(row_to_json(p)), '[]'::jsonb) INTO v_top_products
  FROM (
    SELECT product_slug, count(*)::int AS clicks
      FROM public.pdp_funnel_events
     WHERE event_name = 'pdp_whatsapp_click'
       AND product_slug IS NOT NULL
       AND created_at >= _from AND created_at <= _to
     GROUP BY product_slug
     ORDER BY clicks DESC
     LIMIT 10
  ) p;

  RETURN jsonb_build_object(
    'from', _from,
    'to', _to,
    'counts', v_counts,
    'by_source', v_by_source,
    'blocked_by_rule', v_by_block_rule,
    'top_products', v_top_products
  );
END;
$$;

-- Limpeza opcional para não acumular indefinidamente (180 dias)
CREATE OR REPLACE FUNCTION public.cleanup_pdp_funnel_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.pdp_funnel_events
   WHERE created_at < now() - interval '180 days';
END;
$$;