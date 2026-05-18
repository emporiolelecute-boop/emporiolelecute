# Prerender Strategy — Hybrid SEO SPA

## Contexto e restrição fundamental

O projeto roda em **Lovable hosting (SPA estática Vite)** com **Cloudflare na frente** (já configurado para `robots.txt` dinâmico). O build do Lovable **não executa headless browser** (Puppeteer/Playwright), então plugins como `vite-plugin-prerender`, `react-snap` ou `vite-plugin-ssg` **não rodam no pipeline atual**. Tentar instalá-los quebra o build.

A única arquitetura viável **sem trocar de hospedagem** é **prerender no edge**:

```text
Crawler ──► Cloudflare Worker
              │
              ├─ UA é bot + rota crítica? ──► Edge Function `prerender` ──► HTML estático com <head> completo + JSON-LD + conteúdo SEO mínimo
              │
              └─ Usuário humano OU rota não-crítica ──► SPA Lovable normal (hydration React)
```

Isso resolve os 4 critérios de sucesso (Googlebot sem JS, social crawlers, sitemap alinhado, hidratação sem conflito) sem mover o projeto para Next.js/SSR.

## Matriz de rotas (decisão de prerender)

| Rota | Indexável | Depende de JS hoje | Prerender |
|---|---|---|---|
| `/` | sim | parcial (Helmet) | 🔴 SIM |
| `/produtos` | sim | sim (DynamicSEO) | 🔴 SIM |
| `/produto/:slug` | sim | sim (Product JSON-LD) | 🔴 SIM (top N) |
| `/categoria/:slug` | sim | sim | 🔴 SIM (todas) |
| `/ocasiao/:slug` | sim | sim | 🟠 SIM |
| `/tag/:slug` | sim | sim | 🟠 SIM |
| `/lembrancinhas-*` (landings) | sim | sim | 🔴 SIM |
| `/sobre`, `/contato`, `/envio`, `/orcamento`, `/depoimentos`, `/blog`, `/blog/:slug` | sim | parcial | 🟠 SIM |
| `/buscar`, `/carrinho`, `/rastrear`, `/loja` | não | n/a | ❌ NÃO |
| `/admin/*` | não (robots) | n/a | ❌ NÃO |
| `/404` (qualquer rota inválida) | não | risco soft-404 | 🔴 SIM (HTML estático com `noindex`) |

## Arquitetura técnica

### 1. Edge Function `prerender` (Supabase)
Nova função que recebe `?path=/produto/abc` e retorna HTML completo:

- Lê dados reais do Postgres (produto, categoria, ocasião, landing) via service role.
- Monta `<head>` completo: title, description, canonical, OG, Twitter, JSON-LD apropriado por rota (Product, CollectionPage, ItemList, Organization, BreadcrumbList).
- Inclui `<body>` com conteúdo SEO mínimo legível (h1, descrição, lista de produtos, links internos para crawl).
- Inclui o `<div id="root">` + `<script type="module" src="/assets/index-[hash].js">` igual ao `index.html` — assim quando o navegador real chega via fallback, o React hidrata normalmente.
- Cache `s-maxage=600, stale-while-revalidate=86400`.
- Para rota inválida: retorna 200 com `<meta name="robots" content="noindex,follow">` e conteúdo de NotFound (resolve soft-404).

### 2. Cloudflare Worker (extensão do existente)
Adicionar lógica de roteamento ao worker que já serve `/robots.txt`:

```js
const PRERENDER = "https://xfqffqxqiuqauefrrcxn.supabase.co/functions/v1/prerender";
const BOT_UA = /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|applebot/i;
const PRERENDER_PATHS = /^\/(produtos|produto\/|categoria\/|ocasiao\/|tag\/|lembrancinhas|sobre|contato|envio|orcamento|depoimentos|blog)/;

// Se UA é bot E (rota é prerender OU "/"), faz fetch do edge function com cache 10min
// Caso contrário: passa direto pro Lovable (SPA)
```

