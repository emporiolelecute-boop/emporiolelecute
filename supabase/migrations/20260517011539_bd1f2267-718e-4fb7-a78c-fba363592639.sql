-- Fase A — Padronização canônica /produto/ → /produtos/
-- Atualiza a função auto_create_redirect_on_slug_change para emitir
-- redirects sob o prefixo plural /produtos/, alinhando com a rota real
-- da aplicação e o canonical do frontend. Não altera slugs existentes
-- nem modifica registros atuais em public.redirects.

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

  v_prefix := CASE TG_TABLE_NAME
    WHEN 'products'   THEN '/produtos/'
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

  UPDATE public.redirects SET to_path = v_to, updated_at = now()
   WHERE to_path = v_from AND is_active = true;

  RETURN NEW;
END;
$function$;