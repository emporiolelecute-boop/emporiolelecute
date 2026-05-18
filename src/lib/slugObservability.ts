/**
 * Observabilidade estruturada para resolução de slugs de produto.
 *
 * Fase 1: usa console.debug/console.error. Em fases futuras pode
 * encaminhar para um sink (analytics, Sentry, edge function).
 *
 * Mantenha logs estruturados (objeto), sem string concat espalhado.
 */

export type SlugEvent =
  | "alias_hit"
  | "historical_hit"
  | "replace_executed"
  | "loop_prevented"
  | "inactive_alias"
  | "unknown_slug"
  | "structural_inconsistency";

export interface SlugEventPayload {
  matchedSlug?: string;
  primarySlug?: string;
  productId?: string;
  pathname?: string;
  reason?: string;
  [key: string]: unknown;
}

const PREFIX = "[slug]";

export function logSlugEvent(event: SlugEvent, payload: SlugEventPayload = {}): void {
  const entry = { event, ...payload, ts: new Date().toISOString() };
  if (event === "structural_inconsistency") {
    // eslint-disable-next-line no-console
    console.error(PREFIX, entry);
    return;
  }
  // eslint-disable-next-line no-console
  console.debug(PREFIX, entry);
}
