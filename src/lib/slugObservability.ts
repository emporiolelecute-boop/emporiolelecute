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
    } & BaseLog);

export type SlugEventName = SlugLogEvent["event"];

const PREFIX = "[slug]";

// Eventos críticos vão para console.error; demais para console.debug.
const ERROR_EVENTS: ReadonlySet<SlugEventName> = new Set([
  "structural_inconsistency",
  "slug_drift_detected",
  "canonical_mismatch",
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
