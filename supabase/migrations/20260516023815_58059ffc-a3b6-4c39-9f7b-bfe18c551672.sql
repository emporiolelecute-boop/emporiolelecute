
-- 1. Tabela segments
CREATE TABLE public.segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  meta_title text,
  meta_description text,
  h1_override text,
  description_seo text,
  is_indexed boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_segments_slug ON public.segments(slug);
CREATE INDEX idx_segments_position ON public.segments(position);
CREATE INDEX idx_segments_is_indexed ON public.segments(is_indexed);

ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view segments"
  ON public.segments FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage segments"
  ON public.segments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_segments_updated_at
  BEFORE UPDATE ON public.segments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-redirect on slug change (reusa função existente)
CREATE TRIGGER auto_redirect_on_segment_slug_change
  AFTER UPDATE OF slug ON public.segments
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();

-- Marca sitemap dirty quando segmentos mudam
CREATE TRIGGER mark_sitemap_dirty_segments
  AFTER INSERT OR UPDATE OR DELETE ON public.segments
  FOR EACH STATEMENT EXECUTE FUNCTION public.mark_sitemap_dirty();

-- Estender prefixos do auto-redirect para incluir /segmento/
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

  UPDATE public.redirects SET to_path = v_to, updated_at = now()
   WHERE to_path = v_from AND is_active = true;

  RETURN NEW;
END;
$function$;

-- 2. product_segments
CREATE TABLE public.product_segments (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, segment_id)
);

CREATE INDEX idx_product_segments_product ON public.product_segments(product_id);
CREATE INDEX idx_product_segments_segment ON public.product_segments(segment_id);

ALTER TABLE public.product_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product_segments"
  ON public.product_segments FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product_segments"
  ON public.product_segments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Popular segmentos iniciais
INSERT INTO public.segments (name, slug, position) VALUES
  ('Lembrancinhas', 'lembrancinhas', 10),
  ('Brindes Corporativos', 'brindes-corporativos', 20),
  ('Kits & Combos', 'kits', 30)
ON CONFLICT (slug) DO NOTHING;

-- 4. Migração controlada das tags (mantém tags originais)
-- tag Lembrancinhas / Lembrancinha Personalizada → segment lembrancinhas
INSERT INTO public.product_segments (product_id, segment_id)
SELECT DISTINCT pt.product_id, s.id
  FROM public.product_tags pt
  JOIN public.tags t ON t.id = pt.tag_id
  JOIN public.segments s ON s.slug = 'lembrancinhas'
 WHERE lower(t.name) IN ('lembrancinhas', 'lembrancinha personalizada')
ON CONFLICT DO NOTHING;

-- tag Brinde Corporativo → segment brindes-corporativos
INSERT INTO public.product_segments (product_id, segment_id)
SELECT DISTINCT pt.product_id, s.id
  FROM public.product_tags pt
  JOIN public.tags t ON t.id = pt.tag_id
  JOIN public.segments s ON s.slug = 'brindes-corporativos'
 WHERE lower(t.name) = 'brinde corporativo'
ON CONFLICT DO NOTHING;

-- 5. Migração controlada de occasion Corporativo (mantém occasion original)
INSERT INTO public.product_segments (product_id, segment_id)
SELECT DISTINCT po.product_id, s.id
  FROM public.product_occasions po
  JOIN public.occasions o ON o.id = po.occasion_id
  JOIN public.segments s ON s.slug = 'brindes-corporativos'
 WHERE lower(o.slug) = 'corporativo' OR lower(o.name) = 'corporativo'
ON CONFLICT DO NOTHING;
