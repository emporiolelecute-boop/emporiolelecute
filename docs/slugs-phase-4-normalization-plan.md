# Fase 4 — Normalização Final dos Slugs de Produto

**Modo:** SAFE / AUDITORIA. Nenhuma alteração aplicada. Aguardando aprovação explícita.
**Data:** 2026-05-18
**Escopo:** remoção dos hashes residuais (`-xxxx`) e truncamentos mid-word em slugs primários ativos.

---

## 1. Auditoria — slugs truncados detectados

Critério da query: `length(slug) >= 50` **OU** termina em `-[a-z0-9]{4}` (assinatura do hash residual histórico).

Resultado: **12 produtos** (Fase 3 reportou 10; reaudit revelou +2). Todos com `hit_count = 0` em `product_slugs` — **nenhum tráfego registrado nas URLs truncadas**, o que indica que o canonical limpo já era o objetivo e que o impacto SEO da renomeação é mínimo a positivo.

| # | Produto | Slug atual (55 chars) | Slug proposto | Tipo |
|---|---------|------------------------|---------------|------|
| 1 | Lembrancinha Anjinho Cute + Letra com Tag Personalizada | `lembrancinha-anjinho-cute-letra-com-tag-personaliz-ciej` | `lembrancinha-anjinho-cute-letra-tag-personalizada` | hash + corte mid-word (`personaliz`) |
| 2 | Lembrancinha Sabonete Dinossauro Cute + Letra + Mini Coração | `lembrancinha-sabonete-dinossauro-cute-letra-mini-c-irm7` | `lembrancinha-sabonete-dinossauro-cute-letra-coracao` | hash + corte mid-word (`c`) |
| 3 | Lembrancinha Sabonete Fundo do Mar + Letra + Mini Coração | `lembrancinha-sabonete-fundo-do-mar-letra-mini-cora-ii6z` | `lembrancinha-sabonete-fundo-do-mar-letra-coracao` | hash + corte mid-word (`cora`) |
| 4 | Lembrancinha Sabonete Patinho com Tag Personalizada | `lembrancinha-sabonete-patinho-com-tag-personalizad-exvf` | `lembrancinha-sabonete-patinho-tag-personalizada` | hash + corte mid-word (`personalizad`) |
| 5 | Lembrancinha Sabonete Pezinho no Tule com Tag Personalizada | `lembrancinha-sabonete-pezinho-no-tule-com-tag-pers-5lva` | `lembrancinha-sabonete-pezinho-tule-tag-personalizada` | hash + corte mid-word (`pers`) |
| 6 | Lembrancinha Sabonete Safari Cute com Tag Personalizada | `lembrancinha-sabonete-safari-cute-com-tag-personal-fqf9` | `lembrancinha-sabonete-safari-cute-tag-personalizada` | hash + corte mid-word (`personal`) |
| 7 | Lembrancinha Sabonete Ursinho + 1 Letra + Mini Coração | `lembrancinha-sabonete-ursinho-1-letra-mini-coracao-bigf` | `lembrancinha-sabonete-ursinho-letra-mini-coracao` | hash residual; "1" descartado |
| 8 | Mini Vela na Latinha Personalizada com Mensagem Secreta | `mini-vela-na-latinha-personalizada-com-mensagem-se-y5yi` | `mini-vela-latinha-personalizada-mensagem-secreta` | hash + corte mid-word (`se`) |
| 9 | Sabonete Cavalinho Cute + Letra com Tag Personalizada | `sabonete-cavalinho-cute-letra-com-tag-personalizad-bwvf` | `sabonete-cavalinho-cute-letra-tag-personalizada` | hash + corte mid-word (`personalizad`) |
| 10 | Sabonete Letra Brasão + Espirito Santo com Mini Terço | `sabonete-letra-brasao-espirito-santo-com-mini-terc-hxsv` | `sabonete-letra-brasao-espirito-santo-mini-terco` | hash + corte mid-word (`terc`) |
| 11 | Sabonete Letra Inicial Brasão com Tag Personalizada | `sabonete-letra-inicial-brasao-com-tag-personalizad-hquh` | `sabonete-letra-inicial-brasao-tag-personalizada` | hash + corte mid-word (`personalizad`) |
| 12 | Lembrancinha Sabonete Nome + 3 Letras Personalizado | `lembrancinha-sabonete-nome-3-letras-personalizado-js6l` | `lembrancinha-sabonete-nome-3-letras-personalizado` | apenas hash residual (palavra completa) |

