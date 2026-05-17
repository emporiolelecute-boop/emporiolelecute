/**
 * Fase 14.6 — Continuity Engine.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type ContinuityStatus = "continuous" | "stable" | "vulnerable" | "unstable";

export function calculateExecutionContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.execution_efficiency ?? 0) * 0.4 +
    (100 - (t.execution_fatigue_score ?? 0)) * 0.3 +
    (100 - (t.bottleneck_score ?? 0)) * 0.3,
  );
}

export function calculateSemanticContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_stability_score ?? 0) * 0.4 +
    (100 - (t.semantic_drift_score ?? 0)) * 0.3 +
    (100 - (t.semantic_entropy_score ?? 0)) * 0.3,
  );
}

export function calculateAuthorityContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.authority_persistence_score ?? 0) * 0.5 +
    (100 - (t.authority_instability_score ?? 0)) * 0.5,
  );
}

export function calculateStrategicContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_consistency_score ?? 0) * 0.4 +
    (100 - (t.strategic_fatigue_score ?? 0)) * 0.3 +
    (100 - (t.strategic_contradiction_score ?? 0)) * 0.3,
  );
}

export function calculateRecoveryContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.recovery_capacity_score ?? 0) * 0.5 +
    (t.recovery_elasticity ?? 0) * 0.3 +
    (t.adaptive_recovery_score ?? 0) * 0.2,
  );
}

export function detectContinuityBreaks(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if (calculateExecutionContinuity(t) < 50) out.push("Continuidade de execução em risco.");
  if (calculateSemanticContinuity(t) < 50) out.push("Continuidade semântica em risco.");
  if (calculateAuthorityContinuity(t) < 50) out.push("Continuidade de autoridade em risco.");
  if (calculateStrategicContinuity(t) < 50) out.push("Continuidade estratégica em risco.");
  return out;
}

export function detectFutureDisruptions(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.collapse_probability_score ?? 0) > 35) out.push("Probabilidade de colapso futuro acima do tolerável.");
  if ((t.burnout_risk_score ?? 0) > 45) out.push("Risco de burnout operacional iminente.");
  if ((t.maintenance_explosion_risk ?? 0) > 45) out.push("Explosão de manutenção em horizonte próximo.");
  return out;
}

export function estimateContinuityDurability(t: TelemetrySnapshot): number {
  const vals = [
    calculateExecutionContinuity(t),
    calculateSemanticContinuity(t),
    calculateAuthorityContinuity(t),
    calculateStrategicContinuity(t),
    calculateRecoveryContinuity(t),
  ];
  return clamp(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export interface ContinuityReport {
  status: ContinuityStatus;
  durability: number;
  execution: number;
  semantic: number;
  authority: number;
  strategic: number;
  recovery: number;
  breaks: string[];
  disruptions: string[];
}

export function buildContinuityReport(t: TelemetrySnapshot): ContinuityReport {
  const execution = calculateExecutionContinuity(t);
  const semantic = calculateSemanticContinuity(t);
  const authority = calculateAuthorityContinuity(t);
  const strategic = calculateStrategicContinuity(t);
  const recovery = calculateRecoveryContinuity(t);
  const durability = estimateContinuityDurability(t);
  let status: ContinuityStatus = "continuous";
  if (durability < 50) status = "unstable";
  else if (durability < 65) status = "vulnerable";
  else if (durability < 80) status = "stable";
  return {
    status, durability, execution, semantic, authority, strategic, recovery,
    breaks: detectContinuityBreaks(t),
    disruptions: detectFutureDisruptions(t),
  };
}
