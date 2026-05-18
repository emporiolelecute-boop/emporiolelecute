# Architecture — Snapshot final (Sprints 1–4)

Documento canônico da arquitetura operacional após o ciclo de maturidade.

## 1. Fluxo de conversão

PDP / Kit / Card → `resolvePrimaryAction()` decide CTA primário:

| Estado do produto | Primário | Secundário |
|---|---|---|
| Personalizado     | WhatsApp | Carrinho |
| Pronta entrega    | Carrinho | WhatsApp |
| Out of stock      | WhatsApp | — |
| Kit (bundle)      | Carrinho | WhatsApp (híbrido) |
| Inativo           | Indisponível | — |

Implementação: `src/lib/primaryAction.ts` (try/catch + telemetria `cta_resolution_fail`).
Checkout: CEP / Cidade / UF → cálculo de frete → WhatsApp agrupado (multi-item para kits).

## 2. Catálogo

- `products` + taxonomias (`categories`, `occasions`, `tags`, `segments`).
- Filtros URL-sync em `/loja` e `/produtos`.
- Slugs únicos por taxonomia (`check_taxonomy_slug_unique`) + redirects 301 automáticos.
- Score editorial determinístico: `src/lib/homePriority.ts` (`featured_weight` + bonus por kit/coleção/badge).

## 3. Kits e coleções

- `kits` + `kit_products` (quantidade + posição). Tipos: `suggested`, `curated`, `premium`.
- `collections` + `collection_products`. Página `/colecao/:slug`.
- Página `/kit/:slug` com cross-sell e WhatsApp multi-item agrupado.
- Cross-sell PDP: `CrossSellComplete`, `VisualComposition`, `ProductBundleBelongsTo`.

## 4. Home

Renderizada dinamicamente a partir de `home_sections` (admin controla ordem/visibilidade/props).

**Dedupe global** (Sprint final): `HomeRegistryProvider` em `src/contexts/HomeRegistry.tsx` mantém Sets de produtos/kits/coleções já reivindicados. Blocos posteriores (`BestSellers`, `ProductsSection`, `FeaturedKits`, `FeaturedCollections`) chamam `claim()`/`filter()` para evitar repetição entre seções.

Registry de componentes: `src/lib/homeSectionsRegistry.ts`.

## 5. Tracking / Analytics

Documento canônico: `docs/tracking.md`.

- **Intent**: `view_item`, `bundle_view`, `home_kit_click`.
- **Interaction**: `internal_link_click`, `review_gallery_interaction`.
- **Conversion**: `pdp_whatsapp_click`, `bundle_whatsapp_click`, `generate_lead`.
- Regras: nunca duplicar eventos, sempre incluir `origin`, nunca PII.

## 6. Observabilidade

`src/lib/telemetry.ts` → `logTelemetryEvent()` persiste em `stale_bundle_logs`:

| Evento | Quando |
|---|---|
| `ui_error_boundary` | Root ou Admin error boundary capturou erro |
| `supabase_query_slow` | REST/RPC ≥ `VITE_SUPABASE_SLOW_MS` (2500ms default) |
| `image_load_fail` | `BlurImage`/`LazyImage` onError |
| `cta_resolution_fail` | resolver primário lançou exceção (fallback aplicado) |

Web Vitals (LCP/INP/CLS/FCP/TTFB) em `src/lib/webVitals.ts`. Throttle global de 10s + correlation_id por sessão.

## 7. Admin (SPA)

Roles: `admin`, `editor` (apenas conteúdo), `customer`. Verificação server-side via `has_role()`.

Páginas-chave: `/admin/produtos`, `/admin/kits`, `/admin/colecoes`, `/admin/home-sections`, `/admin/conversao`, `/admin/menus`, `/admin/seo`, `/admin/telemetria`.

**Form UX (Sprint final)**:
- `useFormAutosave(key, state, setState)` → rascunho localStorage com debounce 800ms.
- `useUnsavedChangesPrompt(dirty)` → `beforeunload` nativo.
- `<StickySaveBar />` → CTA fixo no rodapé com indicador dirty / "salvo há Xs".
- Padrão aplicado em `AdminKitForm`. `AdminProductForm` e `AdminCollectionForm` herdam o mesmo wiring quando refatorados (mesma API).

## 8. Performance

- Code splitting: todas as rotas via `lazy()` + `lazyWithRetry()` (3 tentativas, hard reload em deploy stale).
- Imagens: `BlurImage` (placeholder blur + srcset) e `LazyImage` (IO + shimmer). `fetchpriority="high"` para LCP.
- React Query como cache compartilhado entre hooks (`useDbProducts`, `useKits`, `useCollections`).
- SW em `public/sw.js` para asset caching.

## 9. Backend (Lovable Cloud)

- Migrations versionadas em `supabase/migrations/`.
- RLS habilitada em todas as tabelas públicas. `has_role()` é `SECURITY DEFINER` para evitar recursão.
- Edge Functions: `calculate-shipping`, `merchant-feed`, `send-order-email`, `track-order`, `seo-*`, `instagram-*`, `mercadopago-webhook`.
- pg_cron: regeneração semanal de sitemap + monitor de telemetria.

## 10. Princípios

1. **Catálogo guia intenção**, não apenas lista produtos.
2. **CTA único e previsível** por contexto (`resolvePrimaryAction`).
3. **Home edita-se via banco**, não via código.
4. **Tracking documentado** em `docs/tracking.md`; mudanças exigem PR no doc.
5. **Telemetria detecta degradação** antes do usuário reclamar.
6. **Admin opera sem fadiga**: autosave + sticky save + aviso de saída.
