/**
 * Fase 14.3 — SEO Consciousness Engine.
 * Pure, read-only computations. No side effects.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

export type ConsciousnessVerdict =
  | "HyperAware" | "Conscious" | "Adaptive" | "Stable"
  | "Fragmented" | "Disoriented" | "Critical";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export function calculateSystemConsciousness(t: TelemetrySnapshot): number {
  const base = (t.system_health_score + t.sustainability_score + t.resilience_score) / 3;
  const penalty = (t.collapse_risk_score + t.semantic_fatigue_score) / 4;
  return clamp(base - penalty + t.strategic_alignment_score * 0.15);
}

export function calculateSemanticAwareness(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_connectivity_score * 0.35) +
    (t.semantic_stability_score * 0.25) +
    (t.knowledge_health_score * 0.2) +
    (100 - t.semantic_entropy_score) * 0.2,
  );
}

export function calculateOperationalAwareness(t: TelemetrySnapshot): number {
  return clamp(
    (t.operational_score * 0.4) +
    (t.execution_efficiency * 0.25) +
    (t.recovery_capacity_score * 0.2) +
    (100 - t.operational_debt_score) * 0.15,
  );
}

export function calculateStrategicAwareness(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_alignment_score * 0.4) +
    (t.execution_focus_score * 0.25) +
    (t.adaptive_intelligence_score * 0.2) +
    (100 - t.strategic_fatigue_score) * 0.15,
  );
}

export function detectCognitiveFatigue(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_fatigue_score * 0.35) +
    (t.strategic_fatigue_score * 0.3) +
    (t.maintenance_pressure_score * 0.2) +
    (t.operational_debt_score * 0.15),
  );
}

export function detectSemanticConfusion(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_noise_score * 0.3) +
    (t.meaning_dilution_score * 0.3) +
    (t.semantic_entropy_score * 0.25) +
    (t.fragmentation_score * 0.15),
  );
}

export function detectAwarenessCollapse(t: TelemetrySnapshot): number {
  const awareness = calculateSystemConsciousness(t);
  const risk = (t.collapse_risk_score + t.cascade_failure_risk + t.cascade_collapse_risk) / 3;
  return clamp(risk * 0.6 + (100 - awareness) * 0.4);
}

export function buildConsciousnessVerdict(t: TelemetrySnapshot): ConsciousnessVerdict {
  const c = calculateSystemConsciousness(t);
  const collapse = detectAwarenessCollapse(t);
  const confusion = detectSemanticConfusion(t);
  if (collapse >= 75) return "Critical";
  if (confusion >= 70) return "Disoriented";
  if (c < 35) return "Fragmented";
  if (c >= 85) return "HyperAware";
  if (c >= 70) return "Conscious";
  if (c >= 55) return "Adaptive";
  return "Stable";
}
