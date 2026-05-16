/**
 * Fase 14.4 — Systemic Entropy engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const v = (n?: number) => (typeof n === "number" ? n : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type EntropyClassification = "ordered" | "balanced" | "unstable" | "chaotic";

export interface EntropyMap {
  systemic: number;
  semantic: number;
  execution: number;
  authority: number;
  strategic: number;
  noise: number;
  signalLoss: number;
  leaks: string[];
  classification: EntropyClassification;
}

export function calculateSemanticEntropy(t: TelemetrySnapshot): number {
  return clamp(
    v(t.semantic_entropy_score) * 0.5 +
    v(t.semantic_noise_score) * 0.25 +
    v(t.meaning_dilution_score) * 0.25
  );
}
export function calculateExecutionEntropy(t: TelemetrySnapshot): number {
  return clamp(
    v(t.execution_noise_score) * 0.4 +
    v(t.fragmentation_score) * 0.3 +
    v(t.operational_waste_score) * 0.3
  );
}
export function calculateAuthorityEntropy(t: TelemetrySnapshot): number {
  return clamp(
    v(t.authority_entropy) * 0.5 +
    v(t.authority_dispersion_score) * 0.3 +
    v(t.authority_dependency_risk) * 0.2
  );
}
export function calculateStrategicEntropy(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_contradiction_score) * 0.4 +
    v(t.strategic_noise_score) * 0.3 +
    v(t.volatility_score) * 0.3
  );
}
export function calculateSystemicEntropy(t: TelemetrySnapshot): number {
  return clamp(
    calculateSemanticEntropy(t) * 0.3 +
    calculateExecutionEntropy(t) * 0.25 +
    calculateAuthorityEntropy(t) * 0.25 +
    calculateStrategicEntropy(t) * 0.2
  );
}
export function detectEntropyLeaks(t: TelemetrySnapshot): string[] {
  const leaks: string[] = [];
  if (v(t.semantic_noise_score) > 45) leaks.push("Ruído semântico");
  if (v(t.execution_noise_score) > 45) leaks.push("Ruído de execução");
  if (v(t.authority_entropy) > 50) leaks.push("Dispersão de autoridade");
  if (v(t.strategic_contradiction_score) > 50) leaks.push("Contradição estratégica");
  if (v(t.operational_waste_score) > 45) leaks.push("Desperdício operacional");
  return leaks;
}
export function detectSignalLoss(t: TelemetrySnapshot): number {
  return clamp(
    v(t.semantic_noise_score) * 0.4 +
    v(t.meaning_dilution_score) * 0.3 +
    (100 - v(t.semantic_stability_score)) * 0.3
  );
}
export function detectNoiseAmplification(t: TelemetrySnapshot): number {
  return clamp(
    v(t.execution_noise_score) * 0.4 +
    v(t.strategic_noise_score) * 0.3 +
    v(t.semantic_noise_score) * 0.3
  );
}
export function buildEntropyMap(t: TelemetrySnapshot): EntropyMap {
  const systemic = calculateSystemicEntropy(t);
  const semantic = calculateSemanticEntropy(t);
  const execution = calculateExecutionEntropy(t);
  const authority = calculateAuthorityEntropy(t);
  const strategic = calculateStrategicEntropy(t);
  const noise = detectNoiseAmplification(t);
  const signalLoss = detectSignalLoss(t);
  const leaks = detectEntropyLeaks(t);
  let classification: EntropyClassification = "balanced";
  if (systemic < 25) classification = "ordered";
  else if (systemic < 50) classification = "balanced";
  else if (systemic < 70) classification = "unstable";
  else classification = "chaotic";
  return { systemic, semantic, execution, authority, strategic, noise, signalLoss, leaks, classification };
}
