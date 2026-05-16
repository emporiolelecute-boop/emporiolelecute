/**
 * Fase 10.2 — Governança SAFE MODE para rotas combinatórias.
 *
 * Regras:
 *  - NUNCA indexar automaticamente.
 *  - Página só é considerada indexável se passar TODOS os gates.
 *  - Risco de canibalização força noindex independente do score.
 *  - shouldAppearInSitemap retorna false por padrão (nesta fase).
 */

export const SITE_ORIGIN = "https://emporiolelecute.com.br";

export type CombinationKey = {
  primaryType: "segment" | "category" | "tag";
  primarySlug: string;
  secondaryType: "occasion";
  secondarySlug: string;
};

export interface RegistryEntry {
  id?: string;
  path: string;
  is_indexable: boolean;
  discovery_status: string;
  products_count: number;
  quality_score: number;
  confidence_score: number;
  thin_content_risk: boolean;
  has_editorial?: boolean;
  has_faq?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  editorial_content?: string | null;
}

export interface IndexabilityVerdict {
  indexable: boolean;
  robots: "index,follow" | "noindex,follow";
  canonical: string;
  reasons: string[];
  cannibalRisk: "none" | "low" | "medium" | "high";
}

export const MIN_PRODUCTS = 6;
export const MIN_QUALITY = 70;

/**
 * Detecta risco de canibalização entre a combinação e taxonomias principais.
 * Heurística leve (sem consultas externas):
 *  - Combinações `tag + ocasião` competem fortemente com `/ocasiao/:slug`.
 *  - Combinações com poucos produtos relativos à ocasião pura tendem a canibalizar.
 *  - Se a combinação tem score próximo ao da página de ocasião, considerado redundante.
 */
export function detectCannibalizationRisk(params: {
  primaryType: "segment" | "category" | "tag";
  productsCount: number;
  occasionTotalProducts?: number;
}): IndexabilityVerdict["cannibalRisk"] {
  // Tag + ocasião quase sempre canibaliza taxonomia principal.
  if (params.primaryType === "tag") return "high";

  const total = params.occasionTotalProducts ?? 0;
  if (total > 0) {
    const ratio = params.productsCount / total;
    // Combinação cobre >= 80% da ocasião → redundante.
    if (ratio >= 0.8) return "high";
    if (ratio >= 0.6) return "medium";
    if (ratio >= 0.4) return "low";
  }
  return "low";
}

export function evaluateIndexability(
  entry: RegistryEntry | null,
  ctx: {
    canonicalPath: string; // sempre `/segmento/:s/ocasiao/:o`
    primaryType: "segment" | "category" | "tag";
    productsCount: number;
    fallbackCanonical?: string;
    occasionTotalProducts?: number;
  }
): IndexabilityVerdict {
  const reasons: string[] = [];
  const fallbackCanonical = ctx.fallbackCanonical ?? "/produtos";

  const cannibalRisk = detectCannibalizationRisk({
    primaryType: ctx.primaryType,
    productsCount: ctx.productsCount,
    occasionTotalProducts: ctx.occasionTotalProducts,
  });

  if (!entry) reasons.push("Sem registro em combination_pages_registry");
  if (entry && entry.discovery_status !== "approved") reasons.push("Não aprovada pela curadoria");
  if (!entry || !entry.is_indexable) reasons.push("Flag is_indexable=false");
  if (ctx.productsCount < MIN_PRODUCTS) reasons.push(`Produtos insuficientes (${ctx.productsCount}/${MIN_PRODUCTS})`);
  if (entry && entry.quality_score < MIN_QUALITY) reasons.push(`Quality score ${entry.quality_score} < ${MIN_QUALITY}`);
  if (entry && entry.thin_content_risk) reasons.push("Marcada como thin content");
  if (cannibalRisk === "high") reasons.push("Risco alto de canibalização");

  const indexable = reasons.length === 0;
  const canonicalPath = indexable ? ctx.canonicalPath : fallbackCanonical;

  return {
    indexable,
    robots: indexable ? "index,follow" : "noindex,follow",
    canonical: `${SITE_ORIGIN}${canonicalPath}`,
    reasons,
    cannibalRisk,
  };
}

/**
 * SAFE MODE: nunca incluir combinações no sitemap nesta fase.
 * Hook preparado para futuras fases — basta trocar o gate.
 */
export function shouldAppearInSitemap(_entry: RegistryEntry | null): boolean {
  return false;
}

export function buildCombinationCanonicalPath(
  segmentSlug: string,
  occasionSlug: string
): string {
  return `/segmento/${segmentSlug}/ocasiao/${occasionSlug}`;
}

export function buildCombinationTitle(segmentName: string, occasionName: string): string {
  // Ex.: "Lembrancinhas para Casamento | Empório LeleCute"
  return `${segmentName} para ${occasionName} | Empório LeleCute`;
}

export function buildCombinationDescription(
  segmentName: string,
  occasionName: string,
  productsCount: number
): string {
  const base = `Explore nossa seleção de ${segmentName.toLowerCase()} ideais para ${occasionName.toLowerCase()}.`;
  const tail = productsCount > 0
    ? ` ${productsCount} opções artesanais personalizadas, feitas com carinho pelo Empório LeleCute.`
    : " Produtos artesanais personalizados feitos com carinho pelo Empório LeleCute.";
  return (base + tail).slice(0, 160);
}
