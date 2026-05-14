## Escopo

Implementar 4 módulos administrativos + entregar relatório técnico de arquitetura.

---

### 1. Robots.txt Dinâmico
- Edge Function pública `robots-txt` que lê de `store_settings.robots_config`
- Admin: `AdminRobots.tsx` com:
  - Toggle global "permitir indexação"
  - Lista de paths a bloquear (`Disallow`)
  - Toggle por categoria (bloqueia `/categoria/{slug}`)
  - Toggle por produto individual (campo `seo_noindex` em `products`)
- Atualiza `public/robots.txt` estático como fallback + serve dinâmico via função

### 2. Redirects 301
- Nova tabela `redirects` (from_path, to_path, status_code, is_active, hits)
- Componente `<RedirectHandler />` no `App.tsx` que consulta tabela e faz `<Navigate replace>`
- Admin: `AdminRedirects.tsx` com CRUD + contador de hits
- Detecção automática: quando admin altera slug de produto/categoria, oferecer criar redirect

### 3. Cupons Globais
- Nova tabela `coupons` (code, type: percent|fixed, value, min_subtotal, valid_from, valid_until, max_uses, used_count, is_active)
- Tabela `coupon_uses` (coupon_id, order_id) para auditoria
- Admin: `AdminCoupons.tsx` CRUD
- Função RPC `validate_coupon(code, subtotal)` retornando desconto calculado
- UI no `Carrinho.tsx`: campo "Cupom", aplica desconto, persiste no order

### 4. Analytics & Ads IDs
- `store_settings.tracking_config` com: `ga4_id`, `gtm_id`, `meta_pixel_id`, `google_ads_id`, `enabled_routes` (regex/lista)
- Admin: `AdminTracking.tsx` formulário
- Componente `<TrackingScripts />` no `App.tsx` que injeta scripts condicionalmente por rota
- Remove IDs hardcoded existentes

### 5. Relatório Técnico (Markdown)
Gerado em `/mnt/documents/auditoria-emporiolelecute.md` cobrindo:
- Modelo de dados (todas as tabelas + relacionamentos)
- Funcionalidades do admin
- Páginas públicas
- Fluxo de carrinho/personalização
- Integrações (Resend, GSC, WhatsApp, Merchant Center)
- Design system (cores, fontes, shadcn)
- TODOs / pendências / áreas com mock

Entregue como `<presentation-artifact>`.

---

## Ordem de execução

1. Migrations (redirects, coupons, coupon_uses, products.seo_noindex, store_settings keys)
2. Edge Function robots-txt
3. Hooks (`useRedirects`, `useCoupon`, `useTracking`)
4. Telas admin (4 novas)
5. Integração frontend (RedirectHandler, TrackingScripts, cupom no carrinho)
6. Relatório de auditoria

---

## Confirmação

Confirma este escopo? Algum ponto a ajustar antes de começar (ex.: tipos de cupons, formato de redirects, providers de tracking adicionais)?