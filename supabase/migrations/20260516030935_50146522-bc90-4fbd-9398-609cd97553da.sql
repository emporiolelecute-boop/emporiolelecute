ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.occasions  ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.segments   ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb;