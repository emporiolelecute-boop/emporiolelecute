# Plano: Integração completa Google Search Console + SEO técnico

Antes de implementar, alinhamento do que será feito (em ordem de execução). Nada será alterado no que já funciona — apenas adições.

## Status atual (já existente no projeto)
- ✅ Conexão Google Search Console: **já conectada** (secret `GOOGLE_SEARCH_CONSOLE_API_KEY` ativo)
- ✅ Sitemap dinâmico submetido ao GSC (91 URLs, 54 imagens, 0 erros)
- ✅ `robots.txt` dinâmico via Edge Function `robots-txt` + painel admin (`AdminRobots`) com sitemap correto
- ✅ Schema.org já implementado: `Organization`, `WebSite`, `LocalBusiness`, `Product`, `FAQPage`, `BreadcrumbList`, `ItemList`
- ✅ Edge Function `seo-gsc-analytics` e `seo-checks` existentes
- ✅ Geração de sitemap por `generate-sitemap` + `submit-sitemap`

Ou seja, **vários itens do pedido já estão prontos**. O plano foca no que falta ou pode ser melhorado.

---

## 1. Conexão GSC ✅ (nada a fazer)
Já conectada e o sitemap `https://emporiolelecute.com.br/sitemap.xml` foi submetido com sucesso. Apenas **revalidar** via painel.

## 2. robots.txt completo ✅ (revisão leve)
Já existe via Edge Function + `public/robots.txt` de fallback. Vou:
- Garantir que o `public/robots.txt` espelhe a config do banco (mesmas regras)
- Adicionar `Disallow: /checkout`, `/api/` e bots agressivos opcionais (se quiser)
- Sem mudanças se já estiver ok — apenas validar diff visual no painel

## 3. Painel de métricas SEO (NOVO)
Criar página `AdminSEODashboard` (ou expandir a existente) consumindo a Edge Function `seo-gsc-analytics` para mostrar:
- **Status de indexação**: total submetido vs indexado vs excluído (últimos 30 dias)
- **Cobertura do sitemap**: contagem de URLs no sitemap × URLs descobertas pelo Google
- **Top queries** (cliques, impressões, CTR, posição média)
- **Top páginas** com performance
- **Erros de cobertura** (404, server errors, redirects, noindex)
- Gráficos com Recharts já presente
- Refresh manual + cache de 1h

## 4. Monitoramento periódico + alertas (NOVO)
Edge Function `seo-indexation-monitor` agendada via `pg_cron` (diário 06:00):
- Lê todas URLs do sitemap
- Chama GSC URL Inspection API em lote (limite ~2000/dia)
- Salva snapshot em nova tabela `seo_url_status` (url, coverage_state, last_crawl, indexing_state, checked_at)
- Se aparecer **nova** URL com erro/excluída → envia e-mail via Resend para `emporiolelecute@gmail.com`
- Painel mostra histórico + diff do dia

## 5. Reenvio automático do sitemap em mudanças no catálogo (NOVO)
Trigger Postgres `AFTER INSERT/UPDATE/DELETE` em `products`, `categories`, `pages`, `blog_posts`:
- Marca flag em `store_settings.key = 'sitemap_dirty'` com timestamp
- Job `pg_cron` a cada 15min: se dirty, chama `submit-sitemap` (que regenera + faz `ping` ao GSC) e limpa flag
- Debounce evita reenvio a cada save individual; respeita quota GSC

## 6. Schema.org + Rich Results (revisão)
Auditar componentes existentes e:
- Confirmar `Product` com `offers`, `aggregateRating` (condicional), `shippingDetails`, `MerchantReturnPolicy` ✅ já tem
- Confirmar `BreadcrumbList` em todas as páginas profundas ✅ já tem
- Adicionar `BreadcrumbList` onde faltar (páginas dinâmicas, blog)
- `Organization` + `LocalBusiness` ✅ já tem
- Validar URLs principais via API do Rich Results Test (ou link direto no painel)
- Adicionar botão no painel SEO: "Validar no Rich Results Test" (abre `https://search.google.com/test/rich-results?url=...` em nova aba para cada URL chave)

---

## Detalhes técnicos

### Novos arquivos
- `supabase/functions/seo-indexation-monitor/index.ts` — cron diário GSC URL Inspection
- `supabase/functions/seo-sitemap-auto-resubmit/index.ts` — reenvio debounced
- `src/pages/admin/AdminSEODashboard.tsx` — painel de métricas (ou expandir o existente)
- `src/components/admin/SEOIndexationPanel.tsx` — tabela de URLs com status
- Migration: tabela `seo_url_status` + trigger `mark_sitemap_dirty()` + cron jobs

### Novos secrets necessários
Nenhum — `GOOGLE_SEARCH_CONSOLE_API_KEY`, `LOVABLE_API_KEY`, `RESEND_API_KEY` já configurados.

### Sem mudanças em
- `HeroSlider.tsx` (funcionando, não tocar)
- `index.css`, design tokens, componentes públicos
- Schemas existentes (apenas auditoria)

### Riscos / Cuidados
- GSC URL Inspection API tem quota de 2000 chamadas/dia — ok para ~91 URLs/dia
- Cron deve respeitar `pg_cron` + `pg_net` (já habilitados no projeto)
- Reenvio do sitemap não pode ficar em loop — uso de flag + debounce

---

## Ordem de execução proposta
1. Auditoria + ajustes mínimos no `robots.txt` e Schema (rápido, baixo risco)
2. Painel SEO Dashboard com dados do GSC já existente
3. Tabela + Edge Function de monitoramento de indexação
4. Cron + alertas por e-mail
5. Trigger + reenvio automático do sitemap

Posso seguir? Se aprovar, começo pelos itens 1+2 (mais visíveis e seguros) e depois 3-5 em sequência.