Decisão **bot-aware** (não prerender para humanos) porque:
- Usuário humano não precisa do prerender (hidratação React entrega UX completa).
- Reduz custo da Edge Function em ~99% do tráfego.
- Elimina risco de divergência de hidratação (humano nunca vê o HTML prerenderizado).
- Social crawlers (que são o caso crítico do `og:image`) **são bots por UA** — eles recebem o HTML correto.

### 3. Sitemap alignment
A função `generate-sitemap` já existe. Adicionar validação cruzada:
- Lista de rotas no sitemap = lista de rotas que a Edge `prerender` sabe renderizar.
- Job semanal compara e loga drift em `seo_health_runs`.

### 4. Helmet permanece (não remover)
- Prerender = **fonte primária** para bots.
- Helmet = **fonte primária** para SPA pós-hydration (atualiza título ao navegar client-side).
- Como bot nunca executa JS, Helmet nunca sobrescreve o prerender no bot. Como humano nunca recebe o prerender, não há conflito.
- **Zero duplicação de JSON-LD**: o HTML prerenderizado contém JSON-LD; quando o React hidrata no humano, Helmet injeta o mesmo JSON-LD — mas isso só acontece no humano, que não importa para SEO.

## Arquivos que vou criar/editar

1. **CRIAR** `supabase/functions/prerender/index.ts` — função edge que renderiza HTML por rota.
2. **EDITAR** `docs/cloudflare-worker-robots.md` — adicionar segunda versão do worker com prerender + instruções.
3. **CRIAR** `docs/PRERENDER_STRATEGY.md` — documentação da estratégia, lista de UAs, rollback.
4. **CRIAR** `supabase/functions/prerender/_tests/` — fixtures e testes unitários do gerador HTML.
5. **EDITAR** `supabase/functions/generate-sitemap/index.ts` — adicionar marker `<!-- prerender:ok -->` para validação.
6. **CRIAR** `src/pages/admin/AdminPrerenderHealth.tsx` — dashboard que mostra: rotas conhecidas, cache hit rate (via header), última renderização, drift vs sitemap.
7. **EDITAR** `src/App.tsx` — adicionar rota `/admin/prerender-health`.

**Nenhuma mudança em `vite.config.ts`, `package.json` runtime deps, ou no React app cliente.** Zero risco de regressão visual ou de comportamento para usuários humanos.

## Plano de rollback
1. Reverter Worker para versão atual (só serve `/robots.txt`) — 1 clique no Cloudflare.
2. Deletar Edge Function `prerender` — bots voltam a ver SPA atual (estado atual).
3. Reverter PR de código (admin dashboard fica órfão, sem efeito).

Tempo de rollback: **< 5 minutos**, sem downtime.

## Impacto esperado

| Métrica | Antes | Depois |
|---|---|---|
| Googlebot vê `<title>` correto sem JS | só `/` | todas rotas críticas |
| WhatsApp/LinkedIn preview por produto | só fallback genérico | título + descrição + imagem do produto |
| Soft-404 risk | alto (200 + index) | zero (200 + noindex no HTML) |
| Time-to-indexable | depende de Googlebot rodar JS (lento) | imediato (HTML estático) |
| Custo Cloudflare/Supabase | n/a | ~$0–2/mês (bots = baixo volume) |

## Pré-requisitos antes de eu começar

Preciso confirmar 2 pontos:

1. **Cloudflare Worker**: você confirma que o domínio `emporiolelecute.com.br` já passa por Cloudflare (proxied/laranja) e que eu posso assumir que você vai atualizar o Worker manualmente com o snippet que vou documentar? (Eu não tenho acesso direto ao Cloudflare — só consigo escrever o código + doc.)

2. **Escopo do MVP**: começamos por **`/` + `/produto/:slug` + `/categoria/:slug` + 404** (cobre 80% do valor de SEO/social) e itero o resto depois? Ou já entregamos todas as rotas da matriz acima de uma vez?
