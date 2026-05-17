/**
 * Fase 14.7 — Civilization Resilience.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type CivilizationScenario = "eternal" | "dominant" | "resilient" | "fragile" | "collapsing";

export function calculateRecoveryPersistence(t: TelemetrySnapshot): number {
  return clamp(
    (t.recovery_capacity_score ?? 0) * 0.4 +
    (t.recovery_continuity_score ?? 0) * 0.3 +
    (t.recovery_intelligence_score ?? 0) * 0.3,
  );
}

export function calculateAdaptiveEvolution(t: TelemetrySnapshot): number {
  return clamp(
    (t.adaptive_capacity_score ?? 0) * 0.4 +
    (t.adaptability_continuity_score ?? 0) * 0.3 +
    (t.adaptive_recovery_score ?? 0) * 0.3,
  );
}

export function calculateExistentialDurability(t: TelemetrySnapshot): number {
  return clamp(
    (t.existential_stability_score ?? 0) * 0.4 +
    (100 - (t.existential_exposure_score ?? 0)) * 0.3 +
    (t.long_horizon_survivability_score ?? 0) * 0.3,
  );
}

export function calculateCivilizationResilience(t: TelemetrySnapshot): number {
  return clamp(
    calculateRecoveryPersistence(t) * 0.3 +
    calculateAdaptiveEvolution(t) * 0.3 +
    calculateExistentialDurability(t) * 0.4,
  );
}

export function estimateCompoundingDurability(t: TelemetrySnapshot): number {
  return clamp(
    (t.compounding_health_score ?? 0) * 0.5 +
    (t.long_term_sustainability_score ?? 0) * 0.5,
  );
}

export function estimateLongTermSurvival(t: TelemetrySnapshot): number {
  return clamp(
    calculateCivilizationResilience(t) * 0.5 +
    estimateCompoundingDurability(t) * 0.3 +
    (t.survival_confidence_score ?? 0) * 0.2,
  );
}

export function estimateFutureCivilizationState(t: TelemetrySnapshot): CivilizationScenario {
  const score = estimateLongTermSurvival(t);
  if (score >= 88) return "eternal";
  if (score >= 75) return "dominant";
  if (score >= 60) return "resilient";
  if (score >= 45) return "fragile";
  return "collapsing";
}

export interface ResilienceReport {
  scenario: CivilizationScenario;
  resilience: number;
  recovery: number;
  evolution: number;
  durability: number;
  compounding: number;
  survival: number;
}

export function buildResilienceReport(t: TelemetrySnapshot): ResilienceReport {
  return {
    scenario: estimateFutureCivilizationState(t),
    resilience: calculateCivilizationResilience(t),
    recovery: calculateRecoveryPersistence(t),
    evolution: calculateAdaptiveEvolution(t),
    durability: calculateExistentialDurability(t),
    compounding: estimateCompoundingDurability(t),
    survival: estimateLongTermSurvival(t),
  };
}
