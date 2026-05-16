/**
 * Fase 10.4 — Authority Engine.
 *
 * Centraliza cálculo de:
 *  - authority score
 *  - quality / topical coverage
 *  - thin content
 *  - cannibalization
 *  - readiness para indexação
 *
 * SAFE MODE: nada aqui força entrada em sitemap nem indexação automática.
 */

export interface AuthoritySignals {
  productsCount: number;
  occasionsCount: number;
  segmentsCount: number;
  categoriesCount: number;
  tagsCount: number;
  reviewsCount: number;
  hasEditorial: boolean;
  goodImagesCount: number;
  visualDiversity: number; // 0..1
  blogPostsCount: number;
  relatedContentCount: number;
  internalLinksCount: number;
}

export interface AuthorityResult {
  authority: number;        // 0..100
  topicalCoverage: number;  // 0..100
  thinContentRisk: boolean;
  thinReasons: string[];
  classification: "strong" | "indexable" | "regular" | "weak";
}

export const STRONG = 85;
export const INDEXABLE = 70;
export const REGULAR = 55;

// ----- helpers -----

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function classifyAuthority(score: number): AuthorityResult["classification"] {
  if (score >= STRONG) return "strong";
  if (score >= INDEXABLE) return "indexable";
  if (score >= REGULAR) return "regular";
  return "weak";
}

// ----- core scorers -----

/** Authority score 0..100 baseado em sinais editoriais + taxonômicos. */
export function calculateAuthority(s: AuthoritySignals): number {
  let score = 0;
  score += Math.min(25, s.productsCount * 2);
  score += Math.min(12, s.occasionsCount * 3);
  score += Math.min(10, s.segmentsCount * 4);
  score += Math.min(8, s.categoriesCount * 2);
  score += Math.min(10, s.reviewsCount);
  if (s.hasEditorial) score += 12;
  score += Math.min(10, s.goodImagesCount);
  score += Math.round(Math.max(0, Math.min(1, s.visualDiversity)) * 6);
  score += Math.min(6, s.blogPostsCount * 2);
  score += Math.min(4, s.relatedContentCount);
  score += Math.min(7, Math.round(s.internalLinksCount / 2));
  return clamp(Math.round(score));
}

/** Cobertura temática: até que ponto a entidade cobre seu campo semântico. */
export function calculateTopicalCoverage(s: AuthoritySignals): number {
  const diversity = s.occasionsCount + s.segmentsCount + s.categoriesCount;
  let cov = 0;
  cov += Math.min(40, diversity * 5);
  cov += Math.min(25, s.productsCount * 1.5);
  cov += Math.min(15, s.blogPostsCount * 5);
  cov += Math.min(10, s.relatedContentCount * 2);
  cov += Math.round(Math.max(0, Math.min(1, s.visualDiversity)) * 10);
  return clamp(Math.round(cov));
}

export function detectThinContent(s: AuthoritySignals): { risk: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (s.productsCount < 6) reasons.push("Menos de 6 produtos");
  if (s.occasionsCount + s.segmentsCount < 2) reasons.push("Diversidade taxonômica baixa");
  if (!s.hasEditorial) reasons.push("Sem conteúdo editorial");
  if (s.reviewsCount === 0) reasons.push("Sem avaliações");
  if (s.visualDiversity < 0.25) reasons.push("Pouca diversidade visual");
  return { risk: reasons.length >= 2, reasons };
}

export function detectCannibalization(params: {
  slug: string;
  competingSlugs: string[];
  primaryShare?: number; // 0..1 — share de produtos cobertos por uma única taxonomia
}): "none" | "low" | "medium" | "high" {
  const s = params.slug.toLowerCase();
  if (params.competingSlugs.map((x) => x.toLowerCase()).includes(s)) return "high";
  const share = params.primaryShare ?? 0;
  if (share >= 0.8) return "high";
  if (share >= 0.6) return "medium";
  if (share >= 0.4) return "low";
  return "none";
}

