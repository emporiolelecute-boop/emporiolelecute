ALTER TABLE public.hero_slides
  ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'text_image',
  ADD COLUMN IF NOT EXISTS image_desktop_url text;

ALTER TABLE public.hero_slides
  DROP CONSTRAINT IF EXISTS hero_slides_display_mode_check;

ALTER TABLE public.hero_slides
  ADD CONSTRAINT hero_slides_display_mode_check
  CHECK (display_mode IN ('text_image','banner_mobile','banner_desktop'));