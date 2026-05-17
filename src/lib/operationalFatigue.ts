/**
 * Fase 14.5 — Operational Fatigue Engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type FatigueClass = "healthy" | "pressured" | "overloaded" | "exhausted";

export function calculateStrategicFatigue(t: TelemetrySnapshot): number {
  return clamp((t.strategic_fatigue_score ?? 0) * 0.6 + (t.strategic_contradiction_score ?? 0) * 0.2 + (t.strategic_noise_score ?? 0) * 0.2);
}

export function calculateExecutionFatigue(t: TelemetrySnapshot): number {
  return clamp(
    (t.operational_debt_score ?? 0) * 0.35 +
    (t.execution_noise_score ?? 0) * 0.25 +
    (t.bottleneck_score ?? 0) * 0.2 +
    (t.maintenance_pressure_score ?? 0) * 0.2,
  );
}

export function calculateSemanticFatigue(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_fatigue_score ?? 0) * 0.5 +
    (t.semantic_entropy_score ?? 0) * 0.25 +
    (t.topic_exhaustion_score ?? 0) * 0.25,
  );
}

export function calculateAuthorityFatigue(t: TelemetrySnapshot): number {
  return clamp(
    (t.authority_dependency_risk ?? 0) * 0.4 +
    (t.authority_entropy ?? 0) * 0.3 +
    (t.authority_instability_score ?? 0) * 0.3,
  );
}

export function calculateCognitiveFatigue(t: TelemetrySnapshot): number {
  return clamp(
    (t.cognitive_fatigue_score ?? 0) * 0.5 +
    (t.cognitive_pressure_score ?? 0) * 0.25 +
    (t.fragmentation_pressure_score ?? 0) * 0.25,
  );
}

export interface BurnoutZone { area: string; intensity: number; }

export function detectBurnoutZones(t: TelemetrySnapshot): BurnoutZone[] {
  return [
    { area: "Estratégia", intensity: calculateStrategicFatigue(t) },
    { area: "Execução", intensity: calculateExecutionFatigue(t) },
    { area: "Semântica", intensity: calculateSemanticFatigue(t) },
    { area: "Autoridade", intensity: calculateAuthorityFatigue(t) },
    { area: "Cognitivo", intensity: calculateCognitiveFatigue(t) },
  ].filter((z) => z.intensity >= 50).sort((a, b) => b.intensity - a.intensity);
}

export function detectOperationalOverload(t: TelemetrySnapshot): number {
  return clamp(
    (t.maintenance_pressure_score ?? 0) * 0.4 +
    (t.operational_debt_score ?? 0) * 0.3 +
    (t.bottleneck_score ?? 0) * 0.3,
  );
}

export function detectMaintenanceStress(t: TelemetrySnapshot): number {
  return clamp(
    (t.maintenance_pressure_score ?? 0) * 0.5 +
    (t.maintenance_explosion_risk ?? 0) * 0.3 +
    (t.operational_debt_score ?? 0) * 0.2,
  );
}

export interface FatigueReport {
  classification: FatigueClass;
  strategic: number;
  execution: number;
  semantic: number;
  authority: number;
  cognitive: number;
  overload: number;
  maintenanceStress: number;
  burnoutZones: BurnoutZone[];
  composite: number;
}

export function buildFatigueReport(t: TelemetrySnapshot): FatigueReport {
  const strategic = calculateStrategicFatigue(t);
  const execution = calculateExecutionFatigue(t);
  const semantic = calculateSemanticFatigue(t);
  const authority = calculateAuthorityFatigue(t);
  const cognitive = calculateCognitiveFatigue(t);
  const overload = detectOperationalOverload(t);
  const maintenanceStress = detectMaintenanceStress(t);
  const burnoutZones = detectBurnoutZones(t);
  const composite = Math.round((strategic + execution + semantic + authority + cognitive) / 5);

  let classification: FatigueClass = "healthy";
  if (composite >= 70) classification = "exhausted";
  else if (composite >= 55) classification = "overloaded";
  else if (composite >= 35) classification = "pressured";
  else classification = "healthy";

  return { classification, strategic, execution, semantic, authority, cognitive, overload, maintenanceStress, burnoutZones, composite };
}