### Classificação

| Classe | Itens |
|--------|-------|
| **Seguro p/ rename automático** | #7, #12 (hash claramente residual; palavra completa preservada) |
| **Seguro c/ reconstrução semântica** | #1, #2, #3, #4, #5, #6, #8, #9, #10, #11 (remoção do hash + reconstrução da palavra cortada + remoção de stopwords `com`/`no`/`na`) |
| **Requer revisão manual** | — |
| **Não mexer** | — |

Princípio aplicado: **nunca apenas remover o hash final** — sempre reconstruir o token cortado, encurtar removendo stopwords (`com`, `no`, `na`) e o numeral "1" decorativo no #7. Comprimento final: **47–52 chars** (saudável).

---

## 2. Detecção de colisões

Query executada contra `product_slugs.slug_normalized` + `reserved_slugs` para os 12 novos slugs (normalização `unaccent` + lowercase):

| Verificação | Resultado |
|-------------|-----------|
| Colisão exata | **0** |
| Colisão normalizada | **0** |
| Slug reservado (`reserved_slugs`) | **0** |
| Alias histórico ocupado | **0** |
| Redirect existente apontando para o destino novo | **0** (auditado via `redirects.to_path`) |

**Risco de colisão: ZERO.** Nenhum fallback `-2` necessário.

Adicional: similaridade entre os novos (Jaccard de tokens) — todos com diferença ≥ 2 tokens distintos do vizinho mais próximo. Sem ambiguidade semântica.

---

## 3. Dry-run — comportamento esperado por rename

Mecânica garantida pelo trigger `sync_product_slugs_from_products` (já em produção, auditado):

```text
UPDATE products SET slug='novo' WHERE id=X
  → trigger desmarca primário antigo
  → trigger insere novo como primário (source='rename')
  → trigger mantém slug antigo como alias ativo (is_active=true, is_primary=false)
  → hit_count do alias antigo preservado
  → auto_create_redirect_on_slug_change insere /produtos/old → /produtos/new (301 em redirects)
  → mark_sitemap_dirty marca regeneração
```

| Cenário | Resultado esperado | Cobertura |
|---------|--------------------|-----------|
| Rename simples (slug livre) | OK | trigger testado |
| Alias legado preservado | OK | `is_active=true` |
| `hit_count` mantido | OK (0 → 0 no nosso caso) | UPDATE não toca a linha antiga |
| Canonical final = novo slug | OK | `urls.productCanonical(primarySlug)` resolve via `resolve_product_slug` |
| Redirect client-side `/produto/old` → `/produto/new` | OK | `ProductPage` faz `replace` quando `matched_slug !== primarySlug` (guarda `loop_prevented` ativa) |
| Resolver `primarySlug` | OK | retorna sempre o `is_primary=true` mais recente |
| Sitemap | OK | regenerado via `bun run scripts/generate-sitemap.ts` + redeploy `generate-sitemap` |
| Merchant feed | OK | usa `productPath(primarySlug)` — atualiza no próximo crawl |
| Structured data (JSON-LD) | OK | derivado do mesmo helper |
| Internal linking (BestSellers, Cross-sell, Related, Search, Cards) | OK | todos via `urls.product()` desde Fase 2.0 |
| React Query | OK | invalida via `useProducts` ao mutar |
| Observabilidade | OK | emite `slug_resolution_failed` apenas se `resolve_product_slug` retornar null |
| Loop de redirect | OK | guarda `loop_prevented` + `Navigate replace` 1-hop |
| Drift namespace | OK | `scripts/audit-namespace-drift.ts` continua passando (11/11) |
| Colisão | N/A (zero detectadas) | — |
| Rollback atômico | OK | UPDATE inverso recoloca o slug antigo como primário (alias→primary swap) |

