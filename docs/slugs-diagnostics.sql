-- ============================================================
-- Slugs Diagnostics — Fase 1.5
-- Queries de auditoria operacional. Rodar manualmente quando precisar
-- inspecionar saúde da arquitetura de slugs de produto.
-- Nenhuma destas queries muta dados.
-- ============================================================

-- 1) Top aliases por hit (slugs não-primários mais acessados)
SELECT ps.slug, ps.hit_count, ps.last_hit_at, p.name AS product_name
  FROM public.product_slugs ps
  JOIN public.products p ON p.id = ps.product_id
 WHERE NOT ps.is_primary AND ps.is_active
 ORDER BY ps.hit_count DESC NULLS LAST, ps.last_hit_at DESC NULLS LAST
 LIMIT 50;

-- 2) Slugs históricos mais usados (source ≠ manual/alias)
SELECT ps.slug, ps.source, ps.hit_count, p.name AS product_name
  FROM public.product_slugs ps
  JOIN public.products p ON p.id = ps.product_id
 WHERE NOT ps.is_primary
   AND ps.source NOT IN ('manual','alias')
 ORDER BY ps.hit_count DESC NULLS LAST
 LIMIT 50;

-- 3) Aliases nunca usados (hit_count = 0 ou NULL)
SELECT ps.slug, ps.source, ps.created_at, p.name AS product_name
  FROM public.product_slugs ps
  JOIN public.products p ON p.id = ps.product_id
 WHERE NOT ps.is_primary
   AND coalesce(ps.hit_count, 0) = 0
 ORDER BY ps.created_at DESC;

-- 4) Produtos sem slug primário (esperado: 0)
SELECT p.id, p.name, p.slug
  FROM public.products p
 WHERE NOT EXISTS (
   SELECT 1 FROM public.product_slugs ps
    WHERE ps.product_id = p.id AND ps.is_primary
 );

-- 5) Múltiplos primários por produto (esperado: 0)
SELECT product_id, COUNT(*) AS primaries
  FROM public.product_slugs
 WHERE is_primary
 GROUP BY product_id
HAVING COUNT(*) > 1;

-- 6) Drift: products.slug ≠ primary slug em product_slugs (esperado: 0)
SELECT p.id, p.name, p.slug AS products_slug, ps.slug AS primary_in_slugs
  FROM public.products p
  JOIN public.product_slugs ps ON ps.product_id = p.id AND ps.is_primary
 WHERE public.normalize_slug(p.slug) <> ps.slug_normalized;

-- 7) Aliases órfãos (FK quebrada — esperado: 0, há ON DELETE CASCADE)
SELECT ps.id, ps.slug, ps.product_id
  FROM public.product_slugs ps
 WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.id = ps.product_id);

-- 8) Slugs inativos (apenas inventário)
SELECT ps.slug, ps.source, ps.updated_at, p.name AS product_name
  FROM public.product_slugs ps
  JOIN public.products p ON p.id = ps.product_id
 WHERE NOT ps.is_active
 ORDER BY ps.updated_at DESC;

-- 9) Conflitos potenciais: redirects ativos cobrindo /produtos/<slug-ativo>
-- (mesmo namespace controlado por dois sistemas — dívida arquitetural)
SELECT r.from_path, r.to_path, r.hits,
       ps.product_id, ps.is_primary, ps.is_active
  FROM public.redirects r
  LEFT JOIN public.product_slugs ps
    ON ps.slug_normalized = public.normalize_slug(replace(r.from_path, '/produtos/', ''))
 WHERE r.is_active
   AND r.from_path LIKE '/produtos/%';
