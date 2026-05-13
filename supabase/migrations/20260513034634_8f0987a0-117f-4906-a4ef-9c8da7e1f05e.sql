INSERT INTO public.occasions (slug, name) VALUES
  ('cha-revelacao', 'Chá Revelação'),
  ('formatura', 'Formatura')
ON CONFLICT (slug) DO NOTHING;