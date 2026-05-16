/**
 * Fase 14.1 — Future Forecast Engine.
 *
 * Pure forecasting helpers. No persistence, no public side effects.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type ForecastHorizon = "30d" | "90d" | "180d" | "365d" | "730d";

const HORIZON_WEEKS: Record<ForecastHorizon, number> = {
  "30d": 4,
  "90d": 13,
  "180d": 26,
  "365d": 52,
  "730d": 104,
};

const clamp = (v: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(v)));

function projectByVelocity(base: number, velocityPct: number, weeks: number, decayPct = 0): number {
  const growth = (velocityPct / 100) * 0.04 * weeks;
  const decay = (decayPct / 100) * 0.025 * weeks;
  return clamp(base * (1 + growth - decay));
}

export interface HorizonPoint {
  horizon: ForecastHorizon;
  weeks: number;
  value: number;
}

function buildSeries(
  base: number,
  velocityPct: number,
  decayPct = 0,
): HorizonPoint[] {
  return (Object.keys(HORIZON_WEEKS) as ForecastHorizon[]).map((h) => ({
    horizon: h,
    weeks: HORIZON_WEEKS[h],
    value: projectByVelocity(base, velocityPct, HORIZON_WEEKS[h], decayPct),
  }));
}

export function forecastSemanticGrowth(t: TelemetrySnapshot): HorizonPoint[] {
  return buildSeries(
    t.semantic_coverage_avg || 0,
    t.semantic_velocity_score || 0,
    (t.content_decay_score || 0) / 2,
  );
}

export function forecastAuthorityDecay(t: TelemetrySnapshot): HorizonPoint[] {
  const base = t.averageAuthority || 0;
  const decay = t.content_decay_score || 0;
  return (Object.keys(HORIZON_WEEKS) as ForecastHorizon[]).map((h) => {
    const w = HORIZON_WEEKS[h];
    const loss = (decay / 100) * 0.03 * w;
    return { horizon: h, weeks: w, value: clamp(base * (1 - loss)) };
  });
}

export function forecastClusterMaturity(t: TelemetrySnapshot): HorizonPoint[] {
  return buildSeries(
    t.cluster_growth_score || 0,
    t.semantic_velocity_score || 0,
  );
}

export function forecastExecutionPressure(t: TelemetrySnapshot): HorizonPoint[] {
  return buildSeries(
    t.operational_debt_score || 0,
    t.maintenance_pressure_score || 0,
  );
}

export function forecastCommercialIntentGrowth(t: TelemetrySnapshot): HorizonPoint[] {
  return buildSeries(
    t.business_intent_score || 0,
    t.momentum_growth_score || 0,
  );
}

export function forecastSemanticResilience(t: TelemetrySnapshot): HorizonPoint[] {
  return buildSeries(
    t.resilience_score || 0,
    t.recovery_capacity_score || 0,
    t.cascade_failure_risk || 0,
  );
}

export interface ForecastConfidence {
  score: number;
  reliability: "low" | "medium" | "high" | "very_high";
  drivers: string[];
}

export function buildForecastConfidence(t: TelemetrySnapshot): ForecastConfidence {
  const stability = t.semantic_stability_score || 0;
  const consistency = t.strategic_consistency_score || 0;
  const volatility = t.volatility_score || 0;
  const maturity = t.editorial_maturity_avg || 0;
  const score = clamp(
    (stability * 0.3) +
    (consistency * 0.3) +
    ((100 - volatility) * 0.2) +
    (maturity * 0.2),
  );
  let reliability: ForecastConfidence["reliability"] = "low";
  if (score >= 80) reliability = "very_high";
  else if (score >= 65) reliability = "high";
  else if (score >= 45) reliability = "medium";
  const drivers: string[] = [];
  if (stability >= 60) drivers.push("Estabilidade semântica");
  if (consistency >= 60) drivers.push("Consistência estratégica");
  if (volatility >= 60) drivers.push("Alta volatilidade penalizando");
  if (maturity >= 60) drivers.push("Maturidade editorial");
  return { score, reliability, drivers };
}
