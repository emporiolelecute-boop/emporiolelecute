/**
 * Fase 11 — Editorial Priorities.
 *
 * Camada de leitura / consolidação que usa toda a infra construída
 * (authority, taxonomias, hubs, blog, reviews, imagens) para sugerir
 * onde humanos devem investir esforço editorial.
 *
 * SAFE MODE:
 *  - nenhuma função aqui publica, indexa, gera conteúdo ou altera URLs.
 *  - tudo é orientação para curadoria humana.
 */

import {
  calculateAuthority,
  calculateTopicalCoverage,
  detectThinContent,
  classifyAuthority,
  type AuthoritySignals,
} from "./authorityEngine";

export type EditorialEntityType = "category" | "occasion" | "segment" | "theme";
export type EditorialPriority = "critical" | "high" | "medium" | "low";

export interface EditorialTargetInput {
  type: EditorialEntityType;
  slug: string;
  name: string;
  signals: AuthoritySignals;
  hasFaq?: boolean;
  hasMeta?: boolean;
  hasHeroImage?: boolean;
  editorialLength?: number;
  approved?: boolean;
  inSitemap?: boolean;
  readinessScore?: number;
}

export interface EditorialTarget {
  priority: EditorialPriority;
  type: EditorialEntityType;
  slug: string;
  name: string;
  authority: number;
  topicalCoverage: number;
  readiness: number;
  productsCount: number;
  reviewsCount: number;
  internalLinksCount: number;
  editorialLength: number;
  thinContentRisk: boolean;
  inSitemap: boolean;
  reasons: string[];
  suggested_actions: string[];
}

function actionsFor(t: EditorialTargetInput, authority: number): string[] {
  const actions: string[] = [];
  if ((t.editorialLength ?? 0) < 300) actions.push("Adicionar descrição editorial longa (300+ palavras)");
  if (!t.hasFaq) actions.push("Adicionar FAQ contextual (3-5 perguntas)");
  if (!t.hasMeta) actions.push("Revisar meta title e description");
  if (!t.hasHeroImage) actions.push("Adicionar imagem hero contextual");
  if (t.signals.reviewsCount < 3) actions.push("Conectar avaliações reais");
  if (t.signals.internalLinksCount < 4) actions.push("Adicionar links internos humanos");
  if (t.signals.blogPostsCount === 0) actions.push("Conectar a um post de blog");
  if (t.signals.visualDiversity < 0.4) actions.push("Diversificar imagens dos produtos");
  if (authority < 70) actions.push("Reforçar autoridade temática (produtos + editorial)");
  return actions;
}

function priorityFromScore(authority: number, productsCount: number, thin: boolean): EditorialPriority {
  if (authority >= 80 && productsCount >= 12) return "critical";
  if (authority >= 65 && productsCount >= 8) return "high";
  if (authority >= 50 || productsCount >= 6) return "medium";
  return thin ? "low" : "medium";
}

export function evaluateEditorialTarget(t: EditorialTargetInput): EditorialTarget {
  const authority = calculateAuthority(t.signals);
  const topicalCoverage = calculateTopicalCoverage(t.signals);
  const thin = detectThinContent(t.signals);
  const readiness = t.readinessScore ?? Math.round(authority * 0.6 + topicalCoverage * 0.4);
  const priority = priorityFromScore(authority, t.signals.productsCount, thin.risk);

  const reasons: string[] = [];
  if (t.signals.productsCount >= 10) reasons.push(`${t.signals.productsCount} produtos`);
  if (t.signals.reviewsCount >= 3) reasons.push(`${t.signals.reviewsCount} avaliações`);
  if (t.signals.blogPostsCount > 0) reasons.push("conectado ao blog");
  if (classifyAuthority(authority) === "strong") reasons.push("authority strong");
  if (thin.risk) reasons.push(...thin.reasons.map((r) => `risco: ${r}`));

  return {
    priority,
    type: t.type,
    slug: t.slug,
    name: t.name,
    authority,
    topicalCoverage,
    readiness,
    productsCount: t.signals.productsCount,
    reviewsCount: t.signals.reviewsCount,
    internalLinksCount: t.signals.internalLinksCount,
    editorialLength: t.editorialLength ?? 0,
    thinContentRisk: thin.risk,
    inSitemap: !!t.inSitemap,
    reasons,
    suggested_actions: actionsFor(t, authority),
  };
}

/**
 * Identifica as taxonomias / hubs com maior potencial de autoridade real.
 * Critério: muitos produtos + readiness alto + reviews + diversidade + links.
 */
