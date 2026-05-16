/**
 * Fase 14.3 — Cognitive Load Engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export function calculateCognitiveLoad(t: TelemetrySnapshot): number {
  return clamp(
    (t.maintenance_pressure_score * 0.3) +
    (t.operational_debt_score * 0.25) +
    (t.risk_pressure_score * 0.2) +
    (t.semantic_fatigue_score * 0.15) +
    (t.bottleneck_score * 0.1),
  );
}

export function detectOperationalFatigue(t: TelemetrySnapshot): number {
  return clamp((t.strategic_fatigue_score * 0.5) + (t.operational_debt_score * 0.3) + (t.bottleneck_score * 0.2));
}

export function detectSemanticOverload(t: TelemetrySnapshot): number {
  return clamp((t.saturation_score * 0.4) + (t.topic_exhaustion_score * 0.3) + (t.semantic_entropy_score * 0.3));
}

export function detectStrategicExhaustion(t: TelemetrySnapshot): number {
  return clamp((t.strategic_fatigue_score * 0.4) + (t.semantic_fatigue_score * 0.3) + (100 - t.recovery_capacity_score) * 0.3);
}

export function estimateRecoveryCapacity(t: TelemetrySnapshot): number {
  return clamp((t.recovery_capacity_score * 0.5) + (t.adaptive_capacity_score * 0.3) + (t.resilience_score * 0.2));
}

export interface MentalPressurePoint { key: string; pressure: number; }

export function calculateMentalPressureMap(t: TelemetrySnapshot): MentalPressurePoint[] {
  return [
    { key: "Manutenção", pressure: t.maintenance_pressure_score },
    { key: "Débito", pressure: t.operational_debt_score },
    { key: "Risco", pressure: t.risk_pressure_score },
    { key: "Fadiga Semântica", pressure: t.semantic_fatigue_score },
    { key: "Fadiga Estratégica", pressure: t.strategic_fatigue_score },
    { key: "Gargalos", pressure: t.bottleneck_score },
  ];
}

export interface FatigueForecast { horizonDays: number; projectedFatigue: number; }

export function buildFatigueForecast(t: TelemetrySnapshot): FatigueForecast[] {
  const current = (t.semantic_fatigue_score + t.strategic_fatigue_score) / 2;
  const recovery = estimateRecoveryCapacity(t);
  const driftPerMonth = Math.max(-10, (current - recovery) / 8);
  return [30, 90, 180, 365].map((d) => ({
    horizonDays: d,
    projectedFatigue: clamp(current + driftPerMonth * (d / 30)),
  }));
}
