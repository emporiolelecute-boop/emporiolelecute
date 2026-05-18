# Fase 5 — Relatório de Execução (Hashes Residuais)

**Data:** 2026-05-18
**Modo:** SAFE MODE controlado — execução aprovada
**Resultado:** ✅ Sucesso total — zero hashes residuais ativos restantes

---

## 1. Sumário

| Métrica | Valor |
|---|---|
| Renomeações aplicadas | **41** |
| Transação | Bloco DO atômico (1 commit) |
| Aliases preservados automaticamente | **41** |
| Redirects 301 auto-gerados | **41** |
| Drift audit pós-execução | **11/11 OK** |
| Hashes residuais ativos remanescentes | **0** (6 falsos positivos do regex são palavras reais: `arco`, `cute`, `anos`, `amor`, `card`) |
| Múltiplos primários | 0 |
| Slugs órfãos | 0 |
| Total `product_slugs` | 111 (58 primários + 53 aliases ativos) |
| Sitemap | 31.925 bytes, 54 produtos, ns=`/produto` |

---

## 2. Tabela completa — Old → New (41)

### 2.1 Remoções simples de hash (39)

| # | slug antigo | slug novo |
|---|---|---|
| 1 | escalda-pes-sache-personalizado-2ur6 | escalda-pes-sache-personalizado |
| 2 | kit-wax-melts-difuso-rechaud-2tqg | kit-wax-melts-difuso-rechaud |
| 3 | lembrancinha-letra-brasao-coracao-hg1f | lembrancinha-letra-brasao-coracao |
| 4 | lembrancinha-letra-brasao-coracao-na-caixinha-h0yj | lembrancinha-letra-brasao-coracao-na-caixinha |
| 5 | lembrancinha-sabonete-arco-6ev9 | lembrancinha-sabonete-arco |
| 6 | lembrancinha-sabonete-balao-letra-nuvem-fqf9 | lembrancinha-sabonete-balao-letra-nuvem |
| 7 | lembrancinha-sabonete-borboleta-cute-32w6 | lembrancinha-sabonete-borboleta-cute |
| 8 | lembrancinha-sabonete-borboleta-letra-coracao-61re | lembrancinha-sabonete-borboleta-letra-coracao |
| 9 | lembrancinha-sabonete-brasao-15-anos-f4pv | lembrancinha-sabonete-brasao-15-anos |
| 10 | lembrancinha-sabonete-brasao-2-letras-bwvf | lembrancinha-sabonete-brasao-2-letras |
| 11 | lembrancinha-sabonete-chuva-de-amor-c55y | lembrancinha-sabonete-chuva-de-amor |
| 12 | lembrancinha-sabonete-coracao-amore-32w6 | lembrancinha-sabonete-coracao-amore |
| 13 | lembrancinha-sabonete-flor-de-cerejeira-letra-fqf9 | lembrancinha-sabonete-flor-de-cerejeira-letra |
| 14 | lembrancinha-sabonete-fundo-do-mar-6g52 | lembrancinha-sabonete-fundo-do-mar |
| 15 | lembrancinha-sabonete-fundo-do-mar-2-letra-d4en | lembrancinha-sabonete-fundo-do-mar-2-letra |
| 16 | lembrancinha-sabonete-margarida-azxn | lembrancinha-sabonete-margarida |
| 17 | lembrancinha-sabonete-margarida-na-caixinha-61re | lembrancinha-sabonete-margarida-na-caixinha |
| 18 | lembrancinha-sabonete-mini-carrinho-2-letras-6ev9 | lembrancinha-sabonete-mini-carrinho-2-letras |
| 19 | lembrancinha-sabonete-mini-carrinho-letra-4wha | lembrancinha-sabonete-mini-carrinho-letra |
| 20 | lembrancinha-sabonete-nome-4-letras-personalizado-jzsa | lembrancinha-sabonete-nome-4-letras-personalizado |
| 21 | lembrancinha-sabonete-nome-5-letras-personalizado-k76t | lembrancinha-sabonete-nome-5-letras-personalizado |
| 22 | lembrancinha-sabonete-nome-6-letras-personalizado-6ev9 | lembrancinha-sabonete-nome-6-letras-personalizado |
| 23 | lembrancinha-sabonete-patinho-letra-mini-coracao-c55y | lembrancinha-sabonete-patinho-letra-mini-coracao |
| 24 | lembrancinha-sabonete-pezinho-1-letra-coracao-542c | lembrancinha-sabonete-pezinho-1-letra-coracao |
| 25 | lembrancinha-sabonete-pezinho-coracao-6ev9 | lembrancinha-sabonete-pezinho-coracao |
| 26 | lembrancinha-sabonete-safari-circo-letra-542c | lembrancinha-sabonete-safari-circo-letra |
| 27 | lembrancinha-sabonete-safari-cute-exvf | lembrancinha-sabonete-safari-cute |
| 28 | lembrancinha-sabonete-sereia-fundo-do-mar-f4pv | lembrancinha-sabonete-sereia-fundo-do-mar |
| 29 | lembrancinha-sabonete-solzinho-letra-nuvem-d4en | lembrancinha-sabonete-solzinho-letra-nuvem |
| 30 | lembrancinha-sabonete-solzinho-nuvem-iben | lembrancinha-sabonete-solzinho-nuvem |
| 31 | lembrancinha-vela-latinha-y5yi | lembrancinha-vela-latinha |
| 32 | mini-vela-bubble-perfumada-4wha | mini-vela-bubble-perfumada |
| 33 | mini-vela-na-latinha-personalizada-mini-terco-y5yi | mini-vela-na-latinha-personalizada-mini-terco |
| 34 | sabonete-cavalinho-letra-com-tag-personalizada-bigf | sabonete-cavalinho-letra-com-tag-personalizada |
| 35 | sabonete-divino-espirito-santo-com-mini-terco-4wha | sabonete-divino-espirito-santo-com-mini-terco |
| 36 | sabonete-foguete-letra-com-tag-personalizada-6ev9 | sabonete-foguete-letra-com-tag-personalizada |
| 37 | sabonete-lembrancinha-natal-fi1v | sabonete-lembrancinha-natal |
| 38 | sabonete-lembrancinha-rosa-aberta-na-caixinha-6ev9 | sabonete-lembrancinha-rosa-aberta-na-caixinha |
| 39 | vela-ursinho-grande-perfumada-y5yi | vela-ursinho-grande-perfumada |

