/**
 * Fase 14 — Future Forecast.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type Horizon = 30 | 90 | 180 | 365;

export interface ForecastPoint {
  horizonDays: Horizon;
  projectedAuthority: number;
  projectedCoverage: number;
  projectedResilience: number;
  projectedROI: number;
  projectedDecayRisk: number;
  confidence: number;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const v = (x?: number) => (typeof x === "number" ? x : 0);

function projectMetric(base: number, growthPerYear: number, days: number): number {
  const yearFraction = days / 365;
  return clamp(base * (1 + growthPerYear * yearFraction));
}

export function forecastSystemEvolution(t: TelemetrySnapshot): ForecastPoint[] {
  const horizons: Horizon[] = [30, 90, 180, 365];
  const momentum = v(t.momentum_growth_score) / 100;
  return horizons.map((h) => ({
    horizonDays: h,
    projectedAuthority: projectMetric(v(t.averageAuthority), 0.15 + momentum * 0.3, h),
    projectedCoverage: projectMetric(v(t.semantic_coverage_avg), 0.1 + momentum * 0.2, h),
    projectedResilience: projectMetric(v(t.resilience_score), 0.05 + momentum * 0.1, h),
    projectedROI: projectMetric(v(t.semantic_roi_avg), 0.2 + momentum * 0.4, h),
    projectedDecayRisk: clamp(v(t.content_decay_score) * (1 + 0.05 * (h / 90))),
    confidence: clamp(80 - h / 10),
  }));
}

export function forecastAuthorityCompounding(t: TelemetrySnapshot, days = 365): number {
  const base = v(t.averageAuthority);
  const compounding = v(t.authority_growth_projection) / 100;
  return clamp(base * Math.pow(1 + compounding * (days / 365), 1));
}

export function forecastClusterMaturity(t: TelemetrySnapshot, days = 180): number {
  return clamp(v(t.cluster_growth_score) + (days / 365) * 30);
}

export function forecastSemanticExpansion(t: TelemetrySnapshot, days = 180): number {
  return clamp(v(t.semantic_coverage_avg) + (days / 365) * 20);
}

export function forecastExecutionFatigue(t: TelemetrySnapshot, days = 90): number {
  const base = v(t.strategic_fatigue_score);
  return clamp(base + (days / 365) * v(t.maintenance_pressure_score) * 0.3);
}

export function forecastRecoveryCapacity(t: TelemetrySnapshot, days = 90): number {
  return clamp(v(t.recovery_capacity_score) - (days / 365) * v(t.strategic_fatigue_score) * 0.2);
}

export function buildFutureScenarios(t: TelemetrySnapshot): {
  optimistic: ForecastPoint[];
  realistic: ForecastPoint[];
  pessimistic: ForecastPoint[];
} {
  const base = forecastSystemEvolution(t);
  const scale = (pts: ForecastPoint[], k: number) => pts.map((p) => ({
    ...p,
    projectedAuthority: clamp(p.projectedAuthority * k),
    projectedCoverage: clamp(p.projectedCoverage * k),
    projectedROI: clamp(p.projectedROI * k),
  }));
  return {
    optimistic: scale(base, 1.2),
    realistic: base,
    pessimistic: scale(base, 0.8),
  };
}
