# SEO Control Plane — MVP

## Princípio (importante para evitar regressão)

O projeto já tem **50 tabelas `seo_***` e a tabela genérica `**seo_check_runs**` com coluna `checks jsonb` desenhada exatamente para o caso de uso de "rodar checks e persistir findings". **Não vou criar tabelas novas** — vou reusar `seo_check_runs` com `source='control_plane'`. Isso elimina drift de schema e respeita a arquitetura existente.

## O que vou entregar

### 1. Edge Function `seo-control-plane` (nova)

Roda server-side todas as validações e grava 1 linha em `seo_check_runs`.

**Etapas internas (ordem):**

1. **Coletar fontes de verdade**
  - `products` ativos (slug)
  - `categories`, `occasions`, `tags` (slug + `is_indexed`)
  - `pages` (slug)
  - sitemap atual (fetch de `https://emporiolelecute.com.br/sitemap.xml`)
  - registry de rotas do prerender (constante interna, espelha `resolve()` em `prerender/index.ts`)
2. **Diffs**
  - `sitemap_missing_from_db` — URLs órfãs no sitemap
  - `db_missing_from_sitemap` — produtos/categorias indexáveis ausentes do sitemap
  - `prerender_missing` — rotas no sitemap sem handler no prerender
  - `sitemap_missing_for_prerender` — handler existe mas sitemap não tem (warning)
3. **Bot simulation** (amostra de 5 rotas críticas: `/`, `/produtos`, 1 produto random, 1 categoria random, 1 rota inválida)
  - Chama a Edge `prerender?path=...` direto (cross-function call, mesma região)
  - Valida no HTML retornado: `<title>` presente e não vazio; `<meta name="description">`; `<link rel="canonical">`; `og:image`; pelo menos 1 `<script type="application/ld+json">` parseável; `noindex` correto para rota inválida
  - Resultados anexados como findings
4. **Classificação por severidade**
  - 🔴 crítico: prerender de rota indexável quebrado, JSON-LD ausente em produto, 404 retornando index
  - 🟠 warning: drift sitemap↔DB, OG ausente
  - 🟢 ok: tudo presente
5. **Persistir** 1 linha em `seo_check_runs`:
  ```json
   { source: "control_plane", total, passed, errors, warnings, checks: [{id, severity, category, message, url?, evidence?}, ...] }
  ```

### 2. Página `/admin/seo-control-plane` (nova)

Lê últimas 10 runs de `seo_check_runs` filtradas por `source='control_plane'`. Mostra:

- Botão **"Run now"** (chama a edge function on-demand)
- Status pill da última run (🔴/🟠/🟢)
- Cards: Sitemap coverage, Prerender coverage, Bot simulation, Drift alerts
- Tabela: últimas 10 runs com expandable de findings
- Cache headers do prerender (extraídos do bot simulation step)

### 3. Adicionar rota em `App.tsx`

- `/admin/seo-control-plane` → novo componente lazy-loaded

### 4. (Opcional, depois) Cron semanal

Não vou criar agora — o projeto já tem muitos crons (`seo_check_runs` já é alimentado por `seo-checks`). Documento como ligar; user decide se quer.

## Arquivos

1. **CRIAR** `supabase/functions/seo-control-plane/index.ts` — orquestrador.
2. **CRIAR** `src/pages/admin/AdminSeoControlPlane.tsx` — UI.
3. **CRIAR** `src/hooks/useSeoControlPlane.ts` — fetch últimas runs + trigger.
4. **EDITAR** `src/App.tsx` — adicionar route + lazy import.

## Não-objetivos (cuidado contra escopo creep)

- ❌ Não criar nova tabela (reuso `seo_check_runs`).
- ❌ Não escrever no DB nada além da linha de run (read-only sobre dados).
- ❌ Não fazer scraping de Google ou serviço externo.
- ❌ Não adicionar item ao sidebar de admin agora (rota acessível por URL direta + entry futura no AdminSeoCommandCenter — sidebar já tem 50+ entradas seo_*).
- ❌ Não criar cron ainda.

## Riscos e mitigação


| Risco                                                    | Mitigação                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Cross-function call ao prerender pode adicionar latência | timeout 10s, fetch em paralelo, máx 5 rotas                               |
| `seo_check_runs.checks` JSON cresce muito                | Limitar findings a 100 por run, truncar evidence                          |
| Fetch do sitemap em prod pode falhar em preview          | Try/catch + finding 🟠 "sitemap inacessível" em vez de erro fatal         |
| Falsos positivos de "rota indexável sem prerender"       | Lista de exclusão hardcoded (admin/, carrinho, etc.) idêntica à do Worker |


