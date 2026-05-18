# Fase 2.3 — Estabilização Pós-Flip & Observabilidade Operacional

Estado: **ESTÁVEL.** Canônico `/produto/:slug`. Legado `/produtos/:slug` em coexistência indefinida via soft redirect client-side.

---

## 1. Observabilidade — taxonomia oficial

Todos os eventos passam por `logSlugEvent()` (`src/lib/slugObservability.ts`).
Payload padrão sempre carrega: `event`, `severity`, `source`, `ts`, `pathname` (+ campos por evento). Buffer in-memory de 200 eventos exposto em `window.__slugEvents` para inspeção rápida no devtools de produção.

| Evento                          | Severidade | Sampling | Significado                                                   |
| ------------------------------- | ---------- | -------- | ------------------------------------------------------------- |
| `alias_hit`                     | debug      | 20%      | Resolução via alias manual                                    |
| `historical_hit`                | debug      | 20%      | Resolução via slug histórico                                  |
| `replace_executed`              | info       | 100%     | URL corrigida para slug primário                              |
| `loop_prevented`                | warn       | 100%     | Replace evitado (pathname já canônico)                        |
| `unknown_slug`                  | info       | 100%     | 404 real — slug não existe                                    |
| `inactive_alias_attempt`        | info       | 100%     | Alias existe mas está desativado                              |
| `slug_resolution_failed`        | warn       | 100%     | Erro na resolução (DB/network)                                |
| `structural_inconsistency`      | **error**  | 100%     | Estado interno incoerente                                     |
| `slug_drift_detected`           | **error**  | 100%     | Slug do produto ≠ slug primário em `product_slugs`            |
| `canonical_mismatch`            | **error**  | 100%     | pathname ≠ canonical esperado após resolução                  |
| `redirect_chain_detected`       | warn       | 100%     | Redirect manual conflita com namespace de produto             |
| `legacy_namespace_hit`          | info       | 25%      | Acesso ao prefixo legado `/produtos/:slug`                    |
| `canonical_namespace_mismatch`  | **error**  | 100%     | Canonical emitido com prefixo errado                          |
| `merchant_url_mismatch`         | **error**  | 100%     | Merchant feed emitiu URL com prefixo errado                   |
| `sitemap_namespace_mismatch`    | **error**  | 100%     | Sitemap referencia prefixo legado                             |

**Sinks**: console (`error`/`warn`/`debug`) + buffer in-memory.
**Persistência server-side**: NÃO implementada nesta fase (overhead injustificado para volume atual). Proposta futura no §6.

---

## 2. Como inspecionar em produção

No devtools do navegador (qualquer página):

```js
window.__slugEvents          // últimos 200 eventos
window.__slugEvents.filter(e => e.severity === "error")
window.__slugEvents.filter(e => e.event === "legacy_namespace_hit")
```

Filtros úteis no console (DevTools → filtro `[slug]`).

---

## 3. Drift audit pré-deploy

Comando único antes de qualquer deploy que toque slugs/SEO/URLs:

```bash
bun run scripts/audit-namespace-drift.ts
```

Verifica 11 invariantes (helpers, sitemap, robots, hardcodes, merchant). Exit 1 em qualquer drift. Rodar também sempre que `PRODUCT_PATH_PREFIX` mudar.

---

## 4. Checklist Search Console — D+1 / D+7 / D+30

### D+1 (24h pós-flip)
- [ ] Console: nenhum `canonical_*_mismatch`, `sitemap_namespace_mismatch`, `merchant_url_mismatch`.
- [ ] `legacy_namespace_hit` aparece (esperado: tráfego legado de backlinks/cache).
- [ ] Search Console → **Sitemaps** → reenviar `https://emporiolelecute.com.br/sitemap.xml`. Status: "Êxito".
- [ ] **URL Inspection** em 3 SKUs no novo path: canonical reportado = `/produto/:slug` ✓.
- [ ] **URL Inspection** em 1 SKU no path legado: Google deve mostrar canonical `/produto/:slug` (canonical-first funcionou).
- [ ] Coverage: zero erros novos.

### D+7
- [ ] Impressões em `/produto/*` começam a aparecer (Performance → filtrar por URL).
- [ ] Impressões em `/produtos/:slug` (legado) começam a cair gradualmente.
- [ ] Merchant Center → Diagnostics: 0 disapprovals novos. URLs ativas devem ter migrado.
- [ ] Coverage: páginas indexadas em `/produto/*` crescendo.
- [ ] `legacy_namespace_hit` decrescente (sinal saudável).

### D+30
- [ ] Migração de impressões substancialmente concluída (>80% em `/produto/*`).
- [ ] Coverage estável.
- [ ] Decisão sobre Cloudflare Worker (§7): só implementar se `legacy_namespace_hit` continuar significativo (> ~5% sessões) **e** Google ainda mostrar URLs legadas em SERP.

### Sinais de regressão (parar tudo, investigar)
- `canonical_namespace_mismatch` em produção.
- Drop > 30% de impressões agregadas em 7 dias.
- Coverage: aumento súbito de "Crawled - not indexed" ou "Duplicate without user-selected canonical".
- Merchant: disapprovals por "URL mismatch" ou "404".

---

## 5. Estratégia de validação de aliases (sem risco SEO)

Hoje quase não há aliases reais. Para validar a stack ponta-a-ponta sem risco:

1. **Escolher 1 produto pouco indexado** (baixo tráfego orgânico, sem campanha ativa).
2. Admin → Produtos → renomear slug (ex.: `caderno-floral` → `caderno-floral-v2`).
   - Sistema cria automaticamente entrada em `product_slugs` (slug antigo vira `historical`).
