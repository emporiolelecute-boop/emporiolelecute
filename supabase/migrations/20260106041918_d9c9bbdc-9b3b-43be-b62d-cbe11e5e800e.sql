-- Tabela de tags para produtos
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Tabela de relacionamento produtos x tags
CREATE TABLE IF NOT EXISTS public.product_tags (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- Tabela de páginas institucionais
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  seo_title text,
  seo_description text,
  seo_canonical text,
  seo_noindex boolean DEFAULT false,
  seo_nofollow boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  created_by uuid,
  updated_by uuid
);

-- Histórico de versões das páginas
CREATE TABLE IF NOT EXISTS public.page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  content text,
  seo_title text,
  seo_description text,
  version_number integer,
  created_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Tabela de itens de menu
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_location text NOT NULL CHECK (menu_location IN ('header', 'footer')),
  label text NOT NULL,
  url text,
  page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES public.menu_items(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  is_external boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS para tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS para product_tags
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product_tags" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_tags" ON public.product_tags FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS para pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS para page_versions
ALTER TABLE public.page_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage page_versions" ON public.page_versions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS para menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view menu_items" ON public.menu_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can view all menu_items" ON public.menu_items FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage menu_items" ON public.menu_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at em pages
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir páginas institucionais iniciais
INSERT INTO public.pages (title, slug, content, status, seo_title, seo_description)
VALUES 
  ('Política de Troca', 'politica-de-troca', '<h2>Política de Troca e Devolução</h2><p>Conteúdo da política de troca...</p>', 'published', 'Política de Troca | Empório LeleCute', 'Conheça nossa política de troca e devolução.'),
  ('Formas de Pagamento', 'formas-de-pagamento', '<h2>Formas de Pagamento</h2><p>Aceitamos diversas formas de pagamento...</p>', 'published', 'Formas de Pagamento | Empório LeleCute', 'Conheça as formas de pagamento aceitas.'),
  ('Política de Privacidade', 'politica-de-privacidade', '<h2>Política de Privacidade</h2><p>Sua privacidade é importante para nós...</p>', 'published', 'Política de Privacidade | Empório LeleCute', 'Conheça nossa política de privacidade.')
ON CONFLICT (slug) DO NOTHING;