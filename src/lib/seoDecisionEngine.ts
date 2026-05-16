/**
 * Fase 13 — SEO Decision Engine.
 *
 * Cruza authority, maturity, readiness, coverage, links, reviews,
 * gaps, decay, regressões e business intent para retornar uma
 * decisão acionável por entidade. Apenas analítico — não muda nada.
 */

import { calculateBusinessIntent, type BusinessIntentInput } from "./businessIntent";

export interface DecisionInput {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;

  authority?: number;
  maturity?: number;
  readiness?: number;
  coverage?: number;
  reviews?: number;
  links?: number;
  faqs?: number;
  editorialSize?: number;

  decayScore?: number;          // 0..100 (maior = pior)
  regressionRisk?: number;      // 0..100
  orphanRisk?: boolean;
  thinContent?: boolean;
  cannibalization?: "none" | "low" | "medium" | "high" | "unknown";

  // business intent signals
  productCount?: number;
  ctaStrength?: number;
  hasKits?: boolean;
  isHub?: boolean;
  isSegment?: boolean;
  isBlog?: boolean;
}

export interface DecisionResult {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  opportunityScore: number;
  estimatedROI: number;
  authorityGainPotential: number;
  semanticExpansionPotential: number;
  executionEffort: number;
  estimatedTimeToImpact: 30 | 60 | 90 | 180;
  confidence: number;
  risks: string[];
  recommendations: string[];
  intent: ReturnType<typeof calculateBusinessIntent>;
}

function clamp(v: number, min = 0, max = 100) { return Math.max(min, Math.min(max, Math.round(v))); }

export function calculateAuthorityROI(i: DecisionInput): number {
  const gap = 100 - (i.authority ?? 0);
  const supportPenalty = (i.links ?? 0) >= 4 ? 0 : 10;
  return clamp(gap * 0.6 + supportPenalty);
}

export function calculateSemanticROI(i: DecisionInput): number {
  const gap = 100 - (i.coverage ?? 0);
  const editorialBoost = (i.editorialSize ?? 0) < 600 ? 15 : 0;
  return clamp(gap * 0.55 + editorialBoost);
}

export function calculateExecutionROI(i: DecisionInput): number {
  const auth = calculateAuthorityROI(i);
  const sem  = calculateSemanticROI(i);
  const reviewROI = (i.entityType === "product" && (i.reviews ?? 0) < 3) ? 15 : 0;
  const faqROI    = (i.faqs ?? 0) < 3 ? 12 : 0;
  return clamp(auth * 0.45 + sem * 0.35 + reviewROI + faqROI);
}

export function estimateExecutionEffort(i: DecisionInput): number {
  let effort = 25;
  if ((i.editorialSize ?? 0) < 400) effort += 20;
  if ((i.faqs ?? 0) < 3) effort += 8;
  if ((i.links ?? 0) < 3) effort += 8;
  if (i.thinContent) effort += 15;
  if ((i.coverage ?? 0) < 40) effort += 12;
  return clamp(effort);
}

export function predictImpactWindow(i: DecisionInput): 30 | 60 | 90 | 180 {
  if ((i.authority ?? 0) >= 70 && (i.readiness ?? 0) >= 70) return 30;
  if ((i.authority ?? 0) >= 50) return 60;
  if ((i.authority ?? 0) >= 30) return 90;
  return 180;
}

export function calculateOpportunityScore(i: DecisionInput): number {
  const roi = calculateExecutionROI(i);
  const effort = estimateExecutionEffort(i);
  const intentBoost = (i.productCount ?? 0) >= 6 ? 10 : 0;
  const decayBoost  = (i.decayScore ?? 0) >= 50 ? 8 : 0;
  return clamp(roi - effort * 0.3 + intentBoost + decayBoost + 30);
}

function buildRisks(i: DecisionInput): string[] {
  const r: string[] = [];
  if (i.orphanRisk) r.push("orphan_risk");
  if (i.thinContent) r.push("thin_content");
  if ((i.decayScore ?? 0) >= 50) r.push("content_decay");
  if ((i.regressionRisk ?? 0) >= 50) r.push("regression_risk");
  if (i.cannibalization === "high") r.push("cannibalization_high");
  if ((i.links ?? 0) <= 1) r.push("low_link_support");
  return r;
}

