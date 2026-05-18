/**
 * Observabilidade estruturada para resolução de slugs de produto (Fase 1.5).
 *
 * Discriminated union por evento — cada evento carrega payload tipado.
 * Em fases futuras pode encaminhar para um sink (analytics, Sentry, edge).
 *
 * IMPORTANTE: `unknown_slug` é mantido (granularidade histórica). O novo
 * evento `inactive_alias_attempt` distingue 404 por alias desativado de
 * 404 por slug realmente desconhecido.
 */

interface BaseLog {
  matchedSlug?: string;
  primarySlug?: string;
  productId?: string;
  pathname?: string;
}

export type SlugLogEvent =
  // Hits válidos
  | ({ event: "alias_hit" } & BaseLog)
  | ({ event: "historical_hit" } & BaseLog)
  // Replace
  | ({ event: "replace_executed" } & BaseLog)
  | ({ event: "loop_prevented" } & BaseLog)
  // Falhas de resolução
  | ({ event: "unknown_slug"; matchedSlug: string } & BaseLog)
  | ({ event: "slug_resolution_failed"; reason: string } & BaseLog)
  | ({ event: "inactive_alias_attempt"; matchedSlug: string } & BaseLog)
  // Inconsistências
  | ({
      event: "structural_inconsistency";
      reason: string;
      productSlug?: string;
    } & BaseLog)
  | ({
      event: "slug_drift_detected";
      productSlug: string;
    } & BaseLog)
  | ({
      event: "canonical_mismatch";
      expected: string;
      actual: string;
    } & BaseLog)
  | ({
      event: "redirect_chain_detected";
      hopFrom: string;
      hopTo: string;
    } & BaseLog)
  // Fase 2.0 — namespace de produto: definido agora, ativado na Fase 2.2.
  // Será emitido quando a rota legada (`/produtos/` pós-flip) for acessada
  // e o `LegacyProductRedirect` for disparado. Inerte enquanto o prefixo
  // canônico ainda for `/produtos`.
  | ({
      event: "legacy_namespace_hit";
      legacyPrefix: string;
      targetPrefix: string;
    } & BaseLog)
  // Fase 2.1 — drift de superfícies SEO. Inertes em produção até a Fase 2.2
  // (sinalizam discrepância entre helper canônico e superfície externa).
  | ({
      event: "canonical_namespace_mismatch";
      expectedPrefix: string;
      actualPrefix: string;
      url: string;
    } & BaseLog)
  | ({
      event: "merchant_url_mismatch";
      expectedPrefix: string;
      actualPrefix: string;
      url: string;
    } & BaseLog)
  | ({
      event: "sitemap_namespace_mismatch";
      expectedPrefix: string;
      actualPrefix: string;
      url: string;
    } & BaseLog);

export type SlugEventName = SlugLogEvent["event"];

const PREFIX = "[slug]";

// Eventos críticos vão para console.error; demais para console.debug.
const ERROR_EVENTS: ReadonlySet<SlugEventName> = new Set([
  "structural_inconsistency",
  "slug_drift_detected",
  "canonical_mismatch",
  "canonical_namespace_mismatch",
  "merchant_url_mismatch",
  "sitemap_namespace_mismatch",
]);

export function logSlugEvent(payload: SlugLogEvent): void {
  const entry = { ...payload, ts: new Date().toISOString() };
  if (ERROR_EVENTS.has(payload.event)) {
    // eslint-disable-next-line no-console
    console.error(PREFIX, entry);
    return;
  }
  // eslint-disable-next-line no-console
  console.debug(PREFIX, entry);
}
