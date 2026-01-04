-- Create store_settings table for store configuration
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "Admin can view store settings"
ON public.store_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update store settings"
ON public.store_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can insert store settings"
ON public.store_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public read policy for non-sensitive settings
CREATE POLICY "Public can view homepage settings"
ON public.store_settings
FOR SELECT
USING (key IN ('homepage_config', 'contact_info', 'social_links'));

-- Add trigger for timestamps
CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.store_settings (key, value) VALUES 
  ('homepage_config', '{"featured_products_count": 6, "featured_order": "recent", "show_categories_highlight": true, "show_bestsellers": true, "show_occasions": true}'),
  ('contact_info', '{"whatsapp": "5541992214299", "email": "contato@emporiolelecute.com.br", "address": "São José dos Pinhais, PR"}'),
  ('social_links', '{"instagram": "https://www.instagram.com/emporiolelecute", "facebook": "https://www.facebook.com/emporiolelecute", "elo7": "https://www.elo7.com.br/emporiolelecute"}'),
  ('shipping_policy', '{"note": "O frete será calculado após a confirmação do pedido via WhatsApp", "free_shipping_threshold": 0}')
ON CONFLICT (key) DO NOTHING;