## Critério de sucesso

- Rodar "Run now" no admin produz uma linha em `seo_check_runs` em < 15s.
- Para cada rota crítica, 5 validações (title/desc/canonical/og/jsonld) com pass/fail visível.
- Diff DB↔sitemap detecta um produto novo criado e ainda não publicado no sitemap.
- Rota inválida é marcada como 🔴 se prerender devolver `index,follow`.
- Zero schema migration; zero mudança no site público.

&nbsp;

Aqui está o **texto de adendo técnico direto para colar junto ao plano do Lovable**, sem interpretação adicional:

---

# 🔧 ADENDO TÉCNICO OBRIGATÓRIO — SEO CONTROL PLANE (STABILITY PATCH)

Este adendo complementa o plano “SEO Control Plane — MVP” e deve ser aplicado **antes da implementação em produção** para garantir consistência de dados, evitar falsos positivos e estabilizar validações de prerender.

---

## 1. Snapshot temporal consistente (OBRIGATÓRIO)

Toda execução do control plane deve usar um **timestamp único de referência** para todas as fontes de dados.

### Requisito:

- Definir no início da execução:

```ts
const run_timestamp = new Date().toISOString();

```

### Aplicação obrigatória:

- Queries de DB (`products`, `categories`, `occasions`, `pages`) devem considerar apenas registros com:

```sql
updated_at <= run_timestamp

```

- Sitemap fetch deve ser tratado como snapshot da execução (cache bust obrigatório por run).

### Objetivo:

Evitar falsos drift causados por diferenças temporais entre:

- DB state
- sitemap state
- prerender state

---

## 2. Expansão mínima da simulação de bots (OBRIGATÓRIO)

Substituir amostragem fixa de 5 rotas por:

### Conjunto de validação:

- 5 rotas fixas críticas:
  - `/`
  - `/produtos`
  - `/produto/:slug` (1 exemplo)
  - `/categoria/:slug` (1 exemplo)
  - `/rota-invalida`
- &nbsp;

- amostragem dinâmica:

- 5 produtos aleatórios
- 3 categorias aleatórias
- 2 landings SEO aleatórias

### Objetivo:

Garantir cobertura estatística mínima para detectar:

- produtos sem JSON-LD
- categorias sem OG
- landings sem metadata
- drift silencioso em subconjuntos

---

## 3. Classificação de severidade com dimensão de impacto (OBRIGATÓRIO)

Substituir modelo atual por estrutura expandida:

Cada finding deve conter:

```json
{
  "severity": "critical | warning | ok",
  "impact": "indexation | social_preview | data_integrity"
}

```

### Regras:

- **indexation** → Google SEO (ranking / crawl / index)
- **social_preview** → WhatsApp / LinkedIn / Twitter unfurl
- **data_integrity** → sitemap / DB / prerender inconsistencies

---

## 4. Proteção contra timeout de prerender (OBRIGATÓRIO)

Todas as chamadas para `prerender` devem ter controle de timeout:

### Regra:

- timeout máximo: **10 segundos**

### Comportamento:

- se timeout exceder:
  - NÃO falhar a execução
  - registrar finding:

```json
{
  "severity": "warning",
  "message": "prerender timeout exceeded",
  "impact": "indexation"
}

```

---

## 5. Normalização de cache de sitemap (OBRIGATÓRIO)

Ao buscar sitemap:

- sempre aplicar cache bust por execução
- não reutilizar cache entre runs diferentes

Exemplo:

```
/sitemap.xml?run_timestamp=...

```

### Objetivo:

Evitar comparação de snapshots diferentes entre runs consecutivos.

---

## 6. Regra de consistência final (critério de validação)

O sistema só é considerado estável quando:

- DB snapshot = sitemap snapshot = prerender snapshot (mesmo run_timestamp)
- bot simulation cobre:
  - rotas críticas
  - amostragem estatística de conteúdo dinâmico
- nenhum finding crítico de:
  - JSON-LD ausente em produto
  - 404 sem noindex
  - prerender timeout não tratado

---

## 7. Garantia de não regressão

Este adendo não altera:

- schema de banco de dados
- frontend React
- worker Cloudflare existente
- lógica de prerender atual

Apenas adiciona **camada de consistência e validação temporal ao control plane**.