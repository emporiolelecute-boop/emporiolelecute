# Prerender Strategy — Hybrid SEO SPA

> **Status**: implementado em Edge Function. Aguarda configuração do Cloudflare Worker para entrar em produção.

## Resumo

O site é uma SPA Vite hospedada no Lovable. Crawlers que **não executam JavaScript** (WhatsApp, LinkedIn, Slack, Facebook bot, parte do tráfego do Googlebot em rotas profundas) recebiam apenas o shell estático de `index.html`, sem `<title>`, `description`, OG ou JSON-LD específicos da rota.

Esta estratégia introduz **prerender no edge**, gated por User-Agent na Cloudflare. **Usuários humanos continuam recebendo a SPA original sem nenhuma diferença.**

```text
Crawler ──► Cloudflare Worker
              │
              ├─ UA é bot + rota é pública? ──► supabase/functions/prerender ──► HTML completo (head + body SEO)
              │
              └─ Usuário humano OU rota não-crítica ──► Lovable (SPA normal)
```

## Edge Function

`supabase/functions/prerender/index.ts`

- **Entrada**: `GET ?path=/produto/abc`
- **Saída**: HTML 200 com `<head>` completo (title, description, canonical, OG, Twitter, JSON-LD) e `<body>` legível derivado de dados reais do Postgres (via service role).
- **Rotas suportadas**: `/`, `/produtos`, `/produto/:slug`, `/categoria/:slug`, `/ocasiao/:slug`, `/tag/:slug`, páginas institucionais de `pages`. Qualquer outra rota retorna 200 + `<meta name="robots" content="noindex,follow">` (resolve soft-404).
- **Cache**: `s-maxage=600, stale-while-revalidate=86400`.
- **Headers de diagnóstico**: `x-prerender`, `x-prerender-path`, `x-prerender-noindex`.

A função produz HTML puramente estático para bots — **não inclui o bootstrap React**, porque bots não hidratam. Isso elimina qualquer risco de conflito de Helmet vs prerender. Humanos nunca chegam aqui (o Worker filtra por UA).

## Cloudflare Worker

Substitua o Worker atual (que só serve `/robots.txt`) pelo snippet abaixo. Ele preserva o comportamento de `/robots.txt`, adiciona prerender para bots, e passa todo o resto para o Lovable.

```js
// worker.js — Cloudflare Worker
const ROBOTS_ORIGIN  = "https://xfqffqxqiuqauefrrcxn.supabase.co/functions/v1/robots-txt";
const PRERENDER_ORIGIN = "https://xfqffqxqiuqauefrrcxn.supabase.co/functions/v1/prerender";

const BOT_UA = /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|applebot|petalbot|ahrefsbot|semrushbot/i;

// Rotas que devem ser prerenderizadas quando o requester é bot
const PRERENDER_PATH = /^\/(produtos$|produto\/|categoria\/|ocasiao\/|tag\/|lembrancinhas|sobre$|contato$|envio$|orcamento$|depoimentos$|blog($|\/))/;

// Rotas que NUNCA devem ser prerenderizadas (admin / dinâmicas / pessoais)
const SKIP_PATH = /^\/(admin|carrinho|rastrear|loja|buscar|api|assets|favicon|robots|sitemap)/;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1. robots.txt dinâmico (comportamento atual)
    if (url.pathname === "/robots.txt") {
      const upstream = await fetch(ROBOTS_ORIGIN, { cf: { cacheTtl: 300, cacheEverything: true } });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=300",
          "x-robots-source": "lovable-edge-function",
        },
      });
    }

    // 2. Prerender para bots em rotas indexáveis
    const ua = request.headers.get("user-agent") || "";
    const isBot = BOT_UA.test(ua);
    const isPrerenderable = url.pathname === "/" || PRERENDER_PATH.test(url.pathname);
    const isSkip = SKIP_PATH.test(url.pathname);

    if (isBot && isPrerenderable && !isSkip) {
      const prerenderUrl = `${PRERENDER_ORIGIN}?path=${encodeURIComponent(url.pathname + url.search)}`;
      const upstream = await fetch(prerenderUrl, {
        cf: { cacheTtl: 600, cacheEverything: true },
      });
      const html = await upstream.text();
      return new Response(html, {
        status: upstream.status,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, s-maxage=600, stale-while-revalidate=86400",
          "x-served-by": "prerender-edge",
        },
      });
    }

    // 3. Tudo o mais: SPA Lovable
    return fetch(request);
  },
};
```

