/**
 * Resolve um produto a partir de qualquer slug conhecido (primário ou alias).
 *
 * Fase 1: consumido por useDbProduct como fonte oficial de lookup.
 *
 * Contrato:
 *   - slug primário (is_primary=true)        → resolvedVia: 'primary'
 *   - slug não primário ativo, source manual → resolvedVia: 'alias'
 *   - slug não primário ativo, source legacy/rename/import → resolvedVia: 'historical'
 *   - alias inativo (is_active=false)        → retorna null (404 definitivo,
 *                                              SEM redirect, SEM soft canonical)
 *   - slug desconhecido                      → retorna null
 *
 * Telemetria de hits é fire-and-forget; falha silenciosa.
 */

import { supabase } from "@/integrations/supabase/client";
import { normalizeSlug } from "@/lib/slug";

export type ResolvedVia = "primary" | "alias" | "historical";

export interface ResolvedSlug {
  productId: string;
  matchedSlug: string;
  primarySlug: string;
  isPrimary: boolean;
  isActive: boolean;
  /** true quando o slug consultado é diferente do primário. */
  shouldRedirect: boolean;
  /** Como o produto foi resolvido. */
  resolvedVia: ResolvedVia;
}

interface ResolveRow {
  product_id: string;
  matched_slug: string;
  primary_slug: string;
  is_primary: boolean;
  is_active: boolean;
  source?: string | null;
}

function classify(row: ResolveRow): ResolvedVia {
  if (row.is_primary) return "primary";
  const src = (row.source || "").toLowerCase();
  if (src === "manual" || src === "alias") return "alias";
  return "historical";
}

export async function resolveProductSlug(rawSlug: string): Promise<ResolvedSlug | null> {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) return null;

  const { data, error } = await supabase.rpc("resolve_product_slug", { _slug: normalized });
  if (error || !data || data.length === 0) return null;

  const row = data[0] as ResolveRow;
  if (!row.is_active) return null;

  return {
    productId: row.product_id,
    matchedSlug: row.matched_slug,
    primarySlug: row.primary_slug,
    isPrimary: row.is_primary,
    isActive: row.is_active,
    shouldRedirect: row.matched_slug !== row.primary_slug,
    resolvedVia: classify(row),
  };
}

export function recordProductSlugHit(rawSlug: string): void {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) return;
  void supabase.rpc("record_product_slug_hit", { _slug: normalized }).then(() => {
    /* noop */
  });
}
