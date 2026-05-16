/**
 * Fase 13.2 — Capacity Planner (estimadores heurísticos).
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type CapacityScenario = "lean" | "standard" | "aggressive" | "enterprise";

export interface CapacityEstimate {
  scenario: CapacityScenario;
  weeklyHours: number;
  expectedEntitiesPerMonth: number;
  expectedAuthorityGain: number;
  expectedROI: number;
}

const v = (x?: number) => (typeof x === "number" ? x : 0);

export function estimateEditorialLoad(t: TelemetrySnapshot): number {
  return Math.round(v(t.thinContent) * 0.6 + v(t.content_gap_count) * 0.5 + (v(t.editorial_backlog as number) || 0) * 0.4);
}

export function estimateRecoveryLoad(t: TelemetrySnapshot): number {
  return Math.round(v(t.orphan_entities) * 0.4 + v(t.fragile_cluster_count) * 2 + v(t.regression_risk_score) * 0.2);
}

export function estimateMaintenanceLoad(t: TelemetrySnapshot): number {
  return Math.round(v(t.content_decay_score) * 0.3 + v(t.overlinked_pages) * 0.2 + v(t.total) * 0.05);
}

export function estimateExecutionHours(t: TelemetrySnapshot): number {
  return estimateEditorialLoad(t) + estimateRecoveryLoad(t) + estimateMaintenanceLoad(t);
}

export function estimateSeoROI(t: TelemetrySnapshot): number {
  return Math.max(0, Math.round(v(t.semantic_roi_avg) * 0.6 + v(t.quick_win_score) * 0.4));
}

const factors: Record<CapacityScenario, number> = { lean: 0.4, standard: 1, aggressive: 1.8, enterprise: 3 };

export function buildCapacityScenarios(t: TelemetrySnapshot): CapacityEstimate[] {
  const baseHours = estimateExecutionHours(t);
  const roi = estimateSeoROI(t);
  return (Object.keys(factors) as CapacityScenario[]).map((scenario) => {
    const f = factors[scenario];
    return {
      scenario,
      weeklyHours: Math.round(baseHours * f * 0.25),
      expectedEntitiesPerMonth: Math.round(8 * f),
      expectedAuthorityGain: Math.round(roi * f * 0.3),
      expectedROI: Math.round(roi * f * 0.8),
    };
  });
}
