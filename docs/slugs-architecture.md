# Arquitetura de Slugs — Fase 0 (SAFE MODE)

> Status: **infraestrutura criada, nada plugado no público ainda.**
> Rotas, sitemap, canonical e redirects atuais permanecem inalterados.

## Contrato

- `public.product_slugs` é a fonte da verdade para **todos** os endereços
  (atual + históricos + aliases manuais) de cada produto.
- `products.slug` continua existindo como espelho do slug primário,
  sincronizado via trigger `trg_products_sync_slugs`.
- Cada produto tem **exatamente 1** linha com `is_primary = true`
  (garantido por índice único parcial).
- Cada slug é único globalmente (`slug` e `slug_normalized` UNIQUE).
- Slug **nunca** é "roubado" entre produtos automaticamente — uma
  tentativa lança `23505` e a operação aborta.

## Normalização

Tanto SQL (`public.normalize_slug`) quanto TS (`src/lib/slug.ts → normalizeSlug`):

1. `lowercase`
2. remove acentos / diacríticos (NFD strip / `unaccent`)
3. troca qualquer não-`[a-z0-9]` por `-`
4. colapsa `-` repetidos
5. apara `-` nas pontas

Exemplo: `"Coração de Ouro"` → `"coracao-de-ouro"`.

## Slugs reservados

`public.reserved_slugs` + `RESERVED_SLUGS` (TS) bloqueiam colisão com
rotas do app (`admin`, `produto`, `checkout`, etc). A trigger
`product_slugs_normalize` rejeita inserts/updates que caiam nessa lista.

## Comportamento da trigger de sync

Em `UPDATE products.slug`:

1. Verifica se o novo slug pertence a outro produto → **aborta**.
2. Desmarca primários antigos deste produto.
3. Promove o novo (insert ou update do existente) como primário.
4. Garante que o slug antigo permaneça como alias ativo (`is_active = true`).

Resultado: renomear nunca quebra histórico.

## RPCs disponíveis

- `resolve_product_slug(_slug text)` — retorna `product_id`,
  `matched_slug`, `primary_slug`, `is_primary`, `is_active`. Determinístico
  (ORDER BY `is_primary DESC, is_active DESC, created_at ASC`).
- `record_product_slug_hit(_slug text)` — telemetria fire-and-forget.

Ambos com `GRANT EXECUTE` para `anon, authenticated`.

## Helpers TS (não consumidos ainda)

- `src/lib/slug.ts` — `normalizeSlug`, `isReservedSlug`, `isUsableSlug`.
- `src/lib/urls.ts` — `urls.product(slug)`, `urls.productAbsolute(slug)`.
- `src/lib/productResolver.ts` — `resolveProductSlug(raw)`, `recordProductSlugHit(raw)`.

## O que NÃO mudou nesta fase

- `/produtos/:slug` segue como rota canônica.
- `/produto/:slug` segue como redirect legado client-side.
- `useDbProduct(slug)` segue resolvendo direto por `products.slug`.
- Sitemap, canonical, og:url, structured data, tracking — intactos.
- Trigger pré-existente `trg_redirect_on_slug_products` continua
  alimentando `public.redirects` em paralelo (será unificado na Fase 2).

## Rollback

```sql
DROP TRIGGER  IF EXISTS trg_products_sync_slugs ON public.products;
DROP FUNCTION IF EXISTS public.sync_product_slugs_from_products();
DROP FUNCTION IF EXISTS public.resolve_product_slug(text);
DROP FUNCTION IF EXISTS public.record_product_slug_hit(text);
DROP TABLE    IF EXISTS public.product_slugs;
DROP TABLE    IF EXISTS public.reserved_slugs;
DROP FUNCTION IF EXISTS public.product_slugs_normalize();
DROP FUNCTION IF EXISTS public.normalize_slug(text);
```

Arquivos em `src/lib/{slug,urls,productResolver}.ts` podem ser removidos
sem impacto — não há consumidores.

## Próximas fases

- **Fase 1**: `useDbProduct` passa a usar `resolveProductSlug` e dispara
  redirect client-side quando slug ≠ primário; canonical sempre primário.
- **Fase 2**: rota canônica vira `/produto/:slug`; `/produtos/:slug`
  permanece viva como redirect; helper `urls.product()` muda prefixo
  num único ponto.
- **Fase 3**: admin de slugs (lista, promover, criar alias, remover).
- **Fase 4**: unificar com `public.redirects` (deprecar trigger antiga).
