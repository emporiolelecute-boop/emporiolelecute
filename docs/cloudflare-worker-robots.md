# Cloudflare Worker — robots.txt dinâmico no domínio raiz

A Edge Function `robots-txt` está publicada em:
`https://xfqffqxqiuqauefrrcxn.supabase.co/functions/v1/robots-txt`

Para servir esse conteúdo direto em `https://emporiolelecute.com.br/robots.txt`
(sem perder a SPA hospedada no Lovable), use um Cloudflare Worker na frente do domínio.

## 1. Habilitar Cloudflare como proxy

No DNS da Cloudflare deixe os registros A para `emporiolelecute.com.br` e `www`
apontando para `185.158.133.1` com nuvem **laranja** (proxied). No painel do Lovable,
ao conectar o domínio, marque "Domain uses Cloudflare or a similar proxy".

## 2. Worker

```js
// worker.js — Cloudflare Worker
const ROBOTS_ORIGIN = "https://xfqffqxqiuqauefrrcxn.supabase.co/functions/v1/robots-txt";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      const upstream = await fetch(ROBOTS_ORIGIN, {
        cf: { cacheTtl: 300, cacheEverything: true },
      });
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

    // Tudo o mais segue para o Lovable
    return fetch(request);
  },
};
```

## 3. Rota do Worker

Em **Cloudflare → Workers & Pages → seu Worker → Triggers → Routes**, adicione:

- `emporiolelecute.com.br/robots.txt`
- `www.emporiolelecute.com.br/robots.txt`

Pronto: o `robots.txt` passa a refletir o `robots_config` gerenciado no painel admin
sem afetar o resto do site.

## Validação

```bash
curl -I https://emporiolelecute.com.br/robots.txt
# espera: HTTP/2 200, x-robots-source: lovable-edge-function
curl https://emporiolelecute.com.br/robots.txt
```
