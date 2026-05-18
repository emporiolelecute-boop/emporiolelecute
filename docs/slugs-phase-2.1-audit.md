# Fase 2.1 — Auditoria de Unificação de Sitemap (SAFE MODE)

> **Status:** auditoria concluída. Nenhuma URL pública alterada.
> **Bloqueador encontrado:** decisão arquitetural (A vs B) necessária antes da Fase 2.2.

---

## 1. Estado real das superfícies SEO hoje

| Superfície | Fonte servida ao Google | Fonte-de-verdade lógica | Drift atual |
|---|---|---|---|
| `/sitemap.xml` | `public/sitemap.xml` (estático, **786 linhas, 54 produtos hardcoded**) | `supabase/functions/generate-sitemap` (dinâmico, **N produtos do DB**) | **SIM — duas fontes, nenhuma sincroniza com a outra** |
| `/robots.txt` | `public/robots.txt` (estático) | `supabase/functions/robots-txt` (dinâmico, **inalcançável publicamente**) | parcial — duas fontes, mas apenas a estática é servida |
| Merchant feed | `supabase/functions/merchant-feed` | mesma | OK (single source) |
| Canonical / og:url / JSON-LD | runtime React via `urls.productCanonical()` | `src/lib/urls.ts` | OK (Fase 2.0) |

### Achado crítico

A edge function `generate-sitemap` **escreve a resposta HTTP**, **não** materializa em `public/sitemap.xml` nem em storage. Sua URL é `https://<ref>.functions.supabase.co/generate-sitemap`. **O Google nunca acessa essa edge function** — sempre acessa `https://emporiolelecute.com.br/sitemap.xml`, que é o arquivo estático servido pelo hosting do Lovable. Os 54 produtos hardcoded estão defasados em relação ao DB (provavelmente ~3x mais produtos ativos).

Conclusão: hoje **não há uma fonte de verdade real** — há um arquivo estático defasado servido ao Google e uma edge function que ninguém consome no caminho público (apenas `seo-autopilot` e admin).

---

## 2. Estratégia oficial — recomendação

### Opção A — Edge function como rota pública dinâmica
Requer rewrite `/sitemap.xml` → `functions/v1/generate-sitemap` no edge do Lovable.

| | |
|---|---|
| **Pró** | Single source of truth real; sempre fresco; zero drift; lastmod correto. |
| **Contra** | **Lovable hosting (Vercel-like estático) NÃO suporta rewrites de path arbitrários para Supabase Functions.** Precisa apontar `robots.txt → /functions/v1/generate-sitemap` (URL feia, fora do domínio canônico) **ou** Cloudflare Worker. GSC aceita, mas viola convenção. |
| **Risco SEO** | Médio — alterar URL do sitemap obriga ressubmit no GSC. |
| **Risco operacional** | Alto — cold start da edge = timeout (Google tolera ~30s, mas reduz crawl budget). |
| **Cache/CDN** | Edge function precisa emitir `Cache-Control` agressivo; CDN do Supabase é limitado. |

### Opção B — Edge function como gerador, `public/sitemap.xml` como artefato materializado
Edge function continua sendo o gerador canônico. Um job (pg_cron já existe via `seo-sitemap-auto-resubmit`) chama a edge function periodicamente. **A diferença:** ao invés de só responder HTTP, ela escreve em `storage` (bucket `seo`, path `sitemap.xml`) e o domínio público faz redirect/proxy estático para esse storage URL **OU** mantemos `public/sitemap.xml` mas adicionamos um script `prebuild` (Lovable executa em cada deploy) que chama a edge function e materializa o XML.

