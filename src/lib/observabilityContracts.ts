/**
 * Fase 15 — Observability Contracts.
 * Validates telemetry, lineage and confidence consistency.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface ContractResult {
  passed: boolean;
  issues: string[];
}

export function validateTelemetryIntegrity(t: TelemetrySnapshot): ContractResult {
  const issues: string[] = [];
  const keys = Object.keys(t) as Array<keyof TelemetrySnapshot>;
  for (const k of keys) {
    const v = (t as any)[k];
    if (typeof v === "number") {
      if (!Number.isFinite(v)) issues.push(`Campo ${String(k)} não-finito.`);
      if (String(k).endsWith("_score") && (v < 0 || v > 100)) {
        issues.push(`Campo ${String(k)} fora da escala 0-100 (${v}).`);
      }
    }
  }
  return { passed: issues.length === 0, issues };
}

export function validateEngineOutputs(outputs: Record<string, number>): ContractResult {
  const issues: string[] = [];
  for (const [k, v] of Object.entries(outputs)) {
    if (!Number.isFinite(v)) issues.push(`Output ${k} inválido.`);
    if (v < 0 || v > 100) issues.push(`Output ${k} fora da escala (${v}).`);
  }
  return { passed: issues.length === 0, issues };
}

export function validateNormalization(values: Record<string, number>): ContractResult {
  const issues: string[] = [];
  for (const [k, v] of Object.entries(values)) {
    if (v < 0 || v > 100) issues.push(`${k} não normalizado.`);
  }
  return { passed: issues.length === 0, issues };
}

export function validateLineage(lineageIntegrity: number): ContractResult {
  const issues: string[] = [];
  if (lineageIntegrity < 70) issues.push(`Integridade de lineage abaixo de 70 (${lineageIntegrity}).`);
  return { passed: issues.length === 0, issues };
}

export function validateConfidenceConsistency(avgConfidence: number, lowConfidenceCount: number): ContractResult {
  const issues: string[] = [];
  if (avgConfidence < 65) issues.push(`Confiança média baixa (${avgConfidence}).`);
  if (lowConfidenceCount > 5) issues.push(`${lowConfidenceCount} métricas com confiança baixa.`);
  return { passed: issues.length === 0, issues };
}

export function detectTelemetryCorruption(t: TelemetrySnapshot): string[] {
  return validateTelemetryIntegrity(t).issues;
}

export function detectDiagnosticInconsistency(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  const survival = t.survival_confidence_score ?? 0;
  const collapse = t.collapse_probability_score ?? 0;
  if (survival > 70 && collapse > 60) out.push("Sobrevivência alta + colapso alto inconsistente.");
  const governance = t.governance_score ?? 0;
  const drift = t.governance_drift_score ?? 0;
  if (governance > 75 && drift > 60) out.push("Governança alta + drift alto inconsistente.");
  return out;
}

export function aggregateObservabilityScore(results: ContractResult[]): number {
  if (results.length === 0) return 0;
  const passed = results.filter((r) => r.passed).length;
  return clamp((passed / results.length) * 100);
}