export function buildTopAuthorityTargets(inputs: EditorialTargetInput[]): EditorialTarget[] {
  return inputs
    .map(evaluateEditorialTarget)
    .filter((t) => t.priority === "critical" || t.priority === "high")
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      const d = order[a.priority] - order[b.priority];
      if (d !== 0) return d;
      return b.authority - a.authority;
    });
}

/**
 * Detecta páginas que têm densidade boa de produtos mas estão com
 * editorial fraco — onde uma intervenção humana pequena gera ganho grande.
 */
export function buildWeakButPromisingTargets(inputs: EditorialTargetInput[]): EditorialTarget[] {
  return inputs
    .map(evaluateEditorialTarget)
    .filter((t) => {
      const goodCatalog = t.productsCount >= 6;
      const weakEditorial =
        t.editorialLength < 300 ||
        t.internalLinksCount < 3 ||
        t.reviewsCount < 2 ||
        t.topicalCoverage < 55;
      return goodCatalog && weakEditorial && !t.thinContentRisk;
    })
    .sort((a, b) => b.productsCount - a.productsCount);
}

// ----- Buckets para o Execution Center -----

export interface ExecutionBuckets {
  priorityMax: EditorialTarget[];   // critical
  highPotential: EditorialTarget[]; // weak-but-promising
  thinContent: EditorialTarget[];
  noFaq: EditorialTarget[];
  noEditorial: EditorialTarget[];
  fewReviews: EditorialTarget[];
  weakImages: EditorialTarget[];
  strongHubs: EditorialTarget[];
  premium: EditorialTarget[];
}

export function buildExecutionBuckets(inputs: EditorialTargetInput[]): ExecutionBuckets {
  const enriched = inputs.map((i) => ({ input: i, target: evaluateEditorialTarget(i) }));
  const all = enriched.map((e) => e.target);
  return {
    priorityMax: all.filter((t) => t.priority === "critical").sort((a, b) => b.authority - a.authority),
    highPotential: buildWeakButPromisingTargets(inputs).slice(0, 30),
    thinContent: all.filter((t) => t.thinContentRisk).sort((a, b) => a.authority - b.authority),
    noFaq: enriched.filter((e) => !e.input.hasFaq).map((e) => e.target),
    noEditorial: enriched.filter((e) => (e.input.editorialLength ?? 0) < 300).map((e) => e.target),
    fewReviews: all.filter((t) => t.reviewsCount < 3).sort((a, b) => b.productsCount - a.productsCount),
    weakImages: enriched
      .filter((e) => e.input.signals.visualDiversity < 0.4 || e.input.signals.goodImagesCount < 4)
      .map((e) => e.target),
    strongHubs: all.filter((t) => t.authority >= 80 && t.type === "theme"),
    premium: all.filter((t) => t.authority >= 85 && t.productsCount >= 12 && !t.thinContentRisk),
  };
}

// ----- Checklist progress -----

export interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
  impact: "high" | "medium" | "low";
}

export function buildChecklistFromTarget(t: EditorialTarget): ChecklistItem[] {
  return [
    { key: "editorial", label: "Adicionar descrição longa (300+ palavras)", done: t.editorialLength >= 300, impact: "high" },
    { key: "faq", label: "Adicionar FAQ contextual", done: !t.suggested_actions.some((a) => a.includes("FAQ")), impact: "high" },
    { key: "hero", label: "Melhorar hero image", done: !t.suggested_actions.some((a) => a.includes("hero")), impact: "medium" },
    { key: "reviews", label: "Adicionar avaliações reais", done: t.reviewsCount >= 3, impact: "high" },
    { key: "visual", label: "Diversificar imagens dos produtos", done: !t.suggested_actions.some((a) => a.includes("Diversificar")), impact: "medium" },
    { key: "links", label: "Adicionar links internos humanos", done: t.internalLinksCount >= 4, impact: "high" },
    { key: "blog", label: "Conectar a um post de blog", done: !t.suggested_actions.some((a) => a.includes("blog")), impact: "medium" },
    { key: "related", label: "Adicionar produtos relacionados", done: t.productsCount >= 8, impact: "medium" },
    { key: "meta", label: "Revisar meta title e description", done: !t.suggested_actions.some((a) => a.includes("meta")), impact: "low" },
  ];
}

export function checklistProgress(items: ChecklistItem[]): { done: number; total: number; pct: number } {
  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}
