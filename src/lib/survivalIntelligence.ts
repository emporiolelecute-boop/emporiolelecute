/**
 * Fase 14.5 — Survival Intelligence.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type SurvivalScenario = "dominant" | "resilient" | "unstable" | "degrading" | "collapsing";

export function estimateOperationalSurvival(t: TelemetrySnapshot): number {
  return clamp(
    (t.resilience_score ?? 0) * 0.3 +
    (t.recovery_capacity_score ?? 0) * 0.25 +
    (t.sustainability_score ?? 0) * 0.25 +
    (100 - (t.collapse_risk_score ?? 0)) * 0.2,
  );
}

export function estimateCollapseProbability(t: TelemetrySnapshot): number {
  return clamp(
    (t.collapse_risk_score ?? 0) * 0.4 +
    (t.collapse_probability_score ?? 0) * 0.3 +
    (t.cascade_failure_risk ?? 0) * 0.15 +
    (t.cascade_collapse_risk ?? 0) * 0.15,
  );
}

export function estimateStrategicLongevity(t: TelemetrySnapshot): number {
  return clamp(
    (t.long_term_sustainability_score ?? 0) * 0.35 +
    (t.sustainability_forecast ?? 0) * 0.25 +
    (t.authority_compounding_score ?? 0) * 0.2 +
    (t.cluster_longevity_score ?? 0) * 0.2,
  );
}

export interface RecoveryWindow { horizonDays: number; viability: number; }

export function estimateRecoveryWindows(t: TelemetrySnapshot): RecoveryWindow[] {
  const base = (t.recovery_capacity_score ?? 0) * 0.6 + (t.adaptive_recovery_score ?? 0) * 0.4;
  const pressure = (t.maintenance_pressure_score ?? 0) * 0.5 + (t.operational_debt_score ?? 0) * 0.5;
  const decay = Math.max(0, (pressure - 40) / 20);
  return [30, 90, 180, 365].map((d) => ({
    horizonDays: d,
    viability: clamp(base - decay * (d / 30)),
  }));
}

export function estimateResilienceAgainstEntropy(t: TelemetrySnapshot): number {
  return clamp(
    (t.resilience_score ?? 0) * 0.4 +
    (100 - (t.semantic_entropy_score ?? 0)) * 0.3 +
    (100 - (t.systemic_entropy_score ?? 0)) * 0.3,
  );
}

export function estimateFutureAdaptation(t: TelemetrySnapshot): number {
  return clamp(
    (t.adaptive_capacity_score ?? 0) * 0.4 +
    (t.strategic_elasticity_score ?? 0) * 0.3 +
    (t.evolution_velocity_score ?? 0) * 0.3,
  );
}

export function estimateSurvivalConfidence(t: TelemetrySnapshot): number {
  return clamp(
    estimateOperationalSurvival(t) * 0.35 +
    estimateStrategicLongevity(t) * 0.25 +
    estimateResilienceAgainstEntropy(t) * 0.2 +
    estimateFutureAdaptation(t) * 0.1 +
    (100 - estimateCollapseProbability(t)) * 0.1,
  );
}

export interface SurvivalReport {
  scenario: SurvivalScenario;
  operationalSurvival: number;
  collapseProbability: number;
  strategicLongevity: number;
  resilienceAgainstEntropy: number;
  futureAdaptation: number;
  survivalConfidence: number;
  recoveryWindows: RecoveryWindow[];
}

export function buildSurvivalReport(t: TelemetrySnapshot): SurvivalReport {
  const operationalSurvival = estimateOperationalSurvival(t);
  const collapseProbability = estimateCollapseProbability(t);
  const strategicLongevity = estimateStrategicLongevity(t);
  const resilienceAgainstEntropy = estimateResilienceAgainstEntropy(t);
  const futureAdaptation = estimateFutureAdaptation(t);
  const survivalConfidence = estimateSurvivalConfidence(t);
  const recoveryWindows = estimateRecoveryWindows(t);

  let scenario: SurvivalScenario = "resilient";
  if (collapseProbability >= 65) scenario = "collapsing";
  else if (collapseProbability >= 45) scenario = "degrading";
  else if (survivalConfidence < 50) scenario = "unstable";
  else if (survivalConfidence >= 80 && strategicLongevity >= 70) scenario = "dominant";
  else scenario = "resilient";

  return {
    scenario, operationalSurvival, collapseProbability, strategicLongevity,
    resilienceAgainstEntropy, futureAdaptation, survivalConfidence, recoveryWindows,
  };
}
