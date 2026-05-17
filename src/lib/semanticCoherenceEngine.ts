/**
 * Phase 16.4 — Semantic Coherence Engine (pure, read-only).
 */
export type SemanticCoherenceVerdict = "coherent" | "stable" | "noisy" | "fragmented" | "corrupted";

export interface SemanticCoherenceInputs {
  flow: number;
  consistency: number;
  density: number;
  divergence: number;
  noise: number;
  meaningConflicts: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateSemanticCoherence(i: SemanticCoherenceInputs): number {
  return clamp(
    i.flow * 0.3 + i.consistency * 0.25 + i.density * 0.15 +
    inv(i.divergence) * 0.15 + inv(i.noise) * 0.1 + inv(i.meaningConflicts) * 0.05
  );
}

export function detectSemanticDivergence(i: SemanticCoherenceInputs): number {
  return clamp(i.divergence * 0.7 + inv(i.consistency) * 0.3);
}

export function detectSemanticNoise(i: SemanticCoherenceInputs): number {
  return clamp(i.noise * 0.7 + inv(i.flow) * 0.3);
}

export function estimateSemanticFlow(i: SemanticCoherenceInputs): number {
  return clamp(i.flow * 0.6 + i.density * 0.4);
}

export function detectMeaningConflicts(i: SemanticCoherenceInputs): number {
  return clamp(i.meaningConflicts * 0.7 + i.divergence * 0.3);
}

export function classifySemanticCoherence(score: number): SemanticCoherenceVerdict {
  if (score >= 88) return "coherent";
  if (score >= 72) return "stable";
  if (score >= 55) return "noisy";
  if (score >= 40) return "fragmented";
  return "corrupted";
}

export interface SemanticCoherenceMap {
  nodes: { axis: string; value: number; risk: number }[];
  flow_score: number;
  divergence_score: number;
}

export function buildSemanticCoherenceMap(i: SemanticCoherenceInputs): SemanticCoherenceMap {
  return {
    nodes: [
      { axis: "flow", value: i.flow, risk: inv(i.flow) },
      { axis: "consistency", value: i.consistency, risk: inv(i.consistency) },
      { axis: "density", value: i.density, risk: inv(i.density) },
      { axis: "divergence", value: inv(i.divergence), risk: i.divergence },
      { axis: "noise", value: inv(i.noise), risk: i.noise },
      { axis: "meaning_conflicts", value: inv(i.meaningConflicts), risk: i.meaningConflicts },
    ],
    flow_score: estimateSemanticFlow(i),
    divergence_score: detectSemanticDivergence(i),
  };
}
