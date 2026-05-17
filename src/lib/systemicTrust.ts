/**
 * Fase 14.6 — Systemic Trust.
 * Read-only.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type TrustStatus = "trusted" | "stable" | "degraded" | "corrupted";

export function calculateSignalReliability(t: TelemetrySnapshot): number {
  return clamp(
    (100 - (t.systemic_noise_score ?? 0)) * 0.4 +
    (100 - (t.false_growth_signal_score ?? 0)) * 0.3 +
    (100 - (t.semantic_hallucination_score ?? 0)) * 0.3,
  );
}

export function calculateStrategicReliability(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_consistency_score ?? 0) * 0.4 +
    (100 - (t.strategic_contradiction_score ?? 0)) * 0.3 +
    (100 - (t.strategic_noise_score ?? 0)) * 0.3,
  );
}

export function calculateOperationalReliability(t: TelemetrySnapshot): number {
  return clamp(
    (t.execution_efficiency ?? 0) * 0.4 +
    (100 - (t.execution_noise_score ?? 0)) * 0.3 +
    (100 - (t.operational_debt_score ?? 0)) * 0.3,
  );
}

export function calculateSystemicTrust(t: TelemetrySnapshot): number {
  return clamp(
    calculateSignalReliability(t) * 0.4 +
    calculateStrategicReliability(t) * 0.3 +
    calculateOperationalReliability(t) * 0.3,
  );
}

export function detectTrustErosion(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.systemic_noise_score ?? 0) > 50) out.push("Ruído sistêmico erodindo a confiança.");
  if ((t.strategic_noise_score ?? 0) > 50) out.push("Ruído estratégico erodindo decisões.");
  if ((t.execution_noise_score ?? 0) > 50) out.push("Ruído operacional erodindo execução.");
  return out;
}

export function detectNoiseCorruption(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  const overall = ((t.systemic_noise_score ?? 0) + (t.execution_noise_score ?? 0) + (t.strategic_noise_score ?? 0)) / 3;
  if (overall > 55) out.push("Corrupção por ruído acima do tolerável.");
  return out;
}

export function detectStrategicHallucinations(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.semantic_hallucination_score ?? 0) > 35) out.push("Alucinações semânticas no ecossistema.");
  if ((t.false_growth_signal_score ?? 0) > 35) out.push("Sinais falsos de crescimento detectados.");
  return out;
}

export interface TrustReport {
  status: TrustStatus;
  trust: number;
  signalReliability: number;
  strategicReliability: number;
  operationalReliability: number;
  erosion: string[];
  noise: string[];
  hallucinations: string[];
}

export function buildTrustReport(t: TelemetrySnapshot): TrustReport {
  const trust = calculateSystemicTrust(t);
  let status: TrustStatus = "trusted";
  if (trust < 45) status = "corrupted";
  else if (trust < 60) status = "degraded";
  else if (trust < 80) status = "stable";
  return {
    status, trust,
    signalReliability: calculateSignalReliability(t),
    strategicReliability: calculateStrategicReliability(t),
    operationalReliability: calculateOperationalReliability(t),
    erosion: detectTrustErosion(t),
    noise: detectNoiseCorruption(t),
    hallucinations: detectStrategicHallucinations(t),
  };
}
