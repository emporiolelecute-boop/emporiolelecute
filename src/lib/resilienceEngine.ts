/**
 * Fase 13.3 — Resilience Engine.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type ResilienceClass = "resilient" | "stable" | "fragile" | "collapsing";

export interface ResilienceReport {
  systemResilience: number;
  clusterResilience: number;
  recoveryElasticity: number;
  cascadeFailureRisk: number;
  recoveryWindowWeeks: number;
  classification: ResilienceClass;
  fragileDependencies: string[];
}

const v = (x?: number) => (typeof x === "number" ? x : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function calculateSystemResilience(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.semantic_stability_score) * 0.3 +
    v(t.authority_distribution_score) * 0.3 +
    v(t.strategic_consistency_score) * 0.2 +
    (100 - v(t.volatility_score)) * 0.2
  ));
}

export function calculateClusterResilience(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    (100 - v(t.fragile_cluster_count) * 8) * 0.5 +
    v(t.semantic_balance_score) * 0.3 +
    v(t.cluster_growth_score) * 0.2
  ));
}

export function calculateRecoveryElasticity(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    (100 - v(t.recovery_difficulty_avg)) * 0.5 +
    v(t.orphan_recovery_rate) * 0.3 +
    v(t.cluster_growth_score) * 0.2
  ));
}

export function detectFragileDependencies(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if (v(t.authority_dependency_risk) > 60) out.push("Autoridade concentrada em poucas entidades");
  if (v(t.overcentralization_risk) > 60) out.push("Hubs sobrecarregados");
  if (v(t.fragile_cluster_count) > 0) out.push(`${t.fragile_cluster_count} clusters frágeis`);
  if (v(t.semantic_loop_count) > 0) out.push(`${t.semantic_loop_count} loops semânticos`);
  return out;
}

export function detectCascadeFailureRisk(t: TelemetrySnapshot): number {
  return clamp(Math.round(
    v(t.authority_dependency_risk) * 0.4 +
    v(t.fragile_cluster_count) * 5 +
    v(t.regression_risk_score) * 0.3 +
    v(t.volatility_score) * 0.2
  ));
}

export function estimateRecoveryWindow(t: TelemetrySnapshot): number {
  const base = 2;
  const penalty = v(t.recovery_difficulty_avg) * 0.1 + v(t.fragile_cluster_count) * 0.5 + v(t.content_decay_score) * 0.05;
  return Math.max(1, Math.round(base + penalty));
}

export function buildResilienceReport(t: TelemetrySnapshot): ResilienceReport {
  const sys = calculateSystemResilience(t);
  const cluster = calculateClusterResilience(t);
  const elasticity = calculateRecoveryElasticity(t);
  const cascade = detectCascadeFailureRisk(t);
  let cls: ResilienceClass = "stable";
  if (sys >= 80 && cascade < 30) cls = "resilient";
  else if (sys >= 60) cls = "stable";
  else if (sys >= 35) cls = "fragile";
  else cls = "collapsing";

  return {
    systemResilience: sys,
    clusterResilience: cluster,
    recoveryElasticity: elasticity,
    cascadeFailureRisk: cascade,
    recoveryWindowWeeks: estimateRecoveryWindow(t),
    classification: cls,
    fragileDependencies: detectFragileDependencies(t),
  };
}
