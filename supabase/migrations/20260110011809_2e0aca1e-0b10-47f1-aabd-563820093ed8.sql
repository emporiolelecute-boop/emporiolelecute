-- Create homepage_blocks table for CMS-style editable content blocks
CREATE TABLE public.homepage_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key text NOT NULL UNIQUE,
  block_type text NOT NULL DEFAULT 'category', -- category, about, testimonial, hero
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  link_url text,
  link_text text,
  position integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  content jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_blocks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view visible homepage blocks"
ON public.homepage_blocks FOR SELECT
USING (is_visible = true);

CREATE POLICY "Admins can manage homepage blocks"
ON public.homepage_blocks FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_homepage_blocks_updated_at
BEFORE UPDATE ON public.homepage_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default category blocks
INSERT INTO public.homepage_blocks (block_key, block_type, title, subtitle, description, image_url, link_url, link_text, position) VALUES
('category_sabonetes', 'category', 'Sabonetes', NULL, 'Sabonetes artesanais perfumados', 'https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg', '/produtos?categoria=sabonetes', 'Comprar Agora', 1),
('category_velas', 'category', 'Velas', NULL, 'Velas decorativas artesanais', 'https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg', '/produtos?categoria=velas', 'Comprar Agora', 2),
('category_kits', 'category', 'Kits Maternidade', NULL, 'Kits especiais para maternidade', 'https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg', '/produtos?categoria=kits', 'Comprar Agora', 3),
('category_lembrancinhas', 'category', 'Lembrancinhas', NULL, 'Lembrancinhas personalizadas', 'https://img.elo7.com.br/product/685x685/5663EE8/lembrancinha-sabonete-brasao-2-letras.jpg', '/produtos?categoria=lembrancinhas', 'Comprar Agora', 4);

-- Insert about block
INSERT INTO public.homepage_blocks (block_key, block_type, title, subtitle, description, image_url, link_url, link_text, position) VALUES
('about_section', 'about', 'Sobre o Empório LeleCute', 'Ateliê Criativo de Lembrancinhas Artesanais', 
'O Empório LeleCute é um ateliê criativo especializado em lembrancinhas artesanais personalizadas. Cada peça é cuidadosamente confeccionada à mão, com materiais de alta qualidade e muito carinho. Trabalhamos para transformar momentos especiais em memórias únicas através de produtos exclusivos que encantam e emocionam.',
'https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg', 
'/sobre', 'Conheça Nossa História', 1);

-- Update store_settings RLS to allow public access to homepage_config
CREATE POLICY "Public can view footer config"
ON public.store_settings FOR SELECT
USING (key = 'footer_config');