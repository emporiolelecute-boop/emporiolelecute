# Plano — Auditoria Real de Avaliações Elo7 antes da Importação

## Princípio
**STOP TOTAL**: nenhuma avaliação será inserida em `product_reviews` até passar por aprovação manual visual no painel. Fuzzy score deixa de ser fonte de verdade — vira apenas sugestão inicial.

## 1. Schema — tabela de staging/auditoria

Migration nova: `review_import_audit` (staging, separada de `product_reviews`).

Campos:
- `id` uuid PK
- `import_batch_id` uuid
- `feedback_id` text UNIQUE (chave Elo7, evita duplicidade de staging)
- `elo7_product_name` text
- `elo7_product_slug` text (se houver na planilha)
- `elo7_image_url` text (primeira imagem da avaliação, se houver)
- `elo7_comment` text
- `elo7_sentiment` text
- `elo7_review_date` timestamptz
- `elo7_buyer_name` text
- `elo7_raw` jsonb (linha bruta da planilha, auditável/reversível)
- `suggested_product_id` uuid NULL (sugestão do matcher)
- `suggested_product_name` text
- `suggested_confidence` numeric
- `suggested_method` text ('exact'|'normalized'|'fuzzy'|'none')
- `manual_status` text CHECK in ('pending','confirmed','doubtful','rejected','no_match') DEFAULT 'pending'
- `manual_product_id` uuid NULL (decisão final do humano; pode diferir do suggested)
- `visual_notes` text
- `reviewed_by` uuid, `reviewed_by_email` text, `reviewed_at` timestamptz
- `imported_review_id` uuid NULL (preenchido quando virar `product_reviews`)
- `created_at`, `updated_at`
- RLS: somente admin.

## 2. Carregar planilha → staging (sem tocar em product_reviews)

Script local (`scripts/elo7-stage-import.ts`) executado uma vez:
- lê XLSX, normaliza, calcula sugestão (matcher atual)
- INSERT em `review_import_audit` com `manual_status='pending'`
- imagens: baixa para `storage/elo7-review-images/{feedback_id}/{idx}.jpg` (bucket privado novo) e guarda URL assinada/path em `elo7_image_url` / `elo7_raw.images[]`
- não toca em `product_reviews`

## 3. Painel `/admin/reviews-real-audit`

Página admin nova. Para cada item `pending`:
- coluna esquerda: imagem Elo7 + nome Elo7 + slug Elo7 + comentário + data + buyer
- coluna direita: produto sugerido com **imagem principal**, nome, slug, categoria, tags
- score + método + warning se confidence < 93
- ações:
  - **Confirmar** (usa suggested_product_id)
  - **Trocar produto** (combobox de busca em `products` por nome/slug/sku → grava `manual_product_id`)
  - **Duvidoso** (marca, fica fora da fila de import)
  - **Sem correspondência** (`no_match`, vai p/ produto inexistente)
  - **Rejeitar** (descarta a avaliação)
- filtros: status, confidence range, produto sugerido, busca por texto
- contadores no topo: pending/confirmed/doubtful/no_match/rejected

## 4. Commit (somente confirmados)

Botão "Importar confirmados" no painel:
- pega todos com `manual_status='confirmed'` e `imported_review_id IS NULL`
- INSERT em `product_reviews` usando `manual_product_id` (ou `suggested_product_id` se manual vazio), com `external_review_id=feedback_id`, `source='elo7'`
- atualiza `imported_review_id` no staging
- transação por lote, idempotente

## 5. Restrições
- Sem mudanças em produtos, slugs, sitemap, SEO.
- Sem auto-importação de fuzzy.
- Reversível: deletar `product_reviews` onde `source='elo7' AND external_review_id=feedback_id` zera tudo; staging permanece como histórico.

## 6. Entregáveis desta fase
1. Migration: tabela `review_import_audit` + bucket `elo7-review-images` (privado) + RLS admin.
2. Script de staging (não roda automático — você confirma).
3. Página `/admin/reviews-real-audit` com inspeção visual lado-a-lado.
4. Edge function `import-confirmed-reviews` que faz o commit dos `confirmed`.

## O que NÃO faço agora
- Não importo nada para `product_reviews`.
- Não aprovo nenhum dos 11 casos duvidosos anteriores.
- Não crio bloco "Clientes que amaram" na home.
- Não mexo em slugs, produtos, SEO.

Confirma para eu aplicar a migration + página?
