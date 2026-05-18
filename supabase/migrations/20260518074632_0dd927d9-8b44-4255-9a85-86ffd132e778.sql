CREATE OR REPLACE FUNCTION public.auto_create_redirect_on_slug_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_prefix text;
  v_from text;
  v_to text;
BEGIN
  IF OLD.slug IS NULL OR NEW.slug IS NULL OR OLD.slug = NEW.slug THEN
    RETURN NEW;
  END IF;

  -- Fase 4.1: products migrou para namespace canônico /produto (singular).
  -- Demais taxonomias mantêm seus prefixos atuais.
  v_prefix := CASE TG_TABLE_NAME
    WHEN 'products'   THEN '/produto/'
    WHEN 'categories' THEN '/categoria/'
    WHEN 'tags'       THEN '/tag/'
    WHEN 'occasions'  THEN '/ocasiao/'
    WHEN 'segments'   THEN '/segmento/'
    ELSE NULL
  END;

  IF v_prefix IS NULL THEN
    RETURN NEW;
  END IF;

  v_from := v_prefix || OLD.slug;
  v_to   := v_prefix || NEW.slug;

  INSERT INTO public.redirects (from_path, to_path, status_code, is_active, notes)
  VALUES (v_from, v_to, 301, true, 'Auto-gerado: slug alterado em ' || TG_TABLE_NAME)
  ON CONFLICT DO NOTHING;

  -- Flatten: se algum redirect antigo apontava para o slug que acabou de mudar,
  -- repassa o destino para o novo, evitando cadeias A→B→C.
  UPDATE public.redirects SET to_path = v_to, updated_at = now()
   WHERE to_path = v_from AND is_active = true;

  RETURN NEW;
END;
$function$;