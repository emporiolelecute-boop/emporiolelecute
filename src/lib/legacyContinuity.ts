/**
 * Fase 14.7 — Legacy Continuity.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type LegacyStatus = "preserved" | "stable" | "vulnerable" | "collapsing";

export function calculateStrategicMemoryStrength(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_consistency_score ?? 0) * 0.5 +
    (100 - (t.strategic_fatigue_score ?? 0)) * 0.3 +
    (t.long_horizon_survivability_score ?? 0) * 0.2,
  );
}

export function calculateExecutionPersistence(t: TelemetrySnapshot): number {
  return clamp(
    (t.execution_efficiency ?? 0) * 0.4 +
    (t.execution_continuity_score ?? 0) * 0.4 +
    (100 - (t.execution_fatigue_score ?? 0)) * 0.2,
  );
}

export function calculateAuthorityPersistence(t: TelemetrySnapshot): number {
  return clamp(
    (t.authority_persistence_score ?? 0) * 0.6 +
    (t.authority_balance_score ?? 0) * 0.4,
  );
}

export function calculateSemanticPersistence(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_stability_score ?? 0) * 0.5 +
    (t.semantic_cohesion_score ?? 0) * 0.3 +
    (100 - (t.semantic_drift_score ?? 0)) * 0.2,
  );
}

export function calculateLegacyContinuity(t: TelemetrySnapshot): number {
  return clamp(
    calculateStrategicMemoryStrength(t) * 0.25 +
    calculateExecutionPersistence(t) * 0.25 +
    calculateAuthorityPersistence(t) * 0.25 +
    calculateSemanticPersistence(t) * 0.25,
  );
}

export function detectLegacyErosion(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if (calculateAuthorityPersistence(t) < 55) out.push("Erosão de autoridade detectada.");
  if (calculateSemanticPersistence(t) < 55) out.push("Erosão semântica detectada.");
  if (calculateStrategicMemoryStrength(t) < 55) out.push("Erosão de memória estratégica.");
  return out;
}

export function detectContinuityCollapse(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.continuity_break_risk_score ?? 0) > 50) out.push("Risco de ruptura de continuidade elevado.");
  if (calculateLegacyContinuity(t) < 45) out.push("Colapso de continuidade iminente.");
  return out;
}

export function estimateLegacySurvival(t: TelemetrySnapshot): number {
  return clamp(
    calculateLegacyContinuity(t) * 0.7 +
    (t.long_horizon_survivability_score ?? 0) * 0.3,
  );
}

export interface LegacyReport {
  status: LegacyStatus;
  continuity: number;
  memory: number;
  execution: number;
  authority: number;
  semantic: number;
  survival: number;
  erosion: string[];
  collapse: string[];
}

export function buildLegacyReport(t: TelemetrySnapshot): LegacyReport {
  const continuity = calculateLegacyContinuity(t);
  let status: LegacyStatus = "preserved";
  if (continuity < 45) status = "collapsing";
  else if (continuity < 60) status = "vulnerable";
  else if (continuity < 78) status = "stable";
  return {
    status, continuity,
    memory: calculateStrategicMemoryStrength(t),
    execution: calculateExecutionPersistence(t),
    authority: calculateAuthorityPersistence(t),
    semantic: calculateSemanticPersistence(t),
    survival: estimateLegacySurvival(t),
    erosion: detectLegacyErosion(t),
    collapse: detectContinuityCollapse(t),
  };
}
