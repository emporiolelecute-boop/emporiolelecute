/**
 * Fase 14 — Strategic Investment Simulator.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export interface InvestmentSimulation {
  name: string;
  expectedImpact: number;     // 0..100
  estimatedEffort: number;    // 0..100
  sustainabilityDelta: number; // -100..100
  riskDelta: number;          // -100..100
  timelineWeeks: number;
  confidence: number;         // 0..100
  notes: string[];
}

const v = (x?: number) => (typeof x === "number" ? x : 0);
const clamp = (n: number, min = -100, max = 100) => Math.max(min, Math.min(max, n));

export function simulateEditorialInvestment(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  const gap = 100 - v(t.editorial_maturity_avg);
  return {
    name: "Investimento Editorial",
    expectedImpact: clamp(gap * 0.5 * intensity, 0, 100),
    estimatedEffort: clamp(40 * intensity, 0, 100),
    sustainabilityDelta: clamp(15 * intensity),
    riskDelta: clamp(-10 * intensity),
    timelineWeeks: Math.round(8 * intensity),
    confidence: 70,
    notes: ["Aprofunda maturidade editorial", "Reduz risco de thin content"],
  };
}

export function simulateAuthorityInvestment(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  const dependency = v(t.authority_dependency_risk);
  return {
    name: "Investimento em Autoridade",
    expectedImpact: clamp((100 - v(t.averageAuthority)) * 0.4 * intensity, 0, 100),
    estimatedEffort: clamp(55 * intensity, 0, 100),
    sustainabilityDelta: clamp(20 * intensity),
    riskDelta: clamp(-dependency * 0.2 * intensity),
    timelineWeeks: Math.round(12 * intensity),
    confidence: 65,
    notes: ["Distribui autoridade", "Reduz dependência de hubs"],
  };
}

export function simulateTaxonomyExpansion(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  return {
    name: "Expansão de Taxonomia",
    expectedImpact: clamp(25 * intensity, 0, 100),
    estimatedEffort: clamp(35 * intensity, 0, 100),
    sustainabilityDelta: clamp(10 * intensity),
    riskDelta: clamp(5 * intensity),
    timelineWeeks: Math.round(6 * intensity),
    confidence: 60,
    notes: ["Amplia cobertura semântica", "Pode aumentar risco de canibalização"],
  };
}

export function simulateInternalLinkOptimization(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  const connectivityGap = 100 - v(t.semantic_connectivity_score);
  return {
    name: "Otimização de Linking Interno",
    expectedImpact: clamp(connectivityGap * 0.6 * intensity, 0, 100),
    estimatedEffort: clamp(25 * intensity, 0, 100),
    sustainabilityDelta: clamp(12 * intensity),
    riskDelta: clamp(-8 * intensity),
    timelineWeeks: Math.round(4 * intensity),
    confidence: 80,
    notes: ["Aumenta authority flow", "Reduz entidades órfãs"],
  };
}

export function simulateReviewGrowth(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  const gap = 100 - v(t.review_coverage);
  return {
    name: "Crescimento de Reviews",
    expectedImpact: clamp(gap * 0.3 * intensity, 0, 100),
    estimatedEffort: clamp(30 * intensity, 0, 100),
    sustainabilityDelta: clamp(10 * intensity),
    riskDelta: clamp(-5 * intensity),
    timelineWeeks: Math.round(10 * intensity),
    confidence: 60,
    notes: ["Reforça sinais de confiança", "Melhora rich snippets"],
  };
}

export function simulateFaqExpansion(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  const gap = 100 - v(t.faq_coverage);
  return {
    name: "Expansão de FAQs",
    expectedImpact: clamp(gap * 0.35 * intensity, 0, 100),
    estimatedEffort: clamp(20 * intensity, 0, 100),
    sustainabilityDelta: clamp(8 * intensity),
    riskDelta: clamp(-3 * intensity),
    timelineWeeks: Math.round(5 * intensity),
    confidence: 75,
    notes: ["Captura long-tail", "Reforça topical authority"],
  };
}

export function simulateHubConsolidation(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation {
  return {
    name: "Consolidação de Hubs",
    expectedImpact: clamp((100 - v(t.semantic_balance_score)) * 0.4 * intensity, 0, 100),
    estimatedEffort: clamp(45 * intensity, 0, 100),
    sustainabilityDelta: clamp(18 * intensity),
    riskDelta: clamp(-12 * intensity),
    timelineWeeks: Math.round(8 * intensity),
    confidence: 70,
    notes: ["Reforça hubs temáticos", "Reduz fragmentação"],
  };
}

export function runAllInvestments(t: TelemetrySnapshot, intensity = 1): InvestmentSimulation[] {
  return [
    simulateEditorialInvestment(t, intensity),
    simulateAuthorityInvestment(t, intensity),
    simulateTaxonomyExpansion(t, intensity),
    simulateInternalLinkOptimization(t, intensity),
    simulateReviewGrowth(t, intensity),
    simulateFaqExpansion(t, intensity),
    simulateHubConsolidation(t, intensity),
  ];
}
