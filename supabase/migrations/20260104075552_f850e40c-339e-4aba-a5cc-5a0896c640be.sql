-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Criar tabela de categorias
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de ocasiões
CREATE TABLE public.occasions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  min_quantity INTEGER DEFAULT 1,
  pix_discount INTEGER DEFAULT 3,
  production_days INTEGER DEFAULT 7,
  weight DECIMAL(10,3),
  category_id UUID REFERENCES public.categories(id),
  badge TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  elo7_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de relação produtos-ocasiões (many-to-many)
CREATE TABLE public.product_occasions (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  occasion_id UUID REFERENCES public.occasions(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, occasion_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_occasions ENABLE ROW LEVEL SECURITY;

-- Função security definer para verificar roles (evita recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para categories (público pode ler, admin pode gerenciar)
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para occasions (público pode ler, admin pode gerenciar)
CREATE POLICY "Anyone can view occasions"
ON public.occasions FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage occasions"
ON public.occasions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para products (público pode ler ativos, admin pode gerenciar)
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can view all products"
ON public.products FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para product_occasions
CREATE POLICY "Anyone can view product_occasions"
ON public.product_occasions FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage product_occasions"
ON public.product_occasions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para criar profile automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();