
-- 1) Migrar SEO de occasion_landings → occasions (sem sobrescrever)
UPDATE public.occasions o
SET
  meta_title       = COALESCE(NULLIF(o.meta_title, ''),       l.seo_title),
  meta_description = COALESCE(NULLIF(o.meta_description, ''), l.seo_description),
  h1_override      = COALESCE(NULLIF(o.h1_override, ''),      l.h1),
  description_seo  = COALESCE(NULLIF(o.description_seo, ''),  l.seo_copy)
FROM public.occasion_landings l
WHERE l.occasion_slug = o.slug
  AND l.is_published = true;

-- 2) Redirects 301 legados → canônicos
INSERT INTO public.redirects (from_path, to_path, status_code, is_active, notes)
VALUES
  ('/lembrancinhas-cha-de-bebe',         '/ocasiao/cha-bebe',       301, true, 'Fase 3.3 — consolidação legado'),
  ('/lembrancinhas-maternidade',         '/ocasiao/maternidade',    301, true, 'Fase 3.3 — consolidação legado'),
  ('/lembrancinhas-cha-revelacao',       '/ocasiao/cha-revelacao',  301, true, 'Fase 3.3 — consolidação legado'),
  ('/lembrancinhas-batizado',            '/ocasiao/batizado',       301, true, 'Fase 3.3 — consolidação legado'),
  ('/lembrancinhas-aniversario-infantil','/ocasiao/aniversario',    301, true, 'Fase 3.3 — consolidação legado'),
  ('/lembrancinhas-formatura',           '/ocasiao/formatura',      301, true, 'Fase 3.3 — consolidação legado')
ON CONFLICT DO NOTHING;
