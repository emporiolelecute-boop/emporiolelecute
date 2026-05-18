# Fase 5 — Auditoria de Hash Residual em Slugs Ativos

**Modo:** SAFE MODE ABSOLUTO — apenas auditoria, **nenhuma alteração aplicada**.
**Data:** 2026-05-18
**Escopo:** Slugs ativos em `products` que terminam em `-[a-z0-9]{4}` (hash residual de 4 chars).

---

## 1. Sumário executivo

| Métrica | Valor |
|---|---|
| Slugs ativos com hash residual | **41** |
| Palavras truncadas detectadas | **0** (todos são palavras inteiras + hash) |
| Colisões com outros produtos (`product_slugs`) | **0** |
| Colisões com `reserved_slugs` | **0** |
| Bloqueios em `redirects.from_path` | **0** |
| Self-aliases já existentes | **0** |
| **Colisões intra-batch** (2 produtos → mesmo slug limpo) | **1 par** ⚠️ |

**Conclusão:** **39 slugs** podem ter o hash removido com segurança 1:1. **2 slugs** (`vela-margarida-perfumada-*`) competem pelo mesmo nome limpo e exigem decisão manual.

---

## 2. Classificação

### 2.1 Padrão único detectado

Todos os 41 casos seguem **`<palavra-inteira>-<hash4>`**, sem truncamento mid-word.
Remover apenas o sufixo `-xxxx` preserva integralmente:
- ordem dos tokens
- numerais (`2-letras`, `15-anos`, `1-letra`)
- stopwords (`de`, `na`, `com`)
- acentos já normalizados
- legibilidade

Nenhum caso justifica reescrita semântica.

### 2.2 Risco SEO

- **Baixo** para os 39 casos limpos: alias antigo será preservado automaticamente pelo trigger `sync_product_slugs_from_products` e redirect 301 será auto-criado por `auto_create_redirect_on_slug_change` (já normalizado para namespace `/produto/` na Fase 4.1).
- **Bloqueante** para o par em conflito (item 4).

---

## 3. Tabela completa — slugs aprovados para rename (39)

| # | current_slug | proposed_slug |
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

---

## 4. Conflito intra-batch — exige decisão manual ⚠️

Dois produtos distintos colapsariam para o **mesmo** slug limpo `vela-margarida-perfumada`:

| product_id | current_slug | name | created_at |
|---|---|---|---|
| `7911b4fd-9b41-484a-a904-ff692675846a` | vela-margarida-perfumada-azxn | **Vela Margarida Perfumada - Card** | 2026-01-05 |
| `58cc59b1-fb2b-4809-a73d-4f6cd0f81604` | vela-margarida-perfumada-fi1v | **Vela Margarida Perfumada** | 2026-01-05 |

**Opções (não decidir automaticamente):**

- **A.** Manter ambos como estão (preservar hash). Mais conservador.
- **B.** Limpar o produto "puro" (`-fi1v` → `vela-margarida-perfumada`) e manter o outro com hash (`-azxn`).
- **C.** Renomear o "Card" para um sufixo semântico (`vela-margarida-perfumada-card`) e limpar o outro. **Recomendado** — preserva legibilidade, evita hash, sem colisão.
- **D.** Desativar/unificar produtos no admin (fora do escopo desta fase).

---

## 5. Garantias de segurança verificadas

- ✅ Trigger `sync_product_slugs_from_products` cria alias automático para o slug antigo (`is_active=true, is_primary=false`).
- ✅ Trigger `auto_create_redirect_on_slug_change` insere `/produto/<old> → /produto/<new>` (301) e aplica flatten para evitar cadeias A→B→C.
- ✅ Resolver `resolve_product_slug` continua 1-query, indexado por `slug_normalized`.
- ✅ `reserved_slugs` e `redirects.from_path` não bloqueiam nenhum dos 39 propostos.
- ✅ `product_slugs` não tem nenhum slug limpo já associado a outro produto.
- ✅ Sitemap (`/produto/` namespace) e merchant feed serão regenerados pelo gatilho `mark_sitemap_dirty` → próxima execução do cron `generate-sitemap`.
- ✅ Canonical centralizado via `primarySlug` do resolver — sem hardcode.

---

## 6. Plano de execução SAFE (proposto — **não aplicar ainda**)

### Pré-flight
1. Snapshot de `products(id, slug)` e `product_slugs(*)` para os 39 produtos (rollback rápido).
2. Confirmar resposta sobre o item 4 (par `vela-margarida-perfumada`).

### Execução (transação única)
```sql
BEGIN;
UPDATE public.products SET slug = 'escalda-pes-sache-personalizado'
  WHERE id = '<uuid>' AND slug = 'escalda-pes-sache-personalizado-2ur6';
-- ... 38 outros UPDATEs idênticos ...
COMMIT;
```

O trigger faz automaticamente:
- desmarca slug antigo como `is_primary=false`, mantém `is_active=true` (alias)
- promove novo como `is_primary=true`
- insere/flatten redirect 301

### Pós-execução
1. `scripts/audit-namespace-drift.ts` → esperar 11/11 OK.
2. Verificar `product_slugs` count = 39 produtos × 2 slugs cada (1 primary + 1 alias).
3. Disparar `generate-sitemap` (cron ou manual) — esperar 54 URLs.
4. Smoke test: GET `/produto/<slug-antigo>` → 301 → GET `/produto/<slug-novo>` → 200.

---

## 7. Rollback (<2 min)

```sql
BEGIN;
UPDATE public.products SET slug = 'escalda-pes-sache-personalizado-2ur6'
  WHERE id = '<uuid>' AND slug = 'escalda-pes-sache-personalizado';
-- ... reverso ...
COMMIT;
```

O trigger re-promove o slug antigo. Aliases criados na ida permanecem ativos (sem impacto SEO — apenas mais URLs apontando para o produto).

---

## 8. Recomendação final

- ✅ **Aplicar os 39 renames seguros** em transação única — risco mínimo, ganho de legibilidade alto.
- ⏸️ **Aguardar decisão** sobre o par `vela-margarida-perfumada` (opção C recomendada).
- ❌ **Não tocar** em hashes residuais futuros que possam surgir de produtos novos — `assessSlugQuality` (Fase 4.1) já bloqueia geração de slugs com hash no admin, então a tendência é a zero novos casos.

**Status:** Auditoria concluída. Aguardando aprovação explícita para Fase 5 — Execução.