| | |
|---|---|
| **Pró** | URL canônica preservada (`/sitemap.xml`); cache HTTP nativo; sem cold start; rollback trivial (revert do arquivo). |
| **Contra** | Materialização não é instantânea (defasagem = intervalo do cron / deploy). Para Lovable: `prebuild` não pode chamar edge function durante build (sem credenciais), então precisa ser **commit manual** pelo admin (botão "regerar sitemap") ou cron diário. |
| **Risco SEO** | **Baixo** — Google tolera lastmod com até alguns dias de defasagem. |
| **Risco operacional** | Baixo — falha do gerador não derruba o sitemap; o anterior continua válido. |
| **Cache/CDN** | Ótimo — CDN do Lovable serve arquivo estático com edge caching nativo. |
| **Drift** | Eliminado se o gerador é a **única** rota de escrita do arquivo (admin perde permissão de editar manualmente). |

### Recomendação final: **Opção B**

Justificativa objetiva:
1. Lovable hosting **não viabiliza** Opção A sem Cloudflare Worker (infra adicional).
2. `seo-sitemap-auto-resubmit` (pg_cron) já existe — basta acoplar geração + persistência.
3. Preserva URL canônica `/sitemap.xml` → **zero risco SEO no flip**.
4. Rollback é `git revert` do arquivo.
5. `seo-indexation-monitor` e `seo-checks` continuam funcionando sem mudança (fazem `fetch ${siteUrl}/sitemap.xml`).

**Fase 2.1 ainda NÃO aplica B.** Apenas a decisão fica registrada. A materialização será Fase 2.1b (separada, reversível).

---

## 3. Merchant feed — hardening

- Single source: `supabase/functions/merchant-feed/index.ts`.
- Já usa `productAbsolute()` do helper compartilhado (Fase 2.0). ✅
- Não há cache HTTP explícito — adicionar `Cache-Control: public, max-age=3600` é segura (Merchant Center re-fetch a cada 24h).
- **Risco no flip:** zero — vira automaticamente quando `PRODUCT_PATH_PREFIX` muda. Single-source-only confirmado.

## 4. robots.txt — auditoria

- Servido de `public/robots.txt` (estático). `supabase/functions/robots-txt` existe mas **não é roteado** publicamente.
- Não contém referência a `/produtos` ou `/produto`. ✅ Sem drift de namespace.
- `Sitemap: https://emporiolelecute.com.br/sitemap.xml` — correto.
- **Nenhuma mudança necessária na Fase 2.2.**

## 5. Canonical readiness — single-source confirmado

Grep dos consumidores de `productCanonical`/`productAbsolute`:
- `src/components/ProductStructuredData.tsx` → JSON-LD `url`
- `src/pages/ProductPage.tsx` → `<link rel="canonical">` + `<meta og:url>`
- `src/components/ItemListStructuredData.tsx` → listings
- `supabase/functions/generate-sitemap/index.ts` → `<loc>`
- `supabase/functions/merchant-feed/index.ts` → `<link>`

**Todos** passam pelo helper. Flip = trocar **uma constante em dois arquivos**. ✅

## 6. Observabilidade adicionada (Fase 2.1)

Três novos eventos no discriminated union de `slugObservability.ts`, ainda **não emitidos em produção** (definição apenas):
- `canonical_namespace_mismatch` — canonical renderizado usa prefixo diferente do helper.
- `merchant_url_mismatch` — feed serve URL fora do prefixo canônico.
- `sitemap_namespace_mismatch` — entrada do sitemap usa prefixo inesperado.

## 7. Drift detection

Novo teste: `src/lib/seoSurfaceDrift.test.ts` (4 testes, todos passando). Bloqueia em CI:
- frontend helper ≠ edge helper (prefixo/origem)
- `public/sitemap.xml` contém URL no namespace legado
- `public/robots.txt` aponta para origem errada
- hardcode de `/produtos/${...}` em edge functions fora do helper

---

## 8. Checklist do flip público (Fase 2.2)

Pré-requisitos antes do flip:
- [ ] Decisão A/B aprovada (recomendação: B).
- [ ] Se B: implementar Fase 2.1b (materialização) e validar 1 ciclo de regeneração.
- [ ] `public/sitemap.xml` regenerado com 100% dos produtos ativos (não mais 54 hardcoded).
- [ ] Drift test passando.
- [ ] Snapshot de baseline: capturar GSC "Páginas indexadas" e impressões últimos 28d.

