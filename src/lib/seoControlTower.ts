/**
 * Fase 13.3 — SEO Control Tower (leitura/diagnóstico sistêmico).
 * Heurísticas sobre TelemetrySnapshot. Safe Mode absoluto.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type ControlTowerVerdict =
  | "Autonomous" | "Optimized" | "Stable" | "Stressed" | "Degrading" | "Critical";

export interface ControlTowerReport {
  score: number;
  sustainability: number;
  verdict: ControlTowerVerdict;
  executiveSummary: string;
  executionEfficiency: number;
  semanticEfficiency: number;
  authorityEfficiency: number;
  strategicAlignment: number;
  executionNoise: number;
  operationalWaste: number;
  focusScore: number;
  blockers: string[];
  strengths: string[];
  inefficiencies: string[];
  priorities: string[];
  warnings: string[];
}

const v = (x?: number) => (typeof x === "number" && isFinite(x) ? x : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function calculateExecutionEfficiency(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.execution_efficiency) * 0.5 + v(t.quick_win_score) * 0.3 + v(t.execution_capacity_score) * 0.2));
}

export function calculateSemanticEfficiency(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.semantic_connectivity_score) * 0.4 + v(t.semantic_balance_score) * 0.3 + (100 - v(t.semantic_loop_count) * 2) * 0.3));
}

export function calculateAuthorityEfficiency(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.authority_flow_score) * 0.5 + v(t.authority_distribution_score) * 0.3 + (100 - v(t.authority_dependency_risk)) * 0.2));
}

export function calculateStrategicAlignment(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.strategic_consistency_score) * 0.5 + v(t.business_intent_score) * 0.3 + (100 - v(t.under_monetized_score)) * 0.2));
}

export function calculateExecutionNoise(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.overlinked_pages) * 1.5 + v(t.semantic_loop_count) * 2 + (100 - v(t.strategic_consistency_score)) * 0.3));
}

export function calculateOperationalWaste(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.overlinked_pages) * 2 + v(t.thinContent) * 1.2 + v(t.cannibalized) * 1.5 + (100 - v(t.semantic_roi_avg)) * 0.2));
}

export function calculateFocusScore(t: TelemetrySnapshot): number {
  return clamp(Math.round(100 - calculateExecutionNoise(t) * 0.5 - v(t.fragile_cluster_count) * 2));
}

export function calculateSustainabilityScore(t: TelemetrySnapshot): number {
  const positive =
    v(t.strategic_consistency_score) * 0.25 +
    v(t.semantic_balance_score) * 0.2 +
    v(t.authority_distribution_score) * 0.2 +
    v(t.editorial_maturity_avg) * 0.15 +
    v(t.cluster_growth_score) * 0.2;
  const negative =
    v(t.content_decay_score) * 0.2 +
    v(t.regression_risk_score) * 0.2 +
    v(t.volatility_score) * 0.15 +
    v(t.topic_exhaustion_score) * 0.15;
  return clamp(Math.round(positive - negative + 25));
}

export function calculateSystemHealth(t: TelemetrySnapshot): number {
  const exec = calculateExecutionEfficiency(t);
  const sem = calculateSemanticEfficiency(t);
  const auth = calculateAuthorityEfficiency(t);
  const align = calculateStrategicAlignment(t);
  const focus = calculateFocusScore(t);
  const waste = calculateOperationalWaste(t);
  const noise = calculateExecutionNoise(t);
  const positive = exec * 0.2 + sem * 0.2 + auth * 0.2 + align * 0.15 + focus * 0.15;
  const negative = waste * 0.15 + noise * 0.1;
  return clamp(Math.round(positive - negative + 20));
}

export function buildControlTowerVerdict(score: number, sustainability: number): ControlTowerVerdict {
  if (score >= 88 && sustainability >= 80) return "Autonomous";
  if (score >= 75) return "Optimized";
  if (score >= 60) return "Stable";
  if (score >= 45) return "Stressed";
  if (score >= 30) return "Degrading";
  return "Critical";
}

export function buildControlTowerReport(t: TelemetrySnapshot): ControlTowerReport {
  const executionEfficiency = calculateExecutionEfficiency(t);
  const semanticEfficiency = calculateSemanticEfficiency(t);
  const authorityEfficiency = calculateAuthorityEfficiency(t);
  const strategicAlignment = calculateStrategicAlignment(t);
  const executionNoise = calculateExecutionNoise(t);
  const operationalWaste = calculateOperationalWaste(t);
  const focusScore = calculateFocusScore(t);
  const sustainability = calculateSustainabilityScore(t);
  const score = calculateSystemHealth(t);
  const verdict = buildControlTowerVerdict(score, sustainability);

  const blockers: string[] = [];
  const strengths: string[] = [];
  const inefficiencies: string[] = [];
  const priorities: string[] = [];
  const warnings: string[] = [];

  if (operationalWaste > 60) blockers.push("Desperdício operacional alto");
  if (executionNoise > 55) blockers.push("Ruído de execução elevado");
  if (sustainability < 40) blockers.push("Sustentabilidade SEO baixa");

  if (executionEfficiency >= 70) strengths.push("Execução eficiente");
  if (semanticEfficiency >= 70) strengths.push("Semântica eficiente");
  if (authorityEfficiency >= 70) strengths.push("Autoridade bem distribuída");
  if (strategicAlignment >= 70) strengths.push("Alinhamento estratégico");

  if (operationalWaste > 40) inefficiencies.push("Overlinking + thin content geram desperdício");
  if (executionNoise > 40) inefficiencies.push("Execução pulverizada");
  if (focusScore < 50) inefficiencies.push("Baixo foco operacional");

  if (v(t.content_decay_score) > 50) priorities.push("Renovar conteúdo em decaimento");
  if (v(t.regression_risk_score) > 50) priorities.push("Mitigar risco de regressão");
  if (v(t.fragile_cluster_count) > 0) priorities.push("Estabilizar clusters frágeis");
  if (!priorities.length) priorities.push("Manter cadência e capturar snapshots");

  if (v(t.volatility_score) > 50) warnings.push("Volatilidade elevada");
  if (v(t.topic_exhaustion_score) > 50) warnings.push("Saturação temática");
  if (v(t.authority_dependency_risk) > 60) warnings.push("Concentração de autoridade");

  const executiveSummary =
    `Sistema ${verdict.toLowerCase()} · saúde ${score} · sustentabilidade ${sustainability}. ` +
    (blockers[0] ?? "Sem bloqueadores críticos.") + " " +
    (priorities[0] ?? "");

  return {
    score, sustainability, verdict, executiveSummary,
    executionEfficiency, semanticEfficiency, authorityEfficiency,
    strategicAlignment, executionNoise, operationalWaste, focusScore,
    blockers, strengths, inefficiencies, priorities, warnings,
  };
}
