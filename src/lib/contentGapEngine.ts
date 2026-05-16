/**
 * Fase 11.2 — Content Gap Engine (SAFE MODE).
 *
 * Detecta lacunas editoriais cruzando sinais que JÁ existem.
 * Não escreve, não publica, não automatiza — apenas relata.
 */

export type GapSeverity = "critical" | "high" | "medium" | "low";

export interface GapEntityInput {
  entityType: "category" | "occasion" | "segment" | "tag" | "theme" | "combination" | "product" | "blog_post";
  slug: string;
  name: string;
  authority?: number;
  productsCount?: number;
  blogPostsCount?: number;
  faqCount?: number;
  internalLinksCount?: number;
  reviewsCount?: number;
  editorialLength?: number;
  hasHub?: boolean;
  hasEditorial?: boolean;
  isPremium?: boolean;
  clusterSize?: number;
  approved?: boolean;
}

export interface MissingAsset {
  asset: "editorial" | "faq" | "blog_post" | "hub" | "reviews" | "internal_links" | "hero_image";
  details: string;
}

export interface GapResult {
  entityType: GapEntityInput["entityType"];
  slug: string;
  name: string;
  severity: GapSeverity;
  opportunityScore: number;       // 0..100
  estimatedImpact: "small" | "medium" | "large" | "huge";
  missingAssets: MissingAsset[];
  suggestedActions: string[];
}

function severityFromScore(score: number): GapSeverity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function impactFrom(score: number): GapResult["estimatedImpact"] {
  if (score >= 80) return "huge";
  if (score >= 60) return "large";
  if (score >= 40) return "medium";
  return "small";
}

export function detectGap(e: GapEntityInput): GapResult {
  const missing: MissingAsset[] = [];
  const actions: string[] = [];
  let score = 0;

  const authority = e.authority ?? 0;
  const products = e.productsCount ?? 0;

  // Taxonomia/tema/segmento forte sem blog support
  if ((e.entityType !== "blog_post") && authority >= 65 && (e.blogPostsCount ?? 0) === 0) {
    missing.push({ asset: "blog_post", details: "Entidade forte sem post de blog suporte" });
    actions.push("Escrever 1 post de blog conectando esta entidade");
    score += 25;
  }

  // Tema forte sem hub
  if (e.entityType === "theme" && !e.hasHub && authority >= 60) {
    missing.push({ asset: "hub", details: "Tema forte sem hub publicado" });
    actions.push("Aprovar e enriquecer o hub temático");
    score += 20;
  }

  // Produto premium sem editorial
  if (e.entityType === "product" && e.isPremium && (e.editorialLength ?? 0) < 400) {
    missing.push({ asset: "editorial", details: "Produto premium com editorial curto" });
    actions.push("Adicionar editorial longo (600+ palavras) ao produto premium");
    score += 22;
  }

  // Editorial fraco geral
  if ((e.editorialLength ?? 0) < 300 && products >= 6) {
    missing.push({ asset: "editorial", details: "Editorial < 300 chars com bom catálogo" });
    actions.push("Escrever descrição editorial longa (300+ palavras)");
    score += 18;
  }

  // FAQ ausente
  if ((e.faqCount ?? 0) < 2 && products >= 4) {
    missing.push({ asset: "faq", details: "Sem FAQ contextual" });
    actions.push("Adicionar 3 a 5 perguntas frequentes");
    score += 12;
  }

  // Links internos baixos
  if ((e.internalLinksCount ?? 0) < 3) {
    missing.push({ asset: "internal_links", details: "Poucos links internos" });
    actions.push("Adicionar 3+ links internos humanos");
    score += 10;
  }

  // Reviews ausentes
  if ((e.reviewsCount ?? 0) === 0 && products >= 5) {
    missing.push({ asset: "reviews", details: "Catálogo bom sem reviews" });
    actions.push("Conectar avaliações reais aos produtos");
    score += 10;
  }

  // Cluster sem cobertura
  if ((e.clusterSize ?? 0) >= 5 && (e.blogPostsCount ?? 0) === 0 && (e.faqCount ?? 0) < 2) {
    actions.push("Cluster grande precisa de conteúdo de cobertura");
    score += 8;
  }

  // Combinação promissora sem editorial
  if (e.entityType === "combination" && products >= 6 && (e.editorialLength ?? 0) < 200) {
    missing.push({ asset: "editorial", details: "Combinação com catálogo mas sem editorial" });
    actions.push("Adicionar editorial mínimo curado à combinação");
    score += 12;
  }

  score = Math.min(100, Math.round(score));

  return {
    entityType: e.entityType,
    slug: e.slug,
    name: e.name,
    severity: severityFromScore(score),
    opportunityScore: score,
    estimatedImpact: impactFrom(score),
    missingAssets: missing,
    suggestedActions: actions,
  };
}

export function detectGaps(inputs: GapEntityInput[]): GapResult[] {
  return inputs
    .map(detectGap)
    .filter((g) => g.opportunityScore > 0)
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

// Buckets para o dashboard.

export interface GapBuckets {
  highestImpact: GapResult[];
  noContent: GapResult[];
  noFaqs: GapResult[];
  noLinks: GapResult[];
  noReviews: GapResult[];
  noBlog: GapResult[];
  noHubs: GapResult[];
  thinClusters: GapResult[];
}

export function buildGapBuckets(inputs: GapEntityInput[]): GapBuckets {
  const gaps = detectGaps(inputs);
  const has = (g: GapResult, a: MissingAsset["asset"]) =>
    g.missingAssets.some((m) => m.asset === a);
  return {
    highestImpact: gaps.slice(0, 30),
    noContent: gaps.filter((g) => has(g, "editorial")).slice(0, 40),
    noFaqs: gaps.filter((g) => has(g, "faq")).slice(0, 40),
    noLinks: gaps.filter((g) => has(g, "internal_links")).slice(0, 40),
    noReviews: gaps.filter((g) => has(g, "reviews")).slice(0, 40),
    noBlog: gaps.filter((g) => has(g, "blog_post")).slice(0, 40),
    noHubs: gaps.filter((g) => has(g, "hub")).slice(0, 40),
    thinClusters: gaps.filter((g) => g.severity === "high" || g.severity === "critical").slice(0, 40),
  };
}