export function evaluateAuthority(s: AuthoritySignals): AuthorityResult {
  const authority = calculateAuthority(s);
  const topicalCoverage = calculateTopicalCoverage(s);
  const thin = detectThinContent(s);
  return {
    authority,
    topicalCoverage,
    thinContentRisk: thin.risk,
    thinReasons: thin.reasons,
    classification: classifyAuthority(authority),
  };
}

// ----- domain wrappers -----

export function calculateThemeAuthority(s: AuthoritySignals): AuthorityResult {
  return evaluateAuthority(s);
}

export function calculateCombinationAuthority(s: AuthoritySignals): AuthorityResult {
  return evaluateAuthority(s);
}

export function calculateTaxonomyAuthority(s: AuthoritySignals): AuthorityResult {
  return evaluateAuthority(s);
}

// ----- readiness -----

export interface ReadinessInput {
  authority: number;
  topicalCoverage: number;
  internalLinksCount: number;
  reviewsCount: number;
  diversity: number;            // occasions + segments
  thinContentRisk: boolean;
  cannibalization: "none" | "low" | "medium" | "high" | "unknown";
}

export interface ReadinessResult {
  score: number; // 0..100
  status: "ready" | "almost" | "needs_work" | "blocked";
  reasons: string[];
}

export function calculateIndexReadiness(i: ReadinessInput): ReadinessResult {
  const reasons: string[] = [];
  let score = 0;

  score += Math.round(i.authority * 0.45);                    // até 45
  score += Math.round(i.topicalCoverage * 0.25);              // até 25
  score += Math.min(10, i.internalLinksCount);                // até 10
  score += Math.min(8, i.reviewsCount);                       // até 8
  score += Math.min(7, i.diversity * 2);                      // até 7
  if (!i.thinContentRisk) score += 5;
  if (i.cannibalization === "none") score += 5;
  else if (i.cannibalization === "low") score += 2;
  if (i.cannibalization === "high" || i.cannibalization === "medium") {
    reasons.push("Risco de canibalização");
  }
  if (i.thinContentRisk) reasons.push("Thin content");
  if (i.authority < INDEXABLE) reasons.push(`Authority ${i.authority} < ${INDEXABLE}`);
  if (i.internalLinksCount < 2) reasons.push("Poucos links internos");

  score = clamp(score);
  let status: ReadinessResult["status"];
  if (score >= 85 && !i.thinContentRisk && i.cannibalization !== "high") status = "ready";
  else if (score >= 70) status = "almost";
  else if (score >= 55) status = "needs_work";
  else status = "blocked";

  return { score, status, reasons };
}

// ----- governance / manipulation detection -----

export interface ManipulationSignals {
  slug: string;
  authority: number;
  productsCount: number;
  diversity: number;
  overlapWithOtherHubs: number; // 0..1 — share de produtos compartilhados
  outboundLinksCount: number;
  duplicateLinkRatio: number;   // 0..1
}

export interface ManipulationVerdict {
  manipulated: boolean;
  penalty: number;   // 0..50
  reasons: string[];
}

export function detectAuthorityManipulation(s: ManipulationSignals): ManipulationVerdict {
  const reasons: string[] = [];
  let penalty = 0;

  // Hub artificial: score alto mas pouquíssimos produtos.
  if (s.authority >= INDEXABLE && s.productsCount < 6) {
    reasons.push("Authority alto com catálogo insuficiente");
    penalty += 20;
  }
  // Overlap excessivo.
  if (s.overlapWithOtherHubs >= 0.75) {
    reasons.push("Sobreposição alta com outros hubs");
    penalty += 15;
  }
  // Diversidade baixa.
  if (s.diversity < 2) {
    reasons.push("Diversidade taxonômica insuficiente");
    penalty += 10;
  }
  // Overlinking.
  if (s.outboundLinksCount > 24) {
    reasons.push("Overlinking (>24 links)");
    penalty += 10;
  }
  if (s.duplicateLinkRatio >= 0.5) {
    reasons.push("Links duplicados em excesso");
    penalty += 10;
  }
  return { manipulated: penalty >= 20, penalty: Math.min(50, penalty), reasons };
}
