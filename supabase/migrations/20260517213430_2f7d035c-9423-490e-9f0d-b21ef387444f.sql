
-- =============================================================
-- home_sections: catálogo de seções da home
-- =============================================================
CREATE TABLE IF NOT EXISTS public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  component_name text NOT NULL,
  label text NOT NULL,
  description text,
  is_visible boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  editable_props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_home_sections_position ON public.home_sections (position);
CREATE INDEX IF NOT EXISTS idx_home_sections_visible ON public.home_sections (is_visible);

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_sections public read visible" ON public.home_sections;
CREATE POLICY "home_sections public read visible"
  ON public.home_sections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "home_sections admin insert" ON public.home_sections;
CREATE POLICY "home_sections admin insert"
  ON public.home_sections FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "home_sections admin update" ON public.home_sections;
CREATE POLICY "home_sections admin update"
  ON public.home_sections FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "home_sections admin delete" ON public.home_sections;
CREATE POLICY "home_sections admin delete"
  ON public.home_sections FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_home_sections_updated_at ON public.home_sections;
CREATE TRIGGER trg_home_sections_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- home_section_audit: histórico de mudanças
-- =============================================================
CREATE TABLE IF NOT EXISTS public.home_section_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  action text NOT NULL CHECK (action IN ('visibility_changed','reordered','edited','created','deleted')),
  old_value jsonb,
  new_value jsonb,
  changed_by uuid,
  changed_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_home_section_audit_section ON public.home_section_audit (section_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_home_section_audit_created ON public.home_section_audit (created_at DESC);

ALTER TABLE public.home_section_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "home_section_audit admin read" ON public.home_section_audit;
CREATE POLICY "home_section_audit admin read"
  ON public.home_section_audit FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Sem políticas de INSERT/UPDATE/DELETE no cliente: só o trigger SECURITY DEFINER grava.

-- =============================================================
-- Trigger de auditoria
-- =============================================================
CREATE OR REPLACE FUNCTION public.audit_home_sections()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NOT NULL THEN
    SELECT email INTO v_email FROM public.profiles WHERE id = v_uid;
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.home_section_audit (section_key, action, old_value, new_value, changed_by, changed_by_email)
    VALUES (NEW.section_key, 'created', NULL,
            jsonb_build_object('is_visible', NEW.is_visible, 'position', NEW.position, 'label', NEW.label),
            v_uid, v_email);
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.home_section_audit (section_key, action, old_value, new_value, changed_by, changed_by_email)
    VALUES (OLD.section_key, 'deleted',
            jsonb_build_object('is_visible', OLD.is_visible, 'position', OLD.position, 'label', OLD.label),
            NULL, v_uid, v_email);
    RETURN OLD;
  END IF;

  -- UPDATE
  IF NEW.is_visible IS DISTINCT FROM OLD.is_visible THEN
    INSERT INTO public.home_section_audit (section_key, action, old_value, new_value, changed_by, changed_by_email)
    VALUES (NEW.section_key, 'visibility_changed',
            jsonb_build_object('is_visible', OLD.is_visible),
            jsonb_build_object('is_visible', NEW.is_visible),
            v_uid, v_email);
  END IF;

  IF NEW.position IS DISTINCT FROM OLD.position THEN
    INSERT INTO public.home_section_audit (section_key, action, old_value, new_value, changed_by, changed_by_email)
    VALUES (NEW.section_key, 'reordered',
            jsonb_build_object('position', OLD.position),
            jsonb_build_object('position', NEW.position),
            v_uid, v_email);
  END IF;

  IF NEW.label IS DISTINCT FROM OLD.label
     OR NEW.description IS DISTINCT FROM OLD.description
     OR NEW.editable_props IS DISTINCT FROM OLD.editable_props THEN
    INSERT INTO public.home_section_audit (section_key, action, old_value, new_value, changed_by, changed_by_email)
    VALUES (NEW.section_key, 'edited',
            jsonb_build_object('label', OLD.label, 'description', OLD.description, 'editable_props', OLD.editable_props),
            jsonb_build_object('label', NEW.label, 'description', NEW.description, 'editable_props', NEW.editable_props),
            v_uid, v_email);
  END IF;

  RETURN NEW;
END $fn$;

DROP TRIGGER IF EXISTS trg_home_sections_audit ON public.home_sections;
CREATE TRIGGER trg_home_sections_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.audit_home_sections();

-- =============================================================
-- Seed inicial
-- =============================================================
INSERT INTO public.home_sections (section_key, component_name, label, description, is_visible, position) VALUES
  ('hero',              'HeroSlider',       'Hero / Banner Principal',     'Banner rotativo de destaque no topo da home.',                           true,  10),
  ('categories_scroll', 'CategoriesScroll', 'Categorias (carrossel)',      'Carrossel horizontal de categorias logo abaixo do Hero.',                false, 20),
  ('occasions_thumbs',  'OccasionsThumbs',  'Ocasiões Especiais',          'Mini-thumbs de ocasiões (Aniversário, Casamento, etc.).',                true,  30),
  ('best_sellers',      'BestSellers',      'Mais Vendidos',               'Grade de produtos em destaque / mais vendidos.',                          true,  40),
  ('quote_cta_banner',  'QuoteCTABanner',   'Banner de Orçamento',         'CTA convidando para solicitar orçamento personalizado.',                  true,  50),
  ('testimonials',      'Testimonials',     'Depoimentos',                 'Carrossel de depoimentos de clientes.',                                   true,  60),
  ('faq',               'FAQSection',       'Perguntas Frequentes',        'Seção de FAQ na home.',                                                   true,  70),
  ('instagram',         'InstagramFeed',    'Feed do Instagram',           'Feed dos últimos posts do Instagram.',                                    true,  80)
ON CONFLICT (section_key) DO NOTHING;

-- =============================================================
-- Limpa bloco antigo migrado
-- =============================================================
DELETE FROM public.homepage_blocks WHERE block_key = 'section_categories_scroll';
