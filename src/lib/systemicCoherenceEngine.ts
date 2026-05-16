/**
 * Fase 14.3 — Systemic Coherence Engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface CoherenceSignal { key: string; severity: "low" | "medium" | "high"; note: string; }

export function calculateSystemicCoherence(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_alignment_score * 0.35) +
    (t.semantic_stability_score * 0.25) +
    (t.strategic_consistency_score * 0.2) +
    (100 - t.fragmentation_score) * 0.2,
  );
}

export function detectFragmentationPressure(t: TelemetrySnapshot): number {
  return clamp((t.fragmentation_score * 0.6) + (t.orphan_cluster_count * 4));
}

export function detectSemanticMisalignment(t: TelemetrySnapshot): number {
  return clamp(100 - ((t.semantic_balance_score + t.semantic_stability_score) / 2));
}

export function detectOperationalDissonance(t: TelemetrySnapshot): number {
  const exec = t.execution_efficiency_score || t.execution_efficiency;
  return clamp(Math.abs(exec - t.operational_score) + t.execution_noise_score * 0.3);
}

export function calculateEvolutionaryConsistency(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_consistency_score * 0.4) +
    (100 - t.volatility_score) * 0.3 +
    (t.adaptive_intelligence_score * 0.3),
  );
}

export function detectStrategicContradictions(t: TelemetrySnapshot): CoherenceSignal[] {
  const out: CoherenceSignal[] = [];
  if (t.momentum_growth_score > 70 && t.semantic_stability_score < 40)
    out.push({ key: "growth_vs_stability", severity: "high", note: "Crescimento alto com estabilidade baixa" });
  if (t.execution_efficiency > 70 && t.operational_debt_score > 60)
    out.push({ key: "efficiency_vs_debt", severity: "medium", note: "Eficiência alta com débito acumulado" });
  if (t.authority_growth_projection > 60 && t.collapse_risk_score > 50)
    out.push({ key: "authority_vs_collapse", severity: "high", note: "Projeção positiva sob risco de colapso" });
  return out;
}

export interface CoherenceMap {
  coherence: number;
  fragmentation: number;
  misalignment: number;
  dissonance: number;
  evolutionary: number;
  contradictions: CoherenceSignal[];
}

export function buildCoherenceMap(t: TelemetrySnapshot): CoherenceMap {
  return {
    coherence: calculateSystemicCoherence(t),
    fragmentation: detectFragmentationPressure(t),
    misalignment: detectSemanticMisalignment(t),
    dissonance: detectOperationalDissonance(t),
    evolutionary: calculateEvolutionaryConsistency(t),
    contradictions: detectStrategicContradictions(t),
  };
}
