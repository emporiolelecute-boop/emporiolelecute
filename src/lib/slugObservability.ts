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

/**
 * Fase 2.3 — severidade explícita por evento (operacional).
 * error → console.error + buffer + amostragem 100%.
 * warn  → console.warn + buffer + amostragem 100%.
 * info  → console.debug + buffer + sujeito a sampling.
 * debug → console.debug + buffer + sujeito a sampling.
 */
const SEVERITY: Record<SlugEventName, "error" | "warn" | "info" | "debug"> = {
  alias_hit: "debug",
  historical_hit: "debug",
  replace_executed: "info",
  loop_prevented: "warn",
  unknown_slug: "info",
  slug_resolution_failed: "warn",
  inactive_alias_attempt: "info",
  structural_inconsistency: "error",
  slug_drift_detected: "error",
  canonical_mismatch: "error",
  redirect_chain_detected: "warn",
  legacy_namespace_hit: "info",
  canonical_namespace_mismatch: "error",
  merchant_url_mismatch: "error",
  sitemap_namespace_mismatch: "error",
};

/** Sampling — críticos sempre 1; alta-frequência reduzidos para não poluir. */
const SAMPLING: Partial<Record<SlugEventName, number>> = {
  alias_hit: 0.2,
  historical_hit: 0.2,
  legacy_namespace_hit: 0.25,
};

/**
 * Ring buffer in-memory para inspeção ad-hoc no devtools.
 * Acesse via `window.__slugEvents` (apenas browser). Não persiste entre reloads.
 * Mantido pequeno (200 entries) para não vazar memória.
 */
const BUFFER_MAX = 200;
const buffer: Array<Record<string, unknown>> = [];

function pushBuffer(entry: Record<string, unknown>) {
  buffer.push(entry);
  if (buffer.length > BUFFER_MAX) buffer.splice(0, buffer.length - BUFFER_MAX);
  if (typeof window !== "undefined") {
    (window as unknown as { __slugEvents?: unknown[] }).__slugEvents = buffer;
  }
}

export function getSlugEventBuffer(): ReadonlyArray<Record<string, unknown>> {
  return buffer;
}

export function logSlugEvent(payload: SlugLogEvent): void {
  const severity = SEVERITY[payload.event] ?? "debug";
  const sampleRate = SAMPLING[payload.event] ?? 1;
  if (severity !== "error" && Math.random() > sampleRate) return;

  const entry = {
    ...payload,
    severity,
    source: "client" as const,
    ts: new Date().toISOString(),
  };
  pushBuffer(entry);

  const sink =
    severity === "error"
      ? // eslint-disable-next-line no-console
        console.error
      : severity === "warn"
        ? // eslint-disable-next-line no-console
          console.warn
        : // eslint-disable-next-line no-console
          console.debug;
  sink(PREFIX, entry);
}