3. Validar manualmente:
   - `/produto/caderno-floral` → resolve, faz `replace_executed` → URL final `/produto/caderno-floral-v2`.
   - `/produtos/caderno-floral` → `legacy_namespace_hit` → `replace` → `/produto/caderno-floral-v2`.
   - canonical, og:url, JSON-LD → todos `/produto/caderno-floral-v2`.
   - Próximo build: sitemap só lista `caderno-floral-v2`.
   - Merchant feed: idem.
4. Adicionar alias manual de teste em `product_slugs` (kind=`manual`) e repetir.
5. Desativar o alias (`is_active=false`) → `/produto/alias-teste` deve disparar `inactive_alias_attempt` e 404 limpo.

Não fazer em produto popular. Reverter o rename ao fim do teste.

---

## 6. Persistência de eventos críticos — proposta SAFE (não implementada)

**Recomendação**: NÃO implementar agora. Volume real esperado é baixo (< 1k hits/dia em `legacy_namespace_hit`, ~zero em erros). Buffer in-memory + console cobre debug ad-hoc.

Se necessário no futuro, opção mínima:
- Tabela `slug_events` (id, event, severity, payload jsonb, ts).
- Edge function `log-slug-event` (rate-limited, batch) — chamada apenas para `severity=error` com sampling 100%.
- Retenção 30 dias via pg_cron.
- View `slug_events_summary` agregando por event/dia para painel admin.

Custo estimado: ~1h trabalho + ~50 rows/dia. Adiar até justificativa concreta.

---

## 7. Cloudflare Worker — necessário?

**Status atual**: não necessário. Justificativa:

| Aspecto                       | Sem Worker (hoje)                              | Com Worker (301 real)                    |
| ----------------------------- | ---------------------------------------------- | ---------------------------------------- |
| Crawlers JS-capable (Google)  | Veem canonical correto → migram                | Idem + sinal mais forte (301)            |
| Crawlers sem JS (Bing antigo) | Veem 200 OK no legado, canonical aponta novo   | Recebem 301 direto                       |
| Usuários                      | Redirect imperceptível (replace client-side)   | Redirect HTTP — 1 RTT extra              |
| Risco operacional             | Zero                                           | Camada externa, deploy adicional, custo  |
| Reversibilidade               | Imediata (revert código)                       | Requer revert Worker + propagação        |

**Trigger para implementar Worker** (revisar D+30):
- `legacy_namespace_hit` mantém-se > 5% das pageviews **e**
- Google Search Console mostra URLs legadas dominando SERP **e**
- Aparecem disapprovals Merchant por mismatch.

Caso 1 dos 3 falhe → manter soft redirect indefinidamente.

---

## 8. Hardening RedirectHandler — auditoria

`src/components/RedirectHandler.tsx` revisado:

| Aspecto              | Status   | Nota                                                          |
| -------------------- | -------- | ------------------------------------------------------------- |
| Custo runtime        | OK       | Hook curto-circuita em `!redirects?.length` antes do find.    |
| Race conditions      | OK       | `isProductNamespace` guard precede qualquer lookup.           |
| Navegações redundantes | OK     | `redirects` é cacheado por react-query.                        |
| Loop                 | OK       | `replace: true` + match exato em `from_path === pathname`.    |
| Conflito product_slugs | OK     | Namespaces `/produto/` e `/produtos/` skipados explicitamente. |

**Nenhuma alteração necessária.** Documentação atualizada no próprio arquivo.

---

## 9. QA final desta fase

- [x] `bun run scripts/audit-namespace-drift.ts` → **11/11 OK**.
- [x] `bunx vitest run src/lib/seoSurfaceDrift.test.ts src/lib/productResolver.test.ts` → **13/13 OK**.
- [x] Sitemap re-materializado (`ns=/produto`, 54 produtos, hash batendo).
- [x] Edge functions `seo-control-plane`, `prerender`, `generate-sitemap`, `merchant-feed` redeployadas e usando helper.
- [x] AdminRedirects placeholders atualizados para `/produto/...`.
- [x] Nenhum link interno novo em `/produtos/:slug`.
- [x] Coexistência longa garantida — `LegacyProductRedirect` permanece.

---

## 10. Top riscos restantes

1. **Cache externo** (Wayback, indexadores secundários) — fora do nosso controle. Inerente. Mitigação já no lugar (canonical-first).
2. **Backlinks externos antigos** — continuarão funcionando indefinidamente; impacto SEO neutro pois canonical resolve.
3. **Crawlers sem JS** — veem 200 no legado. Mitigação: canonical no HTML estático aponta para `/produto/...` (renderizado pelo Helmet apenas após hydration ⚠️). Se virar problema → §7 (Worker).
4. **Drift futuro de namespace** — coberto por `seoSurfaceDrift.test.ts` + `scripts/audit-namespace-drift.ts`. Rodar audit em CI no futuro (opcional).

---

## 11. Critério de sucesso desta fase

- [x] Sistema entra em modo de estabilização.
- [x] Drift detectável em < 5s via comando único.
- [x] Observabilidade padronizada com severidade + sampling.
- [x] Buffer in-memory acessível para debug em produção.
- [x] Roadmap operacional D+1/D+7/D+30 documentado.
- [x] Decisão sobre Worker formalizada (não-fazer-ainda, com triggers).

**Próximas fases passam a ser incrementais, não estruturais.**