function buildRecommendations(i: DecisionInput): string[] {
  const recs: string[] = [];
  if ((i.editorialSize ?? 0) < 600) recs.push("Expandir editorial para 600+ caracteres.");
  if ((i.faqs ?? 0) < 3) recs.push("Adicionar 3+ FAQs alinhados à intenção de busca.");
  if ((i.links ?? 0) < 3) recs.push("Conectar a 3+ páginas semanticamente próximas.");
  if (i.entityType === "product" && (i.reviews ?? 0) < 3) recs.push("Solicitar mais reviews verificados.");
  if ((i.coverage ?? 0) < 50) recs.push("Cobrir subtemas faltantes do cluster.");
  if (i.orphanRisk) recs.push("Re-incluir em hubs/menus relevantes.");
  if (!recs.length) recs.push("Manter monitoramento — entidade em bom estado.");
  return recs;
}

export function decideEntity(i: DecisionInput): DecisionResult {
  const intentInput: BusinessIntentInput = {
    entityType: i.entityType, entityId: i.entityId, entitySlug: i.entitySlug,
    productCount: i.productCount, reviewsCount: i.reviews, editorialSize: i.editorialSize,
    ctaStrength: i.ctaStrength, hasKits: i.hasKits, authorityScore: i.authority,
    isHub: i.isHub, isSegment: i.isSegment, isBlog: i.isBlog,
  };
  const intent = calculateBusinessIntent(intentInput);

  return {
    entityType: i.entityType,
    entityId: i.entityId,
    entitySlug: i.entitySlug,
    entityName: i.entityName,
    opportunityScore: calculateOpportunityScore(i),
    estimatedROI: calculateExecutionROI(i),
    authorityGainPotential: calculateAuthorityROI(i),
    semanticExpansionPotential: calculateSemanticROI(i),
    executionEffort: estimateExecutionEffort(i),
    estimatedTimeToImpact: predictImpactWindow(i),
    confidence: clamp(40 + (i.authority ?? 0) * 0.3 + (intent.commercialPriority * 0.2)),
    risks: buildRisks(i),
    recommendations: buildRecommendations(i),
    intent,
  };
}

export function buildDecisionEngine(items: DecisionInput[]): DecisionResult[] {
  return items.map(decideEntity).sort((a, b) => b.opportunityScore - a.opportunityScore);
}

// ============= SEO Strategy Score =============

export interface StrategyScoreInput {
  authorityAvg: number;
  businessIntentAvg: number;
  semanticROIAvg: number;
  maturityAvg: number;
  decayScore: number;
  regressionRisk: number;
  orphanRecoveryRate: number;
  internalLinkQuality: number;
  editorialQualityAvg: number;
}

export interface StrategyScoreResult {
  score: number;
  band: "dominant" | "strong" | "competitive" | "fragile" | "critical";
  breakdown: Record<string, number>;
}

export function calculateSeoStrategyScore(i: StrategyScoreInput): StrategyScoreResult {
  const positive =
    i.authorityAvg * 0.18 +
    i.businessIntentAvg * 0.14 +
    i.semanticROIAvg * 0.12 +
    i.maturityAvg * 0.14 +
    i.orphanRecoveryRate * 0.08 +
    i.internalLinkQuality * 0.12 +
    i.editorialQualityAvg * 0.12;
  const penalty = (i.decayScore * 0.05) + (i.regressionRisk * 0.05);
  const raw = Math.max(0, Math.min(100, Math.round(positive - penalty)));

  let band: StrategyScoreResult["band"] = "critical";
  if (raw >= 85) band = "dominant";
  else if (raw >= 70) band = "strong";
  else if (raw >= 50) band = "competitive";
  else if (raw >= 30) band = "fragile";

  return {
    score: raw, band,
    breakdown: {
      authority: i.authorityAvg, businessIntent: i.businessIntentAvg,
      semanticROI: i.semanticROIAvg, maturity: i.maturityAvg,
      decay: i.decayScore, regression: i.regressionRisk,
      orphanRecovery: i.orphanRecoveryRate, internalLink: i.internalLinkQuality,
      editorial: i.editorialQualityAvg,
    },
  };
}
