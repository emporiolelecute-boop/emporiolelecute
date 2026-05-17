/**
 * Fase 14.6 — Governance Entropy.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type EntropyStatus = "coherent" | "pressured" | "unstable" | "chaotic";

export function calculateStrategicEntropy(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_entropy_score ?? 0) * 0.5 +
    (t.strategic_scatter_score ?? 0) * 0.25 +
    (t.strategic_fatigue_score ?? 0) * 0.25,
  );
}

export function calculateOperationalEntropy(t: TelemetrySnapshot): number {
  return clamp(
    (t.execution_entropy_score ?? 0) * 0.5 +
    (t.execution_dilution_score ?? 0) * 0.25 +
    (t.execution_noise_score ?? 0) * 0.25,
  );
}

export function calculateSemanticEntropyPressure(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_entropy_score ?? 0) * 0.5 +
    (t.semantic_drift_score ?? 0) * 0.25 +
    (t.semantic_fatigue_score ?? 0) * 0.25,
  );
}

export function calculateGovernanceEntropy(t: TelemetrySnapshot): number {
  return clamp(
    calculateStrategicEntropy(t) * 0.35 +
    calculateOperationalEntropy(t) * 0.3 +
    calculateSemanticEntropyPressure(t) * 0.2 +
    (t.systemic_entropy_score ?? 0) * 0.15,
  );
}

export function detectEntropyAcceleration(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.systemic_entropy_score ?? 0) > 50) out.push("Entropia sistêmica acelerando.");
  if ((t.semantic_entropy_score ?? 0) > 50) out.push("Entropia semântica acumulando.");
  return out;
}

export function detectGovernanceDrift(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.semantic_drift_score ?? 0) > 45) out.push("Drift semântico ameaça governança.");
  if ((t.strategic_scatter_score ?? 0) > 50) out.push("Dispersão estratégica desviando rumo.");
  return out;
}

export function detectMetaInstability(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.systemic_instability_score ?? 0) > 45) out.push("Instabilidade meta-sistêmica relevante.");
  if ((t.fragmentation_risk_score ?? 0) > 50) out.push("Fragmentação ameaça meta-coerência.");
  return out;
}

export interface EntropyReport {
  status: EntropyStatus;
  entropy: number;
  strategic: number;
  operational: number;
  semantic: number;
  acceleration: string[];
  drift: string[];
  meta_instability: string[];
}

export function buildEntropyReport(t: TelemetrySnapshot): EntropyReport {
  const entropy = calculateGovernanceEntropy(t);
  let status: EntropyStatus = "coherent";
  if (entropy >= 70) status = "chaotic";
  else if (entropy >= 55) status = "unstable";
  else if (entropy >= 40) status = "pressured";
  return {
    status, entropy,
    strategic: calculateStrategicEntropy(t),
    operational: calculateOperationalEntropy(t),
    semantic: calculateSemanticEntropyPressure(t),
    acceleration: detectEntropyAcceleration(t),
    drift: detectGovernanceDrift(t),
    meta_instability: detectMetaInstability(t),
  };
}