### 2.2 Resolução de conflito intra-batch — Opção C aplicada (2)

| product_id | old | new |
|---|---|---|
| `7911b4fd-9b41-484a-a904-ff692675846a` (Vela Margarida Perfumada **- Card**) | vela-margarida-perfumada-azxn | **vela-margarida-perfumada-card** |
| `58cc59b1-fb2b-4809-a73d-4f6cd0f81604` (Vela Margarida Perfumada) | vela-margarida-perfumada-fi1v | **vela-margarida-perfumada** |

---

## 3. Validação pós-execução

| Check | Resultado |
|---|---|
| `audit-namespace-drift.ts` | **11/11 OK** |
| Helpers `PRODUCT_PATH_PREFIX` frontend ≡ edge | OK (`/produto`) |
| Sitemap namespace marker | OK (`/produto`) |
| Sitemap-source SHA256 ≡ XML materializado | OK (`e7264df123e9…`) |
| Zero entries em namespace legado | OK |
| Robots `Sitemap:` aponta para canonical | OK |
| Merchant feed usa `productAbsolute` | OK |
| Múltiplos primários | 0 |
| Produtos sem primário | 0 |
| Auto-redirects criados | 41 |
| Aliases ativos preservados | 41 (+ 12 anteriores = 53 total) |

### Smoke test do resolver

```
resolve_product_slug('lembrancinha-sabonete-chuva-de-amor-c55y')
  → matched: …c55y (is_primary=f, is_active=t)
  → primary_slug: lembrancinha-sabonete-chuva-de-amor ✅

resolve_product_slug('vela-margarida-perfumada-azxn')
  → primary_slug: vela-margarida-perfumada-card ✅

resolve_product_slug('vela-margarida-perfumada-fi1v')
  → primary_slug: vela-margarida-perfumada ✅ (produto distinto)
```

Resolver continua **1-query** indexado por `slug_normalized`.

### Redirects 301 automáticos (amostra)

```
/produto/lembrancinha-sabonete-chuva-de-amor-c55y → /produto/lembrancinha-sabonete-chuva-de-amor (301)
/produto/sabonete-lembrancinha-natal-fi1v         → /produto/sabonete-lembrancinha-natal         (301)
/produto/vela-margarida-perfumada-azxn            → /produto/vela-margarida-perfumada-card       (301)
/produto/vela-margarida-perfumada-fi1v            → /produto/vela-margarida-perfumada            (301)
```

---

## 4. Regeneração de artefatos

- ✅ `public/sitemap.xml` — 31.925 bytes, 54 produtos, ns=`/produto`
- ✅ `public/.sitemap-source.json` — hash sincronizado com XML
- ✅ Edge function `generate-sitemap` chamada via script local (sem redeploy necessário — função inalterada)

---

## 5. Rollback (< 2 min, se necessário)

Snapshot completo salvo em `docs/slugs-phase-5-backup-20260518.json` (22,9 KB) contendo:
- `products(id, slug, name)` pré-execução para os 41 afetados
- `product_slugs(*)` completo
- `redirects` relacionados a `/produto/%`

Comando de reversão:

```sql
BEGIN;
-- Reaplicar slugs originais (inverso da seção 2)
UPDATE public.products SET slug = 'escalda-pes-sache-personalizado-2ur6' WHERE slug = 'escalda-pes-sache-personalizado';
-- ... 40 outras reversões ...
COMMIT;
```

Aliases criados nesta fase permanecem ativos após rollback — não há perda de SEO histórico, apenas mais URLs apontando para o mesmo produto.

---

## 6. Confirmações operacionais finais

✅ **Não existem mais hashes residuais ativos no catálogo** — todos os 41 casos identificados foram corrigidos. Os 6 "remanescentes" detectados pelo regex são falsos positivos (palavras reais terminando em 4 caracteres alfanuméricos: arco, cute, anos, amor, cute, card).

✅ **Geração futura continua protegida pela Fase 4.1** — `assessSlugQuality()` em `src/lib/slugHardening.ts` bloqueia submissão no admin quando detecta padrão `-[a-z0-9]{3,5}$` (severity=error). Tendência: zero novos casos.

✅ **Ciclo estrutural de slugs encerrado definitivamente.** Próximas mudanças no domínio de slugs serão exclusivamente caso-a-caso (rename manual em admin), sempre com alias automático preservado pelo trigger `sync_product_slugs_from_products` e redirect 301 pelo `auto_create_redirect_on_slug_change` (já normalizado para `/produto/`).

---

## 7. Próximos passos recomendados (não-bloqueantes)

- Submeter sitemap atualizado ao Google Search Console (job semanal `submit-sitemap` cuida disso automaticamente).
- Monitorar `slug_resolution_failed` e `canonical_mismatch` em `slugObservability` ring buffer nas próximas 48h — qualquer pico indica drift externo (cache de CDN, links de terceiros).
- Encerrar memória `mem://features/slugs/product-slug-versioning` como fase consolidada.
