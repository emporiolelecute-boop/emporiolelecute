
-- Sprint 2: Catálogo + Descoberta
-- 1) novos campos em products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS featured_weight integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS production_speed text;

-- Validação: production_speed só aceita valores conhecidos ou null (=auto)
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_production_speed_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_production_speed_check
  CHECK (production_speed IS NULL OR production_speed IN ('rapido','normal','longo'));

CREATE INDEX IF NOT EXISTS idx_products_featured_weight ON public.products(featured_weight DESC);

-- 2) coleções curadas
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  show_on_home boolean NOT NULL DEFAULT false,
  home_position integer NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON public.collection_products(collection_id, position);
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON public.collection_products(product_id);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_collections_updated_at ON public.collections;
CREATE TRIGGER trg_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Collections public read" ON public.collections;
CREATE POLICY "Collections public read" ON public.collections FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Collections admin write" ON public.collections;
CREATE POLICY "Collections admin write" ON public.collections FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Collection products public read" ON public.collection_products;
CREATE POLICY "Collection products public read" ON public.collection_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Collection products admin write" ON public.collection_products;
CREATE POLICY "Collection products admin write" ON public.collection_products FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