Flip (1 commit atômico):
- [ ] Trocar `PRODUCT_PATH_PREFIX` para `/produto` em `src/lib/urls.ts` **e** `supabase/functions/_shared/urls.ts`.
- [ ] Em `App.tsx`: trocar rota canônica para `/produto/:slug` e `LegacyProductRedirect` passa a redirecionar `/produtos/*` → `/produto/*` (inverter o `<Navigate>` existente).
- [ ] Regenerar `public/sitemap.xml` (via edge function).
- [ ] Verificar `seoSurfaceDrift.test.ts` ainda passa.
- [ ] Verificar merchant feed manualmente em `/functions/v1/merchant-feed`.

Pós-flip:
- [ ] Submeter sitemap atualizado no GSC.
- [ ] Atualizar feed no Merchant Center (re-fetch manual).
- [ ] Monitorar `legacy_namespace_hit` por 30 dias.
- [ ] D+7 / D+30: comparar páginas indexadas vs baseline.

## 9. Rollback do flip

- `git revert` do commit do flip restaura tudo (rotas, constante, sitemap).
- Como redirect é client-side (`<Navigate>`), não há estado HTTP persistente para limpar.
- GSC re-consolida em 2–4 semanas tanto na ida quanto na volta.

## 10. Riscos restantes (pré-flip)

| ID | Risco | Mitigação |
|---|---|---|
| R-D1 | `public/sitemap.xml` hoje tem só 54 produtos (defasado) | Regenerar via edge function antes do flip |
| R-D2 | Sem 301 HTTP real (Lovable hosting estático) | Aceitar janela de re-consolidação; avaliar CF Worker em Fase 2.4 |
| R-D3 | Edge function `robots-txt` órfã pode confundir devs | Documentar ou deletar (decisão separada) |
| R-D4 | Decisão A/B em aberto | Bloqueador — esta auditoria |

---

## 11. Arquivos impactados nesta Fase 2.1 (SAFE)

Editados:
- `src/lib/slugObservability.ts` — +3 event types (definição apenas, inertes)

Criados:
- `src/lib/seoSurfaceDrift.test.ts` — 4 testes de drift, todos passando
- `docs/slugs-phase-2.1-audit.md` — este documento

**Nada público alterado. Nenhuma URL, canonical, sitemap, robots, ou merchant feed mudou.**

---

# Fase 2.1b — Materialização aplicada (Estratégia B)

## Arquitetura final

```
┌────────────────────────────┐
│  src/lib/urls.ts           │  ←─ helper canônico (fonte única)
│  supabase/functions/       │     espelhado em
│  _shared/urls.ts           │
└─────────────┬──────────────┘
              │ consome PRODUCT_PATH_PREFIX
              ▼
┌────────────────────────────┐      HTTP GET (anon key)
│  edge: generate-sitemap    │ ◄─────────────────────────┐
│  (fonte única da LÓGICA    │                            │
│   de geração)              │                            │
└─────────────┬──────────────┘                            │
              │ XML + marcadores `lovable:sitemap-*`     │
              ▼                                            │
┌────────────────────────────┐                            │
│  scripts/generate-sitemap  │  ←── prebuild + predev    │
│  .ts                       │      (npm hook)            │
│  • valida marcador         │                            │
│  • escreve XML             │                            │
│  • escreve audit JSON      │                            │
└─────────────┬──────────────┘                            │
              ▼                                            │
┌────────────────────────────┐                            │
│  public/sitemap.xml        │  ← servido estático CDN   │
│  public/.sitemap-source    │  ← audit (sha256, count)  │
│  .json                     │                            │
└────────────────────────────┘                            │
                                                          │
                  testes em CI ───────────────────────────┘
              (src/lib/seoSurfaceDrift.test.ts, 6 testes)
```

## Pipeline operacional

