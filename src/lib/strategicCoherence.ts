/**
 * Fase 14.4 — Strategic Coherence engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const v = (n?: number) => (typeof n === "number" ? n : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface CoherenceReport {
  coherence: number;
  alignment: number;
  intentConsistency: number;
  focus: number;
  semanticDirection: number;
  contradictions: string[];
  scatter: number;
  dilution: number;
}

export function calculateStrategicCoherence(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_consistency_score) * 0.4 +
    v(t.strategic_alignment_score) * 0.3 +
    (100 - v(t.strategic_contradiction_score)) * 0.3
  );
}
export function calculateExecutionAlignment(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_alignment_score) * 0.5 +
    v(t.execution_focus_score) * 0.3 +
    (100 - v(t.operational_dissonance_score)) * 0.2
  );
}
export function calculateIntentConsistency(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_consistency_score) * 0.5 +
    v(t.business_intent_score) * 0.3 +
    (100 - v(t.volatility_score)) * 0.2
  );
}
export function calculateOperationalFocus(t: TelemetrySnapshot): number {
  return clamp(
    v(t.execution_focus_score) * 0.5 +
    (100 - v(t.fragmentation_score)) * 0.25 +
    (100 - v(t.execution_noise_score)) * 0.25
  );
}
export function calculateSemanticDirection(t: TelemetrySnapshot): number {
  return clamp(
    v(t.semantic_stability_score) * 0.4 +
    (100 - v(t.semantic_aging_score)) * 0.3 +
    v(t.semantic_balance_score) * 0.3
  );
}
export function detectContradictoryInitiatives(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if (v(t.strategic_contradiction_score) > 50) out.push("Contradições estratégicas amplas");
  if (v(t.operational_dissonance_score) > 50) out.push("Dissonância operacional");
  if (v(t.volatility_score) > 50 && v(t.strategic_consistency_score) < 50)
    out.push("Volatilidade combinada com baixa consistência");
  if (v(t.execution_focus_score) < 40 && v(t.momentum_growth_score) > 60)
    out.push("Crescimento sem foco");
  return out;
}
export function detectStrategicScatter(t: TelemetrySnapshot): number {
  return clamp(
    (100 - v(t.execution_focus_score)) * 0.4 +
    v(t.fragmentation_score) * 0.3 +
    v(t.fragile_cluster_count) * 4
  );
}
export function detectExecutionDilution(t: TelemetrySnapshot): number {
  return clamp(
    v(t.operational_waste_score) * 0.4 +
    v(t.execution_noise_score) * 0.3 +
    (100 - v(t.execution_efficiency)) * 0.3
  );
}
export function buildCoherenceReport(t: TelemetrySnapshot): CoherenceReport {
  return {
    coherence: calculateStrategicCoherence(t),
    alignment: calculateExecutionAlignment(t),
    intentConsistency: calculateIntentConsistency(t),
    focus: calculateOperationalFocus(t),
    semanticDirection: calculateSemanticDirection(t),
    contradictions: detectContradictoryInitiatives(t),
    scatter: detectStrategicScatter(t),
    dilution: detectExecutionDilution(t),
  };
}
