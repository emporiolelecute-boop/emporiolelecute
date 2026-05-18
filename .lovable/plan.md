# SEO Autopilot — Execution Core (MVP honesto)

## Realidade vs ambição da spec

A spec pede "auto-fix" para 9 categorias de finding. Antes de codar, separar o que é **realmente auto-fixável em runtime** vs o que exige **mudança de código ou conteúdo humano** (e portanto não pode ser auto-aplicado sem risco).


| Finding                          | Auto-fixável?              | Razão                                                                               |
| -------------------------------- | -------------------------- | ----------------------------------------------------------------------------------- |
| Sitemap drift (DB↔sitemap)       | ✅ **Sim**                  | Já existe edge `generate-sitemap` que regenera do DB. Autopilot só precisa invocar. |
| Sitemap não submetido            | ✅ **Sim**                  | Edge `seo-sitemap-auto-resubmit` existe.                                            |
| Rota nova sem entrada no sitemap | ✅ **Sim**                  | Subset do caso acima.                                                               |
| Prerender retornando erro        | ⚠️ **Diagnóstico**         | É bug de código no `prerender/index.ts`. Autopilot loga issue, não auto-corrige.    |
| JSON-LD ausente em produto       | ⚠️ **Diagnóstico**         | Prerender já gera JSON-LD do DB. Se ausente → bug ou produto sem dados.             |
| 404 sem noindex                  | ⚠️ **Diagnóstico**         | Já implementado no prerender atual. Se quebrar = bug de código.                     |
| OG image ausente em produto      | ⚠️ **Diagnóstico**         | Vem de `products.images[0]`. Se faltar = produto sem imagem no DB → ação humana.    |
| Canonical ausente                | ⚠️ **Diagnóstico**         | Bug de código.                                                                      |
| Order/loop entre fixes           | ✅ **Prevenido por design** | Rate limit + cooldown.                                                              |


**Decisão honesta:** Autopilot executa **2 ações reais** (regen + resubmit sitemap) e **enfileira o resto** como issues acionáveis para revisão humana ou correção de código. Isso entrega valor real sem fingir poderes que o sistema não tem.

## O que vou entregar

### 1. Edge Function `seo-autopilot` (nova)

Pipeline determinístico:

1. **Carregar** última run de `seo_check_runs` com `source='control_plane'` (idade máx 24h).
2. **Filtrar + ordenar** findings: indexation critical → data_integrity → social_preview.
3. **Planejar ações** (dry-run sempre primeiro):
  - Se há `diff:missing_in_sitemap` ou `diff:orphan_in_sitemap` → plan `regen_sitemap`
  - Se houve mudança no sitemap → plan `resubmit_sitemap`
  - Demais findings → plan `log_issue` (não executa correção)
4. **Safety layer**:
  - Máx 1 `regen_sitemap` por run
  - Máx 1 `resubmit_sitemap` por run
  - Máx 10 ações totais por run
  - Cooldown global: 1 run autopilot a cada 30min (lê `seo_check_runs` source=autopilot)
  - `mode: 'dry_run' | 'execute'` no body (default `dry_run`)
5. **Executar** (se `mode='execute'` e plano OK):
  - Invocar `generate-sitemap` (já existe)
  - Invocar `seo-sitemap-auto-resubmit` (já existe)
6. **Validação pós-fix**: invocar `seo-control-plane` para nova run e comparar `errors`/`warnings` antes vs depois.
7. **Persistir** 1 linha em `seo_check_runs` com `source='autopilot'`:
  ```json
   {
     mode, plan: [...], executed: [...], skipped: [{action, reason}],
     failed: [...], validation: {before, after, regression: bool},
     control_plane_run_id_before, control_plane_run_id_after
   }
  ```

### 2. UI: aba "Autopilot" em `/admin/seo-control-plane`

Reusar página existente. Adicionar 3ª/4ª tab:

- **Plano (dry-run)** — botão "Planejar ações" mostra o que seria feito sem executar.
- **Executar** — botão com confirmação. Mostra resultado: ações OK, validation diff, regressão.
- **Histórico Autopilot** — últimas 10 runs source='autopilot'.

### 3. Hook `useSeoAutopilot`

Análogo a `useSeoControlPlane`. `plan()` chama com `mode='dry_run'`, `execute()` com `mode='execute'`.

## Arquivos

