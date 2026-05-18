# Tracking — Documento único de eventos

**Sprint 4 — consolidação.** Toda nova métrica deve passar por este documento antes de ir para o código.

Disparo via `event(name, params)` de `src/lib/analytics.ts` (gtag + opcionalmente fbq).
Naming snake_case, sempre em inglês. Três categorias mutuamente exclusivas.

---

## 1. Intenção (intent)

Sinal de interesse, sem ação direta de compra.

| evento | quando dispara | parâmetros |
|---|---|---|
| `view_item` | PDP carrega (`trackProductView`) | `currency`, `value`, `items[]` |
| `bundle_view` | KitPage carrega | `slug`, `bundle_type`, `kit_id`, `origin` |
| `home_kit_click` | Card de kit na home é clicado | `slug`, `bundle_type`, `position`, `origin` |
| `internal_link_click` | Links contextuais relevantes | `link_from`, `link_to`, `link_label`, `link_position` |

## 2. Interação (interaction)

Engajamento com componentes — não é conversão.

| evento | quando dispara | parâmetros |
|---|---|---|
| `review_gallery_interaction` | Foto da review é aberta no lightbox | `product_id`, `review_id`, `image_index`, `action` |
| `form_submission` | Form não-pedido enviado (`trackFormSubmission`) | `form_type` |
| `exit_popup_blocked` | Exit popup foi suprimido por regra | `meta.rule` |

## 3. Conversão (conversion)

Ação direta de compra/lead.

| evento | quando dispara | parâmetros |
|---|---|---|
| `generate_lead` | Inquiry/WhatsApp/kit (`trackInquiry`) | `currency`, `items[]` |
| `pdp_whatsapp_click` | Clique no WhatsApp da PDP | `source`, `product_slug`, `utm_campaign` |
| `bundle_whatsapp_click` | Envio de kit completo pelo WhatsApp | `slug`, `bundle_type`, `kit_id`, `item_count`, `origin` |
| `add_to_cart` | (futuro) Adicionar ao carrinho | `items[]`, `value` |
| `begin_checkout` | (futuro) Carrinho → checkout | `items[]`, `value` |

---

## Regras de naming

- `home_*` → originado em /
- `pdp_*` → originado em PDP
- `bundle_*` → originado em kit/bundle
- `review_*` → originado em avaliações
- Demais eventos seguem nomes padrão GA4 (`view_item`, `generate_lead`, etc.)

## Regras de propagação

1. **Não duplicar eventos** no mesmo clique. Se `bundle_whatsapp_click` dispara, **não** dispare também `pdp_whatsapp_click`.
2. **Sempre incluir `origin`** quando o mesmo evento pode partir de múltiplas superfícies (home / pdp / kit_page).
3. **Não logar PII** (nome, email, telefone, endereço). Use apenas IDs e slugs.
4. **Mudanças nesse documento** ⇒ atualizar `src/lib/analytics.ts` no mesmo PR.

## Eventos removidos / consolidados (Sprint 4)

- ~~`whatsapp_click_*` (múltiplas variantes)~~ → consolidado em `pdp_whatsapp_click` com `source`.
- ~~`form_view`~~ → coberto por `view_item`/`internal_link_click`.
- ~~`cta_hover`~~ → ruído, não acionável.

---

**Última revisão:** Sprint 4. Próxima revisão obrigatória ao adicionar checkout próprio.

## Observabilidade operacional (Sprint 4 — fase final)

Eventos de **degradação** persistidos em `stale_bundle_logs` via `logTelemetryEvent()` em `src/lib/telemetry.ts`. Não são eventos GA4 — servem para o painel admin detectar regressões antes do usuário reclamar.

| Evento | Disparo | Payload-chave |
|---|---|---|
| `ui_error_boundary` | React error boundary capturou erro (root ou admin) | `scope` (`root`/`admin`), `componentStack` |
| `supabase_query_slow` | Requisição `/rest/v1/*` ou `/functions/v1/*` levou ≥ `VITE_SUPABASE_SLOW_MS` (default 2500ms) e retornou < 500 | `url`, `method`, `status`, `durationMs` |
| `image_load_fail` | `<img>` em `BlurImage` ou `LazyImage` disparou `onError` | `src`, `alt` |
| `cta_resolution_fail` | `resolvePrimaryAction`/`resolveKitPrimaryAction` lançou exceção (fallback aplicado) | dados defensivos do produto |

Todos passam pelo throttle de 10s do telemetry e respeitam o `correlation_id` da sessão.
