/**
 * Fase 13 — Semantic ROI Engine.
 * Classificação heurística de retorno por tipo de ação.
 */

export type ROIBand = "high" | "medium" | "low" | "waste_risk";

export interface ROIInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  authority?: number;
  readiness?: number;
  maturity?: number;
  coverage?: number;
  links?: number;
  faqs?: number;
  reviews?: number;
  editorialSize?: number;
  thinContent?: boolean;
  orphan?: boolean;
}

export interface ROIScore {
  type: "editorial" | "faq" | "review" | "linking" | "blog_support" | "hub_strengthening";
  score: number;       // 0..100
  band: ROIBand;
  rationale: string;
}

function band(score: number, waste = false): ROIBand {
  if (waste) return "waste_risk";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export function calculateSemanticROI(i: ROIInput): ROIScore[] {
  const out: ROIScore[] = [];
  const auth = i.authority ?? 0;
  const ed = i.editorialSize ?? 0;
  const lk = i.links ?? 0;
  const fq = i.faqs ?? 0;
  const rv = i.reviews ?? 0;
  const cov = i.coverage ?? 0;

  const editorialScore = Math.min(100, (ed < 400 ? 80 : ed < 800 ? 50 : 20) + (auth >= 50 ? 10 : 0));
  out.push({ type: "editorial", score: editorialScore, band: band(editorialScore, ed > 1500), rationale: ed < 400 ? "Conteúdo raso, alta janela de ganho" : "Conteúdo robusto" });

  const faqScore = Math.min(100, (fq < 3 ? 75 : fq < 6 ? 40 : 15) + (auth >= 40 ? 10 : 0));
  out.push({ type: "faq", score: faqScore, band: band(faqScore), rationale: fq < 3 ? "Sem FAQ relevante" : "FAQ saudável" });

  const reviewScore = Math.min(100, (rv < 2 ? 70 : rv < 5 ? 45 : 20) + (i.entityType === "product" ? 10 : 0));
  out.push({ type: "review", score: reviewScore, band: band(reviewScore), rationale: rv < 2 ? "Sem prova social" : "Reviews presentes" });

  const linkScore = Math.min(100, (lk < 3 ? 85 : lk < 6 ? 50 : 20) + (i.orphan ? 10 : 0));
  out.push({ type: "linking", score: linkScore, band: band(linkScore, lk > 14), rationale: i.orphan ? "Página órfã" : "Conectividade ok" });

  const blogScore = Math.min(100, (cov < 50 ? 65 : cov < 75 ? 40 : 20));
  out.push({ type: "blog_support", score: blogScore, band: band(blogScore), rationale: "Posts de apoio reforçam o cluster" });

  const hubScore = Math.min(100, (auth < 60 ? 70 : auth < 80 ? 45 : 20));
  out.push({ type: "hub_strengthening", score: hubScore, band: band(hubScore), rationale: auth < 60 ? "Hub frágil" : "Hub dominante" });

  return out.sort((a, b) => b.score - a.score);
}

export function averageSemanticROI(items: ROIInput[]): number {
  if (!items.length) return 0;
  const all = items.flatMap(calculateSemanticROI).map((s) => s.score);
  return Math.round(all.reduce((a, b) => a + b, 0) / all.length);
}
