-- Fase 0: product_slugs (SAFE MODE — nenhum efeito em rotas/sitemap/canonical)

CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1. normalize_slug: lowercase + unaccent + sanitização
CREATE OR REPLACE FUNCTION public.normalize_slug(_s text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public, pg_catalog
AS $$
  SELECT regexp_replace(
           regexp_replace(
             regexp_replace(
               lower(public.unaccent('unaccent', coalesce(_s, ''))),
               '[^a-z0-9]+', '-', 'g'
             ),
             '-{2,}', '-', 'g'
           ),
           '(^-+|-+$)', '', 'g'
         )
$$;

-- 2. reserved_slugs
CREATE TABLE IF NOT EXISTS public.reserved_slugs (
  slug text PRIMARY KEY
);
INSERT INTO public.reserved_slugs(slug) VALUES
  ('admin'),('api'),('produto'),('produtos'),('categoria'),('categorias'),
  ('ocasiao'),('ocasioes'),('tag'),('tags'),('segmento'),('segmentos'),
  ('kit'),('kits'),('colecao'),('colecoes'),('login'),('logout'),
  ('checkout'),('carrinho'),('busca'),('buscar'),('search'),('rastrear'),
  ('orcamento'),('contato'),('sobre'),('blog'),('depoimentos'),('loja'),
  ('sitemap'),('robots'),('envio'),('faq'),('acesso-restrito')
ON CONFLICT DO NOTHING;

ALTER TABLE public.reserved_slugs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reserved_slugs" ON public.reserved_slugs
  FOR SELECT USING (true);
CREATE POLICY "Admin manage reserved_slugs" ON public.reserved_slugs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 3. product_slugs (sem CHECK regex rígido — validação fica no helper TS/admin)
CREATE TABLE public.product_slugs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  slug            text NOT NULL,
  slug_normalized text NOT NULL,
  is_primary      boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  source          text NOT NULL DEFAULT 'manual'
                  CHECK (source IN ('legacy','manual','rename','import','alias')),
  hit_count       integer NOT NULL DEFAULT 0,
  last_hit_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX product_slugs_slug_key            ON public.product_slugs (slug);
CREATE UNIQUE INDEX product_slugs_slug_normalized_key ON public.product_slugs (slug_normalized);
CREATE UNIQUE INDEX product_slugs_one_primary_per_product
  ON public.product_slugs (product_id) WHERE is_primary;
CREATE INDEX product_slugs_product_id_idx ON public.product_slugs (product_id);
CREATE INDEX product_slugs_active_idx     ON public.product_slugs (is_active) WHERE is_active;

CREATE TRIGGER trg_product_slugs_updated_at
  BEFORE UPDATE ON public.product_slugs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. RLS
ALTER TABLE public.product_slugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active product slugs"
  ON public.product_slugs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin manage product slugs"
  ON public.product_slugs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 5. Trigger BEFORE: normaliza + valida reservados
CREATE OR REPLACE FUNCTION public.product_slugs_normalize()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.slug := lower(trim(coalesce(NEW.slug,'')));
  NEW.slug_normalized := public.normalize_slug(NEW.slug);

  IF NEW.slug_normalized IS NULL OR length(NEW.slug_normalized) = 0 THEN
    RAISE EXCEPTION 'Slug vazio ou inválido após normalização.'
      USING ERRCODE = '23514';
  END IF;

  IF EXISTS (SELECT 1 FROM public.reserved_slugs WHERE slug = NEW.slug_normalized) THEN
    RAISE EXCEPTION 'Slug "%" é reservado pelo sistema.', NEW.slug_normalized
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_product_slugs_normalize
  BEFORE INSERT OR UPDATE OF slug ON public.product_slugs
  FOR EACH ROW EXECUTE FUNCTION public.product_slugs_normalize();

-- 6. Sync products.slug → product_slugs
--    Ordem correta: DEMOVE primários antigos ANTES de promover o novo.
--    NUNCA rouba slug de outro produto.
CREATE OR REPLACE FUNCTION public.sync_product_slugs_from_products()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_norm     text;
  v_old_norm text;
  v_owner    uuid;
BEGIN
  IF NEW.slug IS NULL THEN RETURN NEW; END IF;
  v_norm := public.normalize_slug(NEW.slug);

  IF TG_OP = 'INSERT' THEN
    -- Verifica posse antes de inserir
    SELECT product_id INTO v_owner FROM public.product_slugs
      WHERE slug_normalized = v_norm LIMIT 1;
    IF v_owner IS NOT NULL AND v_owner <> NEW.id THEN
      RAISE EXCEPTION 'Slug "%" já pertence a outro produto (%).', v_norm, v_owner
        USING ERRCODE = '23505';
    END IF;
    IF v_owner IS NULL THEN
      INSERT INTO public.product_slugs (product_id, slug, slug_normalized, is_primary, source)
      VALUES (NEW.id, NEW.slug, v_norm, true, 'legacy');
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE
  IF OLD.slug IS NOT DISTINCT FROM NEW.slug THEN
    RETURN NEW;
  END IF;

  v_old_norm := public.normalize_slug(OLD.slug);

  -- Verifica se novo slug já existe e pertence a outro produto
  SELECT product_id INTO v_owner FROM public.product_slugs
    WHERE slug_normalized = v_norm LIMIT 1;
  IF v_owner IS NOT NULL AND v_owner <> NEW.id THEN
    RAISE EXCEPTION 'Slug "%" já pertence a outro produto (%). Renomeação bloqueada.', v_norm, v_owner
      USING ERRCODE = '23505';
  END IF;

  -- 1) Desmarcar primários antigos deste produto PRIMEIRO
  UPDATE public.product_slugs
     SET is_primary = false, updated_at = now()
   WHERE product_id = NEW.id AND is_primary;

  -- 2) Promover/inserir o novo como primário
  IF v_owner = NEW.id THEN
    UPDATE public.product_slugs
       SET is_primary = true, is_active = true, updated_at = now()
     WHERE slug_normalized = v_norm AND product_id = NEW.id;
  ELSE
    INSERT INTO public.product_slugs (product_id, slug, slug_normalized, is_primary, source)
    VALUES (NEW.id, NEW.slug, v_norm, true, 'rename');
  END IF;

  -- 3) Garante slug antigo permaneça como alias ativo (histórico)
  UPDATE public.product_slugs
     SET is_active = true, updated_at = now()
   WHERE product_id = NEW.id
     AND slug_normalized = v_old_norm
     AND slug_normalized <> v_norm;

  RETURN NEW;
