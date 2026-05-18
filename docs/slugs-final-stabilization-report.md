# Slugs — Final Stabilization Report (Fase 4.2)

**Modo:** SAFE MODE ABSOLUTO (auditoria + documentação apenas).
**Data:** 2026-05-18
**Status:** ✅ Ciclo estrutural encerrado. Sistema em estado de manutenção estável.

---

## 1. Estado final consolidado

| Aspecto | Valor |
|---|---|
| Namespace público canônico | `/produto/:slug` |
| Namespace legado permanente | `/produtos/:slug` (resolve via `LegacyProductRedirect`) |
| Helpers centralizados | `src/lib/urls.ts` + `supabase/functions/_shared/urls.ts` |
| Resolver de aliases | `product_slugs` (1 query, 1-hop) |
| Trigger redirect | `auto_create_redirect_on_slug_change` — emite `/produto/` (Fase 4.1) |
| Drift audit | **11/11 OK** |
| Testes | **40/40 OK** (incl. 14 do `slugHardening`) |
| Aliases históricos preservados | **12/12 ativos** |
| Sitemap | apenas `/produto/`, 54 entries, hash bate com `.sitemap-source.json` |
| Merchant feed | apenas `/produto/` via `productAbsolute` |
| Canonical / OG / JSON-LD | sempre `/produto/` |

---

## 2. Arquitetura definitiva

```
Request → React Router
  ├── /produto/:slug          → ProductPage (canonical)
  └── /produtos/:slug         → LegacyProductRedirect → /produto/:slug

ProductPage
  └── resolveProductSlug(slug)            ← product_slugs (1 query)
        ├── primary match  → render
        └── alias match    → 301 → primary

Admin save
  └── generateSafeSlug + assessSlugQuality (block on error)
        └── UPDATE products.slug
              └── trigger: insert alias + INSERT redirect /produto/old → /produto/new
                          (flattening A→B→C consolida em A→C)
```

Helpers únicos: `urls.product(slug)`, `urls.productAbsolute(slug)`, `PRODUCT_PATH_PREFIX`, `CANONICAL_ORIGIN`.

---

## 3. Auditoria de aliases históricos (12/12)

| old_slug (alias) | new_slug (primary) | alias_active | redirect_ok |
|---|---|---|---|
| ...anjinho...personaliz-ciej | ...anjinho...personalizada | ✅ | ✅ |
| ...dinossauro...mini-c-irm7 | ...dinossauro...mini-coracao | ✅ | ✅ |
| ...fundo-do-mar...mini-cora-ii6z | ...fundo-do-mar...mini-coracao | ✅ | ✅ |
| ...nome-3-letras...-js6l | ...nome-3-letras-personalizado | ✅ | ✅ |
| ...patinho...personalizad-exvf | ...patinho...personalizada | ✅ | ✅ |
| ...pezinho-no-tule...pers-5lva | ...pezinho-no-tule...personalizada | ✅ | ✅ |
| ...safari-cute...personal-fqf9 | ...safari-cute...personalizada | ✅ | ✅ |
| ...ursinho-1-letra...coracao-bigf | ...ursinho-1-letra-mini-coracao | ✅ | ✅ |
| ...mensagem-se-y5yi | ...mensagem-secreta | ✅ | ✅ |
| ...cavalinho...personalizad-bwvf | ...cavalinho...personalizada | ✅ | ✅ |
| ...brasao-espirito-santo...terc-hxsv | ...brasao-espirito-santo...terco | ✅ | ✅ |
| ...brasao...personalizad-hquh | ...brasao...personalizada | ✅ | ✅ |

Nenhum alias inativo, nenhum vínculo perdido, nenhuma cadeia de redirect detectada.

**Nota técnica:** entradas em `redirects` ainda persistem com prefixo `/produtos/` (legado intencional — `LegacyProductRedirect` reabsorve). Para futuros renames, o trigger atualizado emitirá `/produto/`.

---

## 4. Auditoria de qualidade dos slugs atuais (54 produtos ativos)

| Métrica | Valor |
|---|---|
| Total | 54 |
| Média de caracteres | 45 |
| Maior | 59 (`lembrancinha-sabonete-pezinho-no-tule-com-tag-personalizada`) |
| Menor | 29 |
| Slugs > 60 chars | **0** ✅ |
| Slugs terminando em hash `[a-z0-9]{4}$` | **41** ⚠️ |
| Slugs duplicados semanticamente | 0 |

### Dívida descoberta (NÃO atuar agora)

Existem **41 slugs** que ainda terminam com sufixo `-xxxx` (ex: `-jzsa`, `-bigf`, `-2ur6`, `-6ev9`). Estes **não fizeram parte do escopo da Fase 4** (que tratou apenas os 12 truncados/cortados ao meio). Estes 41 estão completos semanticamente — o hash é apenas um discriminador anti-colisão histórico.

**Justificativa para não tocar:**
- Não estão truncados (palavras inteiras).
- Não foram identificados como prejudiciais a SEO durante a Fase 3.
- Hit count e tráfego não foram reavaliados → renomear às cegas é risco desnecessário.
- Muitos têm hash repetido (ex: `-6ev9` aparece 5x) sugerindo coincidência de tokenização e necessidade real do discriminador.
- Sistema atual previne **novos** hashes via `assessSlugQuality` (Fase 4.1).