**Observação técnica encontrada (não bloqueante):** `auto_create_redirect_on_slug_change` ainda usa prefixo `/produtos/` hardcoded. Após o flip da Fase 2.2, o canonical é `/produto/`. Os redirects gerados serão `/produtos/old → /produtos/new` — funcionais (pois `/produtos/*` ainda responde via `LegacyProductRedirect`), mas semanticamente desatualizados. **Recomendação:** documentar como débito da Fase 4.1 (ajuste de trigger para `/produto/`), **sem aplicar agora** para preservar SAFE MODE.

---

## 4. Plano de execução (após aprovação)

### Etapa A — Backup lógico

```sql
SELECT id, slug AS slug_old, /* slug_new from mapping */
  (SELECT array_agg(slug ORDER BY is_primary DESC, created_at)
   FROM product_slugs WHERE product_id = p.id) AS aliases_pre
FROM products p
WHERE id IN (12 ids);
```
Snapshot salvo em `docs/slugs-phase-4-backup-YYYYMMDD.json` antes de executar.

### Etapa B — Aplicação (lote único, transacional)

```sql
BEGIN;
UPDATE products SET slug = 'lembrancinha-anjinho-cute-letra-tag-personalizada'      WHERE id = '041b1756-...';
UPDATE products SET slug = 'lembrancinha-sabonete-dinossauro-cute-letra-coracao'    WHERE id = 'b5916106-...';
UPDATE products SET slug = 'lembrancinha-sabonete-fundo-do-mar-letra-coracao'       WHERE id = '1d505a10-...';
UPDATE products SET slug = 'lembrancinha-sabonete-patinho-tag-personalizada'        WHERE id = 'f342722c-...';
UPDATE products SET slug = 'lembrancinha-sabonete-pezinho-tule-tag-personalizada'   WHERE id = '92b1ecf0-...';
UPDATE products SET slug = 'lembrancinha-sabonete-safari-cute-tag-personalizada'    WHERE id = 'd2f91d36-...';
UPDATE products SET slug = 'lembrancinha-sabonete-ursinho-letra-mini-coracao'       WHERE id = '2ef56dc1-...';
UPDATE products SET slug = 'mini-vela-latinha-personalizada-mensagem-secreta'       WHERE id = 'c94381a3-...';
UPDATE products SET slug = 'sabonete-cavalinho-cute-letra-tag-personalizada'        WHERE id = 'c74db10e-...';
UPDATE products SET slug = 'sabonete-letra-brasao-espirito-santo-mini-terco'        WHERE id = 'a1522088-...';
UPDATE products SET slug = 'sabonete-letra-inicial-brasao-tag-personalizada'        WHERE id = 'e77312cb-...';
UPDATE products SET slug = 'lembrancinha-sabonete-nome-3-letras-personalizado'      WHERE id = '68a...';
-- Pré-validação dentro da TX:
SELECT count(*) FROM product_slugs WHERE is_primary AND product_id IN (12 ids); -- esperado: 12
SELECT count(*) FROM product_slugs WHERE product_id IN (12 ids);                -- esperado: 24 (12 novos primários + 12 aliases antigos)
COMMIT;
```

### Etapa C — Pós-validação

1. `count(primary)=12`, `count(aliases legados)=12`, `count(hit_count preservado)=12` ✓
2. `scripts/audit-namespace-drift.ts` → 11/11 ✓
3. `bun run scripts/generate-sitemap.ts` + `code--exec` redeploy de `generate-sitemap` e `merchant-feed`
4. Spot-check manual: abrir 3 produtos via slug antigo (`/produto/...-ciej`) — esperado: replace 1-hop para slug novo, sem loop, sem 404
5. Console: monitorar `historical_hit` (≥12 esperado nas primeiras horas se houver backlinks) e ausência de `slug_resolution_failed`
6. Search Console (D+7): re-submeter sitemap, observar troca de canonical nos 12 SKUs

---

## 5. Rollback

**Atômico e sem perda de histórico.** Mecânica simétrica:

```sql
BEGIN;
UPDATE products SET slug = 'lembrancinha-anjinho-cute-letra-com-tag-personaliz-ciej' WHERE id = '041b1756-...';
-- ... (12 reversões)
COMMIT;
```

