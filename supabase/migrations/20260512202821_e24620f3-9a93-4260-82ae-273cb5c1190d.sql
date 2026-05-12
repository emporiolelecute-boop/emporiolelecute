
-- Replace broken Elo7 images in homepage_blocks
UPDATE public.homepage_blocks SET image_url = 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-sabonetes.jpg'
WHERE block_type = 'category' AND title = 'Sabonetes';

UPDATE public.homepage_blocks SET image_url = 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-velas.jpg'
WHERE block_type = 'category' AND title = 'Velas';

UPDATE public.homepage_blocks SET image_url = 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-kits.jpg'
WHERE block_type = 'category' AND title = 'Kits Maternidade';

UPDATE public.homepage_blocks SET image_url = 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-lembrancinhas.jpg'
WHERE block_type = 'category' AND title = 'Lembrancinhas';

UPDATE public.homepage_blocks SET image_url = 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-sabonetes.jpg'
WHERE block_type = 'about' AND image_url LIKE '%img.elo7.com.br%';

-- Replace broken Elo7 images in products with category-appropriate fallback
UPDATE public.products
SET images = ARRAY(
  SELECT CASE
    WHEN img LIKE '%img.elo7.com.br%' AND (lower(name) LIKE '%vela%') THEN 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-velas.jpg'
    WHEN img LIKE '%img.elo7.com.br%' AND (lower(name) LIKE '%escalda%' OR lower(name) LIKE '%sache%') THEN 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-lembrancinhas.jpg'
    WHEN img LIKE '%img.elo7.com.br%' THEN 'https://xfqffqxqiuqauefrrcxn.supabase.co/storage/v1/object/public/product-images/defaults/category-sabonetes.jpg'
    ELSE img
  END
  FROM unnest(images) AS img
)
WHERE images::text LIKE '%img.elo7.com.br%';
