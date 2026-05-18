/**
 * Resolve um produto a partir de qualquer slug conhecido (primário ou alias).
 *
 * Fase 0: criado mas NÃO consumido por componentes. Está aqui para que
 * a Fase 1 possa plugar dentro de `useDbProduct` sem reescrever lógica.
 *
 * Telemetria de hits é fire-and-forget; falha silenciosa para não
 * impactar a renderização.
 */

import { supabase } from "@/integrations/supabase/client";
import { normalizeSlug } from "@/lib/slug";

export interface ResolvedSlug {
  productId: string;
  matchedSlug: string;
  primarySlug: string;
  isPrimary: boolean;
  isActive: boolean;
  /** true quando o slug consultado é diferente do primário (alias/histórico). */
  shouldRedirect: boolean;
}

/**
 * Resolve um slug arbitrário para o produto canônico.
 * Retorna `null` quando o slug é desconhecido ou inativo.
 */
export async function resolveProductSlug(rawSlug: string): Promise<ResolvedSlug | null> {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) return null;

  const { data, error } = await supabase.rpc("resolve_product_slug", { _slug: normalized });
  if (error || !data || data.length === 0) return null;

  const row = data[0] as {
    product_id: string;
    matched_slug: string;
    primary_slug: string;
    is_primary: boolean;
    is_active: boolean;
  };

  if (!row.is_active) return null;

  return {
    productId: row.product_id,
    matchedSlug: row.matched_slug,
    primarySlug: row.primary_slug,
    isPrimary: row.is_primary,
    isActive: row.is_active,
    shouldRedirect: row.matched_slug !== row.primary_slug,
  };
}

/** Telemetria fire-and-forget de hit em um slug. */
export function recordProductSlugHit(rawSlug: string): void {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) return;
  void supabase.rpc("record_product_slug_hit", { _slug: normalized }).then(() => {
    /* noop */
  });
}