Efeitos:
- O trigger promove o slug truncado de volta a `is_primary=true`
- Os slugs "novos" criados na aplicação ficam como aliases ativos (não são apagados)
- `hit_count` preservado em ambos
- `redirects` antigos permanecem (não causam dano: apontam old→new, mas o "new" agora é alias e resolve corretamente)
- Sitemap regenerado: 1 comando

Janela: **< 5 minutos**. Zero migração SQL nova. Zero deploy frontend.

---

## 6. Hardening pós-migração (proposta — não aplicar agora)

Adicionar ao backlog da Fase 4.1:

### Guardrails de geração de slug (admin form)

- **Comprimento alvo:** ≤ 60 chars (warning em 55+).
- **Truncamento token-aware:** se passar de 60, cortar no último `-` antes do limite. Nunca no meio de palavra.
- **Proibir hash residual:** rejeitar slugs gerados que terminem em `-[a-z0-9]{3,5}` (padrão histórico). Forçar regeneração ou edição manual.
- **Stopword stripping:** remover `com`, `no`, `na`, `de`, `da`, `do` antes de truncar.
- **Validação de qualidade semântica:** alerta se o slug terminar em token < 3 chars (provável corte).
- **Hook no `useSlugAvailability`:** expor severidade (`error` = colisão/reservado; `warn` = truncado/baixa qualidade).

### Guardrails de banco (opcional, defensivo)

- `CHECK` em `products.slug` proibindo `~ '-[a-z0-9]{3,5}$'` **apenas para novos INSERTs** (via trigger, não constraint, para preservar histórico).

---

## 7. Observabilidade pós-rename (sem persistência server-side)

Monitorar via `window.__slugEvents` (ring buffer Fase 2.3) por **D+7**:

| Evento | Esperado | Ação se anômalo |
|--------|----------|-----------------|
| `historical_hit` | ↑ nas primeiras 48h (backlinks externos aos 12 SKUs) | Confirma replace funcionando |
| `legacy_namespace_hit` | Estável (já em coexistência) | — |
| `canonical_mismatch` | 0 | Investigar imediatamente |
| `slug_resolution_failed` | 0 | Rollback imediato do SKU afetado |
| `loop_prevented` | 0 | Bug crítico — investigar |
| Aliases nunca acessados (após 30d) | ≥ 12 truncados sem hit | Mantém — backlinks de longo prazo |
| Aliases muito acessados | Improvável (hit_count=0 hoje) | Avaliar manter ou consolidar |

Sem alteração no `slugObservability.ts`. Apenas leitura via DevTools.

---

## 8. Matriz de risco final

| Slug # | Risco SEO | Risco UX | Risco técnico | Recomendação |
|--------|-----------|----------|---------------|--------------|
| 1–11 | **Baixo** (hit=0, canonical já era objetivo) | Nulo (alias preserva backlinks) | Nulo (trigger testado) | **Aplicar** |
| 12 | **Muito baixo** (apenas hash residual, palavra íntegra) | Nulo | Nulo | **Aplicar** |

Risco agregado: **BAIXO**. Benefício: CTR estimado +5–15% nos 12 SKUs (slugs legíveis em SERP), encerramento da migração estrutural.

---

## 9. Recomendação final

**APLICAR TODOS OS 12 RENAMES EM LOTE ÚNICO.**

Justificativas:
1. Zero colisões, zero tráfego perdido (hit_count=0 universal).
2. Infraestrutura (trigger, resolver, helpers, sitemap script, observabilidade) já validada em 3 fases anteriores.
3. Rollback atômico < 5min se necessário.
4. Encerra a migração estrutural — sistema entra em modo de manutenção incremental permanente.
5. Aliases preservados indefinidamente garantem zero quebra de backlinks externos.

**Pré-requisito:** aprovação explícita do usuário neste plano antes de qualquer execução.

**Pós-aplicação:** abrir Fase 4.1 (débito) para:
- Atualizar `auto_create_redirect_on_slug_change` para usar `/produto/` (novo namespace).
- Implementar guardrails de seção 6 no admin form.
