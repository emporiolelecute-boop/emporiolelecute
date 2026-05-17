/**
 * Phase 16.4 — Cognitive Consistency (pure, read-only).
 */
export type CognitiveVerdict = "lucid" | "stable" | "oscillating" | "fragmented" | "unstable";

export interface CognitiveConsistencyInputs {
  clarity: number;
  decisionStability: number;
  reasoningCoherence: number;
  drift: number;
  conflicts: number;
  confusion: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateCognitiveConsistency(i: CognitiveConsistencyInputs): number {
  return clamp(
    i.clarity * 0.3 + i.decisionStability * 0.25 + i.reasoningCoherence * 0.2 +
    inv(i.drift) * 0.1 + inv(i.conflicts) * 0.1 + inv(i.confusion) * 0.05
  );
}

export function detectCognitiveDrift(i: CognitiveConsistencyInputs): number {
  return clamp(i.drift * 0.6 + inv(i.clarity) * 0.4);
}

export function detectReasoningConflicts(i: CognitiveConsistencyInputs): number {
  return clamp(i.conflicts * 0.7 + inv(i.reasoningCoherence) * 0.3);
}

export function estimateDecisionConsistency(i: CognitiveConsistencyInputs): number {
  return clamp(i.decisionStability * 0.7 + i.clarity * 0.3);
}

export function detectStrategicConfusion(i: CognitiveConsistencyInputs): number {
  return clamp(i.confusion * 0.6 + i.drift * 0.4);
}

export function classifyCognitive(score: number): CognitiveVerdict {
  if (score >= 88) return "lucid";
  if (score >= 72) return "stable";
  if (score >= 58) return "oscillating";
  if (score >= 42) return "fragmented";
  return "unstable";
}

export interface ConsistencyMap {
  axes: { name: string; value: number }[];
  drift_score: number;
  confusion_score: number;
}

export function buildConsistencyMap(i: CognitiveConsistencyInputs): ConsistencyMap {
  return {
    axes: [
      { name: "clarity", value: i.clarity },
      { name: "decisions", value: i.decisionStability },
      { name: "reasoning", value: i.reasoningCoherence },
      { name: "drift_resistance", value: inv(i.drift) },
      { name: "conflict_resistance", value: inv(i.conflicts) },
      { name: "focus", value: inv(i.confusion) },
    ],
    drift_score: detectCognitiveDrift(i),
    confusion_score: detectStrategicConfusion(i),
  };
}
