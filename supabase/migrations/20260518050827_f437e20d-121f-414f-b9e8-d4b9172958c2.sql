
-- ============= KITS EDITORIAIS (Sprint 3) =============
CREATE TYPE public.kit_bundle_type AS ENUM ('suggested', 'curated', 'premium');

CREATE TABLE public.kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  bundle_type public.kit_bundle_type NOT NULL DEFAULT 'curated',
  estimated_savings NUMERIC(10,2),
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_on_home BOOLEAN NOT NULL DEFAULT false,
  home_position INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.kit_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES public.kits(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kit_id, product_id)
);

CREATE INDEX idx_kits_active_position ON public.kits (is_active, position);
CREATE INDEX idx_kits_home ON public.kits (show_on_home, home_position) WHERE show_on_home = true;
CREATE INDEX idx_kit_products_kit ON public.kit_products (kit_id, position);
CREATE INDEX idx_kit_products_product ON public.kit_products (product_id);

ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active kits"
ON public.kits FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage kits"
ON public.kits FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view kit_products of active kits"
ON public.kit_products FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.kits k WHERE k.id = kit_id AND (k.is_active = true OR public.has_role(auth.uid(), 'admin')))
);

CREATE POLICY "Admins manage kit_products"
ON public.kit_products FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_kits_updated_at
BEFORE UPDATE ON public.kits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reaproveita validação de slug compartilhado entre taxonomias
CREATE TRIGGER trg_kits_unique_slug
BEFORE INSERT OR UPDATE OF slug ON public.kits
FOR EACH ROW EXECUTE FUNCTION public.check_taxonomy_slug_unique();

-- Redireciona automaticamente quando o slug muda
CREATE TRIGGER trg_kits_auto_redirect
AFTER UPDATE OF slug ON public.kits
FOR EACH ROW EXECUTE FUNCTION public.auto_create_redirect_on_slug_change();