### Routes a configurar no Cloudflare

Em **Workers & Pages → seu Worker → Triggers → Routes**, adicione (substitua o `/robots.txt` único atual):

- `emporiolelecute.com.br/*`
- `www.emporiolelecute.com.br/*`

(Capturar `/*` é necessário porque agora o Worker precisa inspecionar o UA de qualquer rota; ele continua passando humanos direto pro Lovable via `return fetch(request)`.)

## Validação

```bash
# 1. Humano vê SPA normal (sem alteração de comportamento):
curl -s https://emporiolelecute.com.br/produto/qualquer-slug | grep -c "id=\"root\""
# espera: 1

# 2. Googlebot vê HTML prerenderizado com title correto:
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://emporiolelecute.com.br/produto/SLUG-REAL | grep -E "<title>|x-prerender"

# 3. WhatsApp / Facebook vê OG tags com imagem e descrição corretas:
curl -s -A "facebookexternalhit/1.1" https://emporiolelecute.com.br/categoria/casamento | \
  grep -E 'og:title|og:image|og:description'

# 4. Rota inválida retorna 200 + noindex (anti soft-404):
curl -s -A "Googlebot" https://emporiolelecute.com.br/rota-inexistente | grep "noindex"
```

## Matriz de rotas

| Rota | Prerender p/ bots | Indexável |
|---|---|---|
| `/` | ✅ | ✅ |
| `/produtos` | ✅ | ✅ |
| `/produto/:slug` | ✅ | ✅ (respeita `seo_noindex`) |
| `/categoria/:slug` | ✅ | ✅ (respeita `is_indexed`) |
| `/ocasiao/:slug` | ✅ | ✅ (respeita `is_indexed`) |
| `/tag/:slug` | ✅ | ✅ |
| `/sobre`, `/contato`, `/envio`, `/orcamento`, `/depoimentos`, `/blog` | ✅ | ✅ |
| `/lembrancinhas-*` | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ |
| `/carrinho`, `/rastrear`, `/loja`, `/buscar` | ❌ | ❌ |
| qualquer rota desconhecida | ✅ (com noindex) | ❌ |

## Impacto esperado

| Métrica | Antes | Depois |
|---|---|---|
| Googlebot vê `<title>` correto sem JS | só `/` | todas as rotas críticas |
| Preview WhatsApp/LinkedIn por produto | fallback genérico | título + descrição + imagem corretos |
| Soft-404 risk | alto (200 + index) | zero (200 + noindex) |
| UX humano | inalterada | inalterada |
| Custo extra | n/a | ~$0–2/mês (volume de bots é baixo) |

## Plano de rollback

1. **Reverter Worker** no Cloudflare para a versão antiga (só `/robots.txt`). Bots voltam a ver o SPA. Tempo: < 2 min.
2. **Opcional**: deletar a Edge Function `prerender`. Sem efeito se o Worker já não a chama.

Zero downtime. Zero risco para usuários humanos durante e depois.

## Manutenção

- Quando adicionar uma nova rota pública indexável, adicionar pattern em `PRERENDER_PATH` (Worker) e — se precisar de SEO específico — um handler em `resolve()` na Edge Function.
- O sitemap (`generate-sitemap`) e o prerender devem cobrir o mesmo conjunto de rotas. Drift = bug.
