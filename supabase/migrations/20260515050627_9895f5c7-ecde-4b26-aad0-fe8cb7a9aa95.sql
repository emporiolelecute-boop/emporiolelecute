-- Admin-only helper to backfill missing weights on active products
CREATE OR REPLACE FUNCTION public.apply_default_weight(_default_kg numeric DEFAULT 0.150)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_updated int;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Não autenticado' USING ERRCODE = '28000';
  END IF;
  IF NOT public.has_role(v_caller, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem executar esta operação';
  END IF;
  IF _default_kg IS NULL OR _default_kg <= 0 OR _default_kg > 30 THEN
    RAISE EXCEPTION 'Peso padrão inválido (use entre 0.001 e 30 kg)';
  END IF;

  UPDATE public.products
     SET weight = _default_kg, updated_at = now()
   WHERE is_active = true
     AND (weight IS NULL OR weight = 0);

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  RETURN jsonb_build_object('success', true, 'updated', v_updated, 'default_kg', _default_kg);
END;
$$;

REVOKE ALL ON FUNCTION public.apply_default_weight(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_default_weight(numeric) TO authenticated, service_role;