1. **CRIAR** `supabase/functions/seo-autopilot/index.ts`
2. **CRIAR** `src/hooks/useSeoAutopilot.ts`
3. **EDITAR** `src/pages/admin/AdminSeoControlPlane.tsx` — adicionar tabs Autopilot

## Não-objetivos (anti-escopo creep e anti-mentira)

- ❌ Não criar tabela nova (reuso `seo_check_runs`).
- ❌ Não escrever em `products`, `categories`, etc — nenhuma mutação de dados de domínio.
- ❌ Não "reescrever JSON-LD em runtime" — isso seria fingir auto-fix para bug de código.
- ❌ Não invalidar cache do Cloudflare Worker (não temos credencial e não está no escopo desta sessão).
- ❌ Não criar cron — execução fica manual via UI por enquanto.

## Riscos e mitigação


| Risco                                   | Mitigação                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Loop autopilot ↔ control_plane          | Cooldown 30min + flag `triggered_by` no payload                                             |
| Sitemap regen falhar em prod            | Try/catch, rollback = não-op (sitemap antigo continua válido), finding `error` no relatório |
| Falso "regression" no validation        | Comparar só `errors` count, não `warnings` (mais ruidoso)                                   |
| Auto-fix mascarar bug real de prerender | Issues vão para `log_issue` com severity preservada, visíveis no painel                     |


## Critério de sucesso

- Dry-run produz um plano legível em < 5s.
- Execute em `mode='execute'`: sitemap regenerado, validação re-roda, regressão detectada se errors aumentarem.
- Findings não auto-fixáveis aparecem como "skipped" com razão clara (não falham silenciosamente).
- Zero mutação de dados de produto/categoria.
- Zero migration; zero mudança no site público.

&nbsp;

&nbsp;

# ADENDO ÚNICO (para anexar no plano do Lovable)

Aqui está o patch direto, copiável:

---

## 🔧 ADENDO — EXPANSÃO SEGURA DO AUTOPILOT (TEMPLATE REPAIR LAYER)

Este adendo complementa o “SEO Autopilot — Execution Core (MVP honesto)” sem alterar seu modelo de segurança ou introduzir mutações em dados de domínio.

---

## 1. Nova categoria: TEMPLATE-REPAIR (determinística e segura)

Além de:

- sitemap regeneration
- sitemap resubmit
- logging de issues

adicionar categoria intermediária:

```

```

```
template_repair
```

---

## 2. O que entra em TEMPLATE-REPAIR

São casos que NÃO são bug de código nem dados faltantes, mas:

> renderização previsível baseada em fallback determinístico

### Regras:

### 2.1 OG tags ausentes

Se `og:*` não estiver presente no prerender:

GERAR:

-   
og:title = title existente ou [product.name](http://product.name)  

-   
og:description = description ou fallback DB  

-   
og:image = product.images[0] ou placeholder CDN seguro  

-   
og:url = canonical  


👉 isso é SAFE (não modifica DB)

---

### 2.2 JSON-LD ausente (quando dados existem)

Se produto/categoria existe no DB:

→ regenerar schema no nível do edge render (não persistir)

-   
Product schema  

-   
Offer schema  

-   
Breadcrumb schema  


👉 sempre derivado do DB, nunca manual

---

### 2.3 Canonical ausente

Gerar:

```

```

```
canonical = base_url + pathname
```

Sem depender de código React

---

## 3. Regra de execução expandida

O Autopilot passa a ter 3 níveis:


| Tipo            | Ação                              |
| --------------- | --------------------------------- |
| infrastructure  | sitemap regen / resubmit          |
| template_repair | OG / JSON-LD / canonical fallback |
| diagnostics     | log_issue                         |


---

## 4. Regra de segurança (IMPORTANTE)

Template-repair:

-   
NÃO grava no DB  

-   
NÃO altera produtos  

-   
NÃO persiste SEO fields  

-   
apenas altera OUTPUT do prerender runtime  


---

## 5. Novo fluxo de decisão

```

```

```
if finding is indexation critical:
    if fixable via template_repair:
        apply template_repair
    else:
        log_issue

if finding is sitemap:
    execute infrastructure fix

if finding is ambiguous:
    log_issue
```

---

## 6. Resultado esperado

Com este adendo:

-   
elimina “falsos diagnósticos humanos”  

-   
reduz dependência de intervenção manual  

-   
mantém segurança total (sem mutation de DB)  

-   
aumenta cobertura real do autopilot de ~20% → ~60%