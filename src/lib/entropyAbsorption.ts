/**
 * Fase 14.7 — Entropy Absorption.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type AbsorptionStatus = "resilient" | "resistant" | "pressured" | "unstable";

export function calculateSemanticResistance(t: TelemetrySnapshot): number {
  return clamp(
    (100 - (t.semantic_entropy_score ?? 0)) * 0.5 +
    (t.semantic_stability_score ?? 0) * 0.3 +
    (100 - (t.semantic_drift_score ?? 0)) * 0.2,
  );
}

export function calculateStrategicResistance(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_consistency_score ?? 0) * 0.4 +
    (100 - (t.strategic_fragmentation_score ?? 0)) * 0.3 +
    (100 - (t.contradiction_pressure_score ?? 0)) * 0.3,
  );
}

export function calculateOperationalResistance(t: TelemetrySnapshot): number {
  return clamp(
    (t.execution_efficiency ?? 0) * 0.4 +
    (100 - (t.operational_noise_score ?? 0)) * 0.3 +
    (100 - (t.bottleneck_score ?? 0)) * 0.3,
  );
}

export function calculateEntropyAbsorption(t: TelemetrySnapshot): number {
  return clamp(
    calculateSemanticResistance(t) * 0.35 +
    calculateStrategicResistance(t) * 0.35 +
    calculateOperationalResistance(t) * 0.3,
  );
}

export function detectEntropyAcceleration(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.governance_entropy_score ?? 0) > 50) out.push("Entropia de governança acelerando.");
  if ((t.semantic_entropy_score ?? 0) > 55) out.push("Entropia semântica acelerando.");
  if ((t.systemic_noise_score ?? 0) > 55) out.push("Ruído sistêmico acelerando entropia.");
  return out;
}

export function detectCollapseVectors(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.collapse_probability_score ?? 0) > 45) out.push("Vetor de colapso ativo.");
  if ((t.cascade_impact_score ?? 0) > 50) out.push("Impacto em cascata previsível.");
  if ((t.cluster_fragility_score ?? 0) > 55) out.push("Fragilidade de clusters em vetor crítico.");
  return out;
}

export function estimateAbsorptionCapacity(t: TelemetrySnapshot): number {
  return clamp(
    calculateEntropyAbsorption(t) * 0.7 +
    (t.entropy_resistance_score ?? 0) * 0.3,
  );
}

export interface AbsorptionReport {
  status: AbsorptionStatus;
  absorption: number;
  semantic: number;
  strategic: number;
  operational: number;
  capacity: number;
  acceleration: string[];
  vectors: string[];
}

export function buildAbsorptionReport(t: TelemetrySnapshot): AbsorptionReport {
  const absorption = calculateEntropyAbsorption(t);
  let status: AbsorptionStatus = "resilient";
  if (absorption < 45) status = "unstable";
  else if (absorption < 60) status = "pressured";
  else if (absorption < 78) status = "resistant";
  return {
    status, absorption,
    semantic: calculateSemanticResistance(t),
    strategic: calculateStrategicResistance(t),
    operational: calculateOperationalResistance(t),
    capacity: estimateAbsorptionCapacity(t),
    acceleration: detectEntropyAcceleration(t),
    vectors: detectCollapseVectors(t),
  };
}
