-- Migration: adiciona coluna image_mobile_url na tabela hero_slides
-- Execute este SQL no painel do Supabase: Database > SQL Editor

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS image_mobile_url TEXT DEFAULT NULL;

COMMENT ON COLUMN hero_slides.image_mobile_url IS
  'URL da imagem exibida em dispositivos móveis (< md). Se NULL, usa image_url.';
