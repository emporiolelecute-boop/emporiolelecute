/**
 * Phase 15.3 — Conflict Resolution. Pure helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export type ConflictSeverity = "low" | "medium" | "high" | "critical";

export interface ReasoningConflict {
  type: string;
  layerA: string;
  layerB: string;
  divergence: number; // 0..100
  strategicImpact: number; // 0..100
  severity: ConflictSeverity;
  description: string;
}

export interface LayerSignal {
  layer: string;
  value: number; // 0..100
}

function detectPairwiseDivergence(
  type: string,
  signals: LayerSignal[],
  threshold = 20,
): ReasoningConflict[] {
  const out: ReasoningConflict[] = [];
  for (let i = 0; i < signals.length; i++) {
    for (let j = i + 1; j < signals.length; j++) {
      const a = signals[i];
      const b = signals[j];
      const div = Math.abs(a.value - b.value);
      if (div >= threshold) {
        const impact = clamp(div * 0.8);
        out.push({
          type,
          layerA: a.layer,
          layerB: b.layer,
          divergence: clamp(div),
          strategicImpact: impact,
          severity: estimateConflictSeverity(impact),
          description: `${a.layer} (${a.value}) divergente de ${b.layer} (${b.value})`,
        });
      }
    }
  }
  return out;
}

export const detectReasoningConflicts = (s: LayerSignal[]) =>
  detectPairwiseDivergence("reasoning", s);
export const detectStrategicContradictions = (s: LayerSignal[]) =>
  detectPairwiseDivergence("strategic", s);
export const detectAuthorityContradictions = (s: LayerSignal[]) =>
  detectPairwiseDivergence("authority", s);
export const detectSemanticContradictions = (s: LayerSignal[]) =>
  detectPairwiseDivergence("semantic", s);
export const detectGovernanceContradictions = (s: LayerSignal[]) =>
  detectPairwiseDivergence("governance", s);

export function estimateConflictSeverity(impact: number): ConflictSeverity {
  if (impact >= 75) return "critical";
  if (impact >= 55) return "high";
  if (impact >= 35) return "medium";
  return "low";
}

export interface ConflictResolutionPlan {
  conflict: ReasoningConflict;
  action: string;
  priority: number;
}

export function buildConflictResolutionPlan(conflicts: ReasoningConflict[]): ConflictResolutionPlan[] {
  const order: Record<ConflictSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  return conflicts
    .map((c) => ({
      conflict: c,
      priority: order[c.severity],
      action:
        c.severity === "critical"
          ? `Reconciliar manualmente ${c.layerA} ↔ ${c.layerB}`
          : c.severity === "high"
            ? `Revisar pesos entre ${c.layerA} e ${c.layerB}`
            : `Monitorar divergência ${c.layerA}/${c.layerB}`,
    }))
    .sort((a, b) => b.priority - a.priority);
}