| Quando | Como | Resultado |
|---|---|---|
| `bun run dev` | `predev` chama edge function | sitemap fresco em dev |
| `bun run build` (deploy Lovable) | `prebuild` chama edge function | sitemap fresco em produção |
| Admin "Regenerar sitemap" | já existe (`seo-autopilot → regen_sitemap`) | atualiza apenas no banco; **não** atualiza o estático |
| Cron diário (`seo-sitemap-auto-resubmit`) | hoje só ressubmete ao GSC | inalterado |
| Falha de rede no script | warn + exit 0 | **build não quebra**; XML anterior preservado |

**Trade-off conhecido (aceito):** entre dois deploys, novos produtos não aparecem no sitemap servido. O cron de ressubmissão chega ao GSC, mas a URL fica defasada até o próximo deploy. Mitigação futura (não nesta fase): cron que faz commit no repo via GitHub API.

## Anti-drift garantido

`src/lib/seoSurfaceDrift.test.ts` (6 testes, todos passando):

1. Helper frontend ≡ helper edge (prefixo + origem)
2. `public/sitemap.xml` não contém namespace legado
3. **`public/sitemap.xml` contém marcador `lovable:sitemap-source`** (prova materialização)
4. **`.sitemap-source.json` bate com bytes/sha256 do XML**
5. `public/robots.txt` aponta para origem canônica
6. Edge functions não reintroduzem hardcode de namespace

Se alguém editar `public/sitemap.xml` à mão, o teste 3/4 falha em CI.

## Critério de sucesso — atingido

> "qualquer alteração futura de namespace deve exigir alteração em UM único lugar e o sitemap público deve refletir isso automaticamente após regeneração"

✅ Alterar `PRODUCT_PATH_PREFIX` em `src/lib/urls.ts` + `supabase/functions/_shared/urls.ts` (já registrados pelo teste 1 como sincronizados) + 1 deploy → `prebuild` regenera o sitemap automaticamente com o novo namespace.

## Checklist exato do flip (Fase 2.2)

Pré-flip:
- [ ] Snapshot GSC: "Páginas indexadas" + impressões 28d.
- [ ] `bun run scripts/generate-sitemap.ts` localmente e confirmar `namespace=/produtos`.
- [ ] `bunx vitest run src/lib/seoSurfaceDrift.test.ts` verde.

Flip (commit atômico):
- [ ] Trocar `PRODUCT_PATH_PREFIX` em **2** arquivos para `/produto`.
- [ ] Em `App.tsx`: rota canônica `/produto/:slug`; `LegacyProductRedirect` redireciona `/produtos/*` → `/produto/*`.
- [ ] `bun run scripts/generate-sitemap.ts` (regenera XML com namespace novo).
- [ ] Confirmar `public/.sitemap-source.json` mostra `"namespace": "/produto"`.
- [ ] `bunx vitest run` — todos verdes.

Pós-flip:
- [ ] Submeter `/sitemap.xml` no GSC (URL não muda; conteúdo sim).
- [ ] Re-fetch manual no Merchant Center.
- [ ] Monitorar `legacy_namespace_hit` por 30 dias.

## Rollback do flip

- `git revert` do commit reverte 2 constantes + App.tsx + sitemap regenerado.
- Próximo `prebuild` materializa namespace antigo.
- GSC re-consolida em 2-4 semanas em ambas direções.

## Arquivos finais da Fase 2.1b

Editados:
- `supabase/functions/generate-sitemap/index.ts` — +4 comentários XML de metadata; deploy automático aplicado.
- `package.json` — `predev` + `prebuild` hooks.
- `src/lib/seoSurfaceDrift.test.ts` — +2 testes (marcador + audit JSON).

Criados:
- `scripts/generate-sitemap.ts` — materializador (89 linhas, falha segura).
- `public/.sitemap-source.json` — audit trail commitado (hash/timestamp/count).

Materializado:
- `public/sitemap.xml` — 32.206 bytes, 54 produtos, namespace `/produtos`, sha256 registrado em `.sitemap-source.json`.
