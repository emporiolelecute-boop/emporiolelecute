/**
 * Fase 10.3 — Hubs Temáticos (SAFE MODE).
 *
 * Regras:
 *  - Hub NUNCA indexa automaticamente.
 *  - Indexável apenas se: authority >= 70 && !thin_content && is_indexed && is_approved.
 *  - Risco alto de canibalização força noindex.
 *  - shouldThemeAppearInSitemap() retorna false nesta fase.
 */

export const SITE_ORIGIN = "https://emporiolelecute.com.br";

export const MIN_PRODUCTS_THEME = 8;
export const MIN_AUTHORITY_INDEX = 70;
export const MIN_AUTHORITY_STRONG = 85;

export interface ThemeHub {
  id: string;
  slug: string;
  title: string;
  tag_id: string | null;
  intro: string | null;
  editorial_content: string | null;
  hero_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  faqs: unknown[];
  related_themes: string[];
  related_occasions: string[];
  related_segments: string[];
  related_posts: string[];
  is_approved: boolean;
  is_indexed: boolean;
  authority_score: number;
  thin_content_risk: boolean;
  cannibalization_risk: "unknown" | "none" | "low" | "medium" | "high";
  discovery_status: string;
  last_evaluated_at: string | null;
  notes: string | null;
}

export interface ThemeSignals {
  productsCount: number;
  occasionsCount: number;
  segmentsCount: number;
  reviewsCount: number;
  hasEditorial: boolean;
  goodImagesCount: number;
  visualDiversity: number; // 0..1
  blogPostsCount: number;
  relatedContentCount: number;
}

export interface ThemeVerdict {
  indexable: boolean;
  robots: "index,follow" | "noindex,follow";
  canonical: string;
  reasons: string[];
  classification: "strong" | "indexable" | "regular" | "weak";
}

/**
 * Score 0..100 com base em sinais editoriais e taxonômicos.
 */
export function themeAuthorityScore(s: ThemeSignals): number {
  let score = 0;
  // Produtos (até 25)
  score += Math.min(25, s.productsCount * 2);
  // Diversidade de ocasiões (até 15)
  score += Math.min(15, s.occasionsCount * 3);
  // Diversidade de segmentos (até 10)
  score += Math.min(10, s.segmentsCount * 4);
  // Reviews (até 10)
  score += Math.min(10, s.reviewsCount);
  // Editorial (até 12)
  if (s.hasEditorial) score += 12;
  // Imagens boas (até 10)
  score += Math.min(10, s.goodImagesCount);
  // Diversidade visual (até 8)
  score += Math.round(Math.max(0, Math.min(1, s.visualDiversity)) * 8);
  // Presença blog (até 6)
  score += Math.min(6, s.blogPostsCount * 2);
  // Related content (até 4)
  score += Math.min(4, s.relatedContentCount);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function detectWeakTheme(s: ThemeSignals): boolean {
  if (s.productsCount < MIN_PRODUCTS_THEME) return true;
  if (s.occasionsCount <= 1) return true;
  if (!s.hasEditorial) return true;
  if (s.reviewsCount === 0) return true;
  if (s.visualDiversity < 0.25) return true;
  return false;
}

export function classifyTheme(score: number): ThemeVerdict["classification"] {
  if (score >= MIN_AUTHORITY_STRONG) return "strong";
  if (score >= MIN_AUTHORITY_INDEX) return "indexable";
  if (score >= 55) return "regular";
  return "weak";
}

/**
 * Detecta canibalização entre hub e taxonomias.
 * - Hub cujo nome coincide com ocasião/segmento → competição alta.
 * - Hub cobrindo > 70% dos produtos de uma ocasião → redundante.
 */
export type CannibalRisk = "none" | "low" | "medium" | "high";

export function detectThemeCannibalization(params: {
  hubSlug: string;
  occasionSlugs: string[];
  segmentSlugs: string[];
  productsCount: number;
  largestOccasionShare?: number; // 0..1
}): CannibalRisk {
  const slug = params.hubSlug.toLowerCase();
  if (params.occasionSlugs.includes(slug)) return "high";
  if (params.segmentSlugs.includes(slug)) return "high";
  const share = params.largestOccasionShare ?? 0;
  if (share >= 0.8) return "high";
  if (share >= 0.6) return "medium";
  if (share >= 0.4) return "low";
  return "none";
}

export function evaluateThemeIndexability(
  hub: ThemeHub | null,
  signals: ThemeSignals,
  cannibalRisk: "unknown" | "none" | "low" | "medium" | "high"
): ThemeVerdict {
  const reasons: string[] = [];
  const score = hub?.authority_score ?? themeAuthorityScore(signals);
  const classification = classifyTheme(score);

  if (!hub) reasons.push("Hub não cadastrado");
  if (hub && !hub.is_approved) reasons.push("Hub não aprovado");
  if (hub && !hub.is_indexed) reasons.push("is_indexed=false");
  if (score < MIN_AUTHORITY_INDEX) reasons.push(`Authority score ${score} < ${MIN_AUTHORITY_INDEX}`);
  if (signals.productsCount < MIN_PRODUCTS_THEME) {
    reasons.push(`Produtos insuficientes (${signals.productsCount}/${MIN_PRODUCTS_THEME})`);
  }
  if (hub?.thin_content_risk || detectWeakTheme(signals)) reasons.push("Thin content");
  if (cannibalRisk === "high") reasons.push("Canibalização alta");

  const indexable = reasons.length === 0;
  const canonical = indexable
    ? `${SITE_ORIGIN}/tema/${hub!.slug}`
    : `${SITE_ORIGIN}/produtos`;

  return {
    indexable,
    robots: indexable ? "index,follow" : "noindex,follow",
    canonical,
    reasons,
    classification,
  };
}

/**
 * SAFE MODE: hubs nunca entram no sitemap nesta fase.
 */
export function shouldThemeAppearInSitemap(_hub: ThemeHub | null): boolean {
  return false;
}

export function buildThemeTitle(title: string): string {
  return `Lembrancinhas Tema ${title} | Empório LeleCute`;
}

export function buildThemeDescription(params: {
  title: string;
  productsCount: number;
  occasionNames: string[];
}): string {
  const occ = params.occasionNames.slice(0, 3).join(", ").toLowerCase();
  const base = `Coleção temática ${params.title} com ${params.productsCount} opções artesanais personalizadas`;
  const tail = occ ? `, ideais para ${occ}.` : ".";
  return (base + tail).slice(0, 160);
}
