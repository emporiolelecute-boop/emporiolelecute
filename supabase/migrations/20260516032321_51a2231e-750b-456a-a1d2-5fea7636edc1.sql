
-- ============================================================
-- Fase 6 — Hardening de slugs cross-taxonomia
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_taxonomy_slug_unique()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_self text := TG_TABLE_NAME;
  v_conflict text;
  v_kind text;
BEGIN
  -- Apenas valida quando o slug está sendo introduzido ou alterado
  IF TG_OP = 'UPDATE' AND NEW.slug IS NOT DISTINCT FROM OLD.slug THEN
    RETURN NEW;
  END IF;

  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    RETURN NEW;
  END IF;

  -- Checa cada uma das outras tabelas; ignora a tabela atual
  IF v_self <> 'categories' AND EXISTS (SELECT 1 FROM public.categories WHERE slug = NEW.slug) THEN
    v_conflict := 'categoria'; v_kind := 'categories';
  ELSIF v_self <> 'occasions' AND EXISTS (SELECT 1 FROM public.occasions WHERE slug = NEW.slug) THEN
    v_conflict := 'ocasião'; v_kind := 'occasions';
  ELSIF v_self <> 'segments' AND EXISTS (SELECT 1 FROM public.segments WHERE slug = NEW.slug) THEN
    v_conflict := 'segmento'; v_kind := 'segments';
  ELSIF v_self <> 'tags' AND EXISTS (SELECT 1 FROM public.tags WHERE slug = NEW.slug) THEN
    v_conflict := 'tag'; v_kind := 'tags';
  END IF;

  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION
      'O slug "%" já está em uso em outra taxonomia (%). Escolha um slug único entre categorias, ocasiões, segmentos e tags.',
      NEW.slug, v_conflict
      USING ERRCODE = '23505', HINT = v_kind;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categories_unique_slug ON public.categories;
CREATE TRIGGER trg_categories_unique_slug
  BEFORE INSERT OR UPDATE OF slug ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.check_taxonomy_slug_unique();

DROP TRIGGER IF EXISTS trg_occasions_unique_slug ON public.occasions;
CREATE TRIGGER trg_occasions_unique_slug
  BEFORE INSERT OR UPDATE OF slug ON public.occasions
  FOR EACH ROW EXECUTE FUNCTION public.check_taxonomy_slug_unique();

DROP TRIGGER IF EXISTS trg_segments_unique_slug ON public.segments;
CREATE TRIGGER trg_segments_unique_slug
  BEFORE INSERT OR UPDATE OF slug ON public.segments
  FOR EACH ROW EXECUTE FUNCTION public.check_taxonomy_slug_unique();

DROP TRIGGER IF EXISTS trg_tags_unique_slug ON public.tags;
CREATE TRIGGER trg_tags_unique_slug
  BEFORE INSERT OR UPDATE OF slug ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.check_taxonomy_slug_unique();

-- ============================================================
-- Taxonomy Registry — fonte única para menus / sitemap / breadcrumbs
-- ============================================================

CREATE OR REPLACE VIEW public.taxonomy_registry AS
  SELECT 'category'::text AS type, c.id, c.slug, c.name,
         '/categoria/' || c.slug AS canonical_path,
         COALESCE(c.is_indexed, true) AS is_indexed,
         COALESCE(c.position, 0) AS position,
         c.image_url
    FROM public.categories c
  UNION ALL
  SELECT 'occasion', o.id, o.slug, o.name,
         '/ocasiao/' || o.slug,
         COALESCE(o.is_indexed, true),
         COALESCE(o.position, 0),
         o.image_url
    FROM public.occasions o
  UNION ALL
  SELECT 'segment', s.id, s.slug, s.name,
         '/segmento/' || s.slug,
         COALESCE(s.is_indexed, true),
         COALESCE(s.position, 0),
         s.image_url
    FROM public.segments s
  UNION ALL
  SELECT 'tag', t.id, t.slug, t.name,
         '/tag/' || t.slug,
         false,                 -- tags nunca indexadas
         COALESCE(t.position, 0),
         NULL::text
    FROM public.tags t;

GRANT SELECT ON public.taxonomy_registry TO anon, authenticated;

COMMENT ON VIEW public.taxonomy_registry IS
  'Fase 6 — Registro unificado de taxonomias (category/occasion/segment/tag) com canonical_path. Use como única fonte de verdade para menus, sitemap e breadcrumbs.';