END $$;

CREATE TRIGGER trg_products_sync_slugs
  AFTER INSERT OR UPDATE OF slug ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.sync_product_slugs_from_products();

-- 7. Backfill
INSERT INTO public.product_slugs (product_id, slug, slug_normalized, is_primary, source)
SELECT p.id, p.slug, public.normalize_slug(p.slug), true, 'legacy'
  FROM public.products p
 WHERE p.slug IS NOT NULL
ON CONFLICT (slug_normalized) DO NOTHING;

-- 8. RPC resolução determinística (ORDER BY is_primary DESC)
CREATE OR REPLACE FUNCTION public.resolve_product_slug(_slug text)
RETURNS TABLE (
  product_id   uuid,
  matched_slug text,
  primary_slug text,
  is_primary   boolean,
  is_active    boolean
) LANGUAGE sql STABLE SET search_path = public AS $$
  WITH hit AS (
    SELECT ps.product_id, ps.slug AS matched, ps.is_primary, ps.is_active
      FROM public.product_slugs ps
     WHERE ps.slug_normalized = public.normalize_slug(_slug)
     ORDER BY ps.is_primary DESC, ps.is_active DESC, ps.created_at ASC
     LIMIT 1
  )
  SELECT h.product_id,
         h.matched,
         (SELECT slug FROM public.product_slugs
            WHERE product_id = h.product_id AND is_primary
            ORDER BY updated_at DESC LIMIT 1),
         h.is_primary,
         h.is_active
    FROM hit h
$$;
GRANT EXECUTE ON FUNCTION public.resolve_product_slug(text) TO anon, authenticated;

-- 9. RPC telemetria de hit
CREATE OR REPLACE FUNCTION public.record_product_slug_hit(_slug text)
RETURNS void LANGUAGE sql SET search_path = public AS $$
  UPDATE public.product_slugs
     SET hit_count = hit_count + 1, last_hit_at = now()
   WHERE slug_normalized = public.normalize_slug(_slug)
$$;
GRANT EXECUTE ON FUNCTION public.record_product_slug_hit(text) TO anon, authenticated;