**Decisão:** congelado. Possível Fase 5 futura, opt-in por slug, somente se SEMrush apontar perda de ranking específica.

---

## 5. Auditoria de hardcodes

```
✅ /produto/${...}   → apenas em prerender (correto)
✅ /produtos/${...}  → apenas em rotas /admin/produtos/${id} (admin interno, OK)
✅ Helpers urls.*    → único caminho público
✅ slugify()         → usado apenas em taxonomias (kits, collections, blog, themes) — não em products
```

Nenhum hardcode público fora dos helpers. `slugify()` em `src/lib/taxonomy.ts` e admins de taxonomia é **legado intencional** (não products).

---

## 6. Auditoria do admin

- ✅ `AdminProductForm` usa exclusivamente `generateSafeSlug` (linha 165).
- ✅ `assessSlugQuality` chamado em submit (linha 228) e em UI (linha 427).
- ✅ Submissão bloqueada quando severity=error.
- ✅ Edição manual continua possível (campo livre, validado por quality gate).
- ✅ Eventos `slug_generation_blocked` e `slug_quality_warning` registrados.

Nenhum fluxo alternativo bypassa o quality gate.

---

## 7. Auditoria de performance

- ✅ Resolver: 1 query a `product_slugs` (índice em `slug`).
- ✅ Replace: 1-hop (sem cadeias após flattening do trigger).
- ✅ Sem loops detectados em `slugObservability` ring buffer.
- ✅ Sem listeners duplicados em `RedirectHandler`.
- ✅ Ring buffer estável (tamanho fixo, sem growth).

---

## 8. Auditoria de documentação

| Doc | Status |
|---|---|
| slugs-architecture.md | ✅ coerente |
| slugs-phase-2.1-audit.md | ✅ histórico |
| slugs-phase-2.3-stabilization.md | ✅ histórico |
| slugs-phase-3-hardening-audit.md | ✅ histórico |
| slugs-phase-4-normalization-plan.md | ✅ histórico (plano) |
| slugs-phase-4-execution-report.md | ✅ histórico (execução) |
| slugs-phase-4.1-hardening-report.md | ✅ histórico (hardening) |
| slugs-final-stabilization-report.md | ✅ este doc |

Nenhuma referência obsoleta dizendo `/produtos/:slug` como canonical encontrada.

---

## 9. Dívidas restantes reais (auditadas — NÃO acionar sem novo ciclo)

1. **41 slugs com hash discriminador** — congelado, ver §4.
2. **Redirects históricos no namespace `/produtos/`** — funcionais via `LegacyProductRedirect`. Migrar exigiria reescrever entradas históricas; baixo ROI.
3. **Cloudflare Worker para 301 server-side** — não implementado. SPA redirect funciona, mas não emite 301 verdadeiro. Decisão: aceitar custo de SEO marginal vs. complexidade de infra.

---

## 10. Itens deliberadamente adiados

- Renomeação dos 41 slugs com hash → exige análise SEM/SEO caso-a-caso.
- Persistência de observabilidade → ring buffer in-memory é suficiente.
- Worker edge para 301 → adiado até evidência de impacto.
- Reescrita do `slugify()` legado em taxonomias → fora do escopo de products.

---

## 11. Critérios claros para NÃO mexer mais

🛑 NÃO renomear slug existente sem:
- evidência de impacto SEO real (Search Console / SEMrush);
- verificação de `hit_count` em `product_slugs`;
- plano de rollback documentado.

🛑 NÃO criar nova rota pública para produto.

🛑 NÃO alterar `PRODUCT_PATH_PREFIX` em nenhum helper.

🛑 NÃO bypass do `generateSafeSlug` no admin.

🛑 NÃO modificar triggers `auto_create_redirect_on_slug_change` sem testar flattening.

🛑 NÃO desabilitar `LegacyProductRedirect` enquanto houver tráfego em `/produtos/`.

---

## 12. Checklist futuro caso haja novo rename manual

```
[ ] Verificar hit_count em product_slugs WHERE slug = old.
[ ] Confirmar zero colisão: SELECT FROM product_slugs WHERE slug = new.
[ ] Confirmar zero colisão em reserved_slugs.
[ ] UPDATE products SET slug = new WHERE id = ... (transação única).
[ ] Verificar alias criado automaticamente (product_slugs.is_primary=false).
[ ] Verificar redirect criado em /produto/old → /produto/new.
[ ] Regenerar sitemap: bunx tsx scripts/generate-sitemap.ts (se manual).
[ ] Rodar drift audit: bunx tsx scripts/audit-namespace-drift.ts.
[ ] Validar resolver: GET /produto/old → 301 → /produto/new.
[ ] Documentar no histórico se for batch > 5 slugs.
```

---

## 13. Encerramento

✅ **Hash residual não consegue mais reaparecer** (garantido por `assessSlugQuality` no admin + ausência de outros pontos de geração de slug de produto).

✅ Drift estrutural impossível sem violar guards (`audit-namespace-drift.ts` 11/11).

✅ Sistema em **modo de manutenção estável**. Próximas mudanças em slugs devem ser **caso-a-caso** e **opt-in**, não estruturais.

**Ciclo de slugs oficialmente encerrado.**
