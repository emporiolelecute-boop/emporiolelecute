# Fase 4.1 — Hardening Final dos Slugs

**Data:** 2026-05-18
**Modo:** SAFE — apenas guardrails. Zero alteração de URLs públicas, canonical, sitemap, rotas ou merchant feed.

---

## 1. Dívida técnica corrigida

### Trigger `auto_create_redirect_on_slug_change`

**Antes:** `products` ainda emitia `/produtos/old → /produtos/new` (legado).
**Agora:** emite `/produto/old → /produto/new` (canônico Fase 2.2).

- Demais taxonomias (`categories`, `tags`, `occasions`, `segments`) **inalteradas**.
- Redirects já existentes **preservados** (continuam respondendo via `LegacyProductRedirect`).
- Mecanismo anti-cadeia mantido: se um redirect antigo apontava para o slug que mudou, o destino é atualizado in-place (flatten A→B→C ⇒ A→C).
- Rollback: aplicar `CREATE OR REPLACE FUNCTION` revertendo `/produto/` para `/produtos/` em uma única linha.

---

## 2. Proteções adicionadas (definitivas)

### `src/lib/slugHardening.ts`

| Proteção | Implementação | Garantia |
|----------|---------------|----------|
| **Truncamento token-aware** | `generateSafeSlug()` corta apenas em `-`, nunca no meio de palavra | Hash residual e palavras cortadas **não conseguem mais ser geradas pelo admin** |
| **Stopwords primeiro** | Remove `de/da/do/no/na/em/com/para/por` do fim antes de cortar tokens semânticos | Preserva conteúdo significativo |
| **Sem hash automático** | Gerador **nunca** adiciona sufixo aleatório | Padrão `-ii6z`, `-c55y` etc. extinto na origem |
| **Preserva numerais e ordem** | `3-letras`, `15-anos` mantidos; ordem dos tokens inalterada | Compatível com regra conservadora da Fase 4 |
| **Detector de hash residual** | `assessSlugQuality()` flagga `-[a-z0-9]{3,5}$` quando contém dígito ou não tem vogal | Erro **bloqueante** no submit |
| **Detector de truncamento** | Warn se último token tem ≤ 2 chars e não é stopword/número | Aviso visual no admin |
| **Comprimento** | Warn > 60 chars, erro > 75 chars | UI orientativa |

### `src/pages/admin/AdminProductForm.tsx`

- `generateSlug` agora delega para `generateSafeSlug` (token-aware).
- Submit bloqueia quando `assessSlugQuality` retorna `error` (com toast explicativo).
- Aviso visual inline abaixo do status de disponibilidade: warnings em âmbar, erros em destrutivo.
- Tracking emite `slug_generation_blocked` em bloqueios (sem PII).

### `src/lib/adminUsage.ts`

- Novos eventos client-side (ring buffer existente, zero backend novo):
  - `slug_generation_blocked` — submit barrado por qualidade
  - `slug_quality_warning` — reservado para futuro
- Mantém política Fase 2.3: sem persistência server-side, sem dashboard.

---

## 3. Testes (40/40 passando)

| Arquivo | Testes |
|---------|--------|
| `slugHardening.test.ts` (novo) | **14** — truncamento, hash, stopwords, numerais, comprimento |
| `slug.test.ts` | 13 |
| `seoSurfaceDrift.test.ts` | 6 |
| `productResolver.test.ts` | 7 |

Casos críticos cobertos:
- Slug de 75 chars → nunca corta no meio de palavra, sempre em `-`
- Geração nunca produz `-[a-z0-9]{4}$`
- Hashes históricos (`ii6z`, `hxsv`, `bwvf`, `js6l`) detectados como **error**
- Tokens finais truncados (`c`, `se`) detectados como **warn**
- Stopwords legítimas (`no-tule`, `com-tag`) **não geram falso positivo**

---

## 4. Auditoria de regressão

`scripts/audit-namespace-drift.ts` → **11/11 OK**

- Helpers (frontend × edge): consistentes
- Sitemap: marker + hash + namespace `/produto` íntegros
- Robots.txt: aponta para canonical origin
- Hardcodes `/produto(s)/${…}` fora dos helpers: **zero**
- Merchant feed: usa `productAbsolute` (helper)
- Aliases históricos: continuam resolvendo (verificado via `resolve_product_slug` — Fase 4 deixou 24 registros em `product_slugs` para os 12 SKUs renomeados)

Nenhum hardcode `/produtos/` novo introduzido.

---

## 5. Confirmação explícita

> **Hash residual (`-ii6z`, `-c55y`, etc.) NÃO consegue mais reaparecer.**

Razões:
1. O gerador `generateSafeSlug` é determinístico e nunca emite sufixo aleatório.
2. O assessor `assessSlugQuality` bloqueia hashes residuais no submit.
3. Truncamento é token-aware: comprimento excessivo nunca causa corte mid-word.
4. Caminho de admin é o único origem realista de novos slugs (criação manual ou auto-gerada).

---

## 6. Rollback

Cada mudança é independente e reversível:

| Mudança | Como reverter |
|---------|---------------|
| Trigger `/produto/` → `/produtos/` | Migration `CREATE OR REPLACE` invertendo o `CASE` para `products` |
| Hardening UI | Reverter o import e o early-return em `handleSubmit` |
| `slugHardening.ts` | Apagar arquivo + remover usos (gerador volta a ser inline) |
| Events de tracking | Remover dois itens do union `AdminUsageEventType` |

Janela total: **< 5 min**, zero migração de dados, zero deploy de edge function.

---

## 7. Não fizemos (proposto, fora de escopo)

- ❌ Cloudflare Worker / 301 server-side — sem trigger ainda (decisão Fase 2.3, monitorar D+30).
- ❌ Constraint em `products.slug` proibindo padrão hash — deliberadamente evitado para não bloquear histórico legado.
- ❌ ESLint rule contra construção manual de URLs de produto — proposta para backlog (P2, baixo risco).
- ❌ Aplicar o mesmo gerador para `AdminBlog`, `AdminKitForm`, `AdminCollectionForm`, etc. — eles têm os mesmos `slugify` inline mas geram slugs naturalmente curtos (sem histórico de hash). Pode entrar em fase futura.

---

## 8. Status final

| Critério | Status |
|----------|--------|
| Dívida do trigger | ✅ Resolvida |
| Gerador token-aware | ✅ Em produção |
| Assessor de qualidade | ✅ Em produção |
| Bloqueio de hash no submit | ✅ Ativo |
| Aviso visual no admin | ✅ Ativo |
| Aliases históricos | ✅ Preservados |
| Drift audit | ✅ 11/11 |
| Testes | ✅ 40/40 |
| Sitemap | ✅ 54 produtos, ns=/produto |
| Canonical / merchant feed | ✅ Inalterados |

**Ciclo de slugs encerrado.** Sistema entra em modo de manutenção estável — futuras alterações são pontuais (conteúdo), não estruturais.
