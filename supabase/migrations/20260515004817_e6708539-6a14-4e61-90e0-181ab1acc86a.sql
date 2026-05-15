ALTER TABLE public.occasion_landings
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS og_image_alt text;