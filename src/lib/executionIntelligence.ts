/**
 * Fase 13.3 — Execution Intelligence (drift, foco, dispersão).
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

const v = (x?: number) => (typeof x === "number" ? x : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export interface ExecutionMap {
  priorityDrift: number;
  dispersion: number;
  focusEfficiency: number;
  momentum: number;
  stability: number;
  diagnostics: string[];
}

export function detectPriorityDrift(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    (100 - v(t.strategic_consistency_score)) * 0.5 +
    v(t.volatility_score) * 0.3 +
    v(t.regression_risk_score) * 0.2
  ));
}

export function detectExecutionDispersion(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.fragile_cluster_count) * 6 +
    v(t.semantic_loop_count) * 4 +
    (100 - v(t.semantic_balance_score)) * 0.3
  ));
}

export function calculateFocusEfficiency(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.strategic_consistency_score) * 0.5 +
    (100 - detectExecutionDispersion(t)) * 0.3 +
    v(t.execution_efficiency) * 0.2
  ));
}

export function calculateExecutionMomentum(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.momentum_growth_score) * 0.5 +
    v(t.cluster_growth_score) * 0.3 +
    v(t.authority_growth_projection) * 0.2
  ));
}

export function estimateExecutionStability(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.semantic_stability_score) * 0.4 +
    v(t.strategic_consistency_score) * 0.4 +
    (100 - v(t.volatility_score)) * 0.2
  ));
}

export function buildExecutionMap(t: TelemetrySnapshot): ExecutionMap {
  const drift = detectPriorityDrift(t);
  const dispersion = detectExecutionDispersion(t);
  const focus = calculateFocusEfficiency(t);
  const momentum = calculateExecutionMomentum(t);
  const stability = estimateExecutionStability(t);

  const diagnostics: string[] = [];
  if (drift > 55) diagnostics.push("Drift estratégico detectado");
  if (dispersion > 55) diagnostics.push("Execução pulverizada em muitas frentes");
  if (focus < 50) diagnostics.push("Baixa concentração de foco");
  if (momentum < 40) diagnostics.push("Pouco momentum operacional");
  if (stability < 45) diagnostics.push("Estabilidade comprometida");

  return { priorityDrift: drift, dispersion, focusEfficiency: focus, momentum, stability, diagnostics };
}
