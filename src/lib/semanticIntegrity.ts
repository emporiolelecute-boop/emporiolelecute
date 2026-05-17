/**
 * Phase 16.3 — Semantic Integrity (pure, read-only).
 */
export type SemanticVerdict = "pristine" | "coherent" | "unstable" | "fragmented" | "corrupted";

export interface SemanticIntegrityInputs {
  clarity: number;
  cohesion: number;
  continuity: number;
  conflicts: number;
  corruption: number;
  ambiguity: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateSemanticIntegrity(i: SemanticIntegrityInputs): number {
  return clamp(
    i.clarity * 0.3 + i.cohesion * 0.25 + i.continuity * 0.2 +
    inv(i.conflicts) * 0.1 + inv(i.corruption) * 0.1 + inv(i.ambiguity) * 0.05
  );
}

export function detectSemanticConflicts(i: SemanticIntegrityInputs): number {
  return clamp(i.conflicts * 0.6 + i.ambiguity * 0.4);
}

export function detectSemanticCorruption(i: SemanticIntegrityInputs): number {
  return clamp(i.corruption * 0.7 + inv(i.cohesion) * 0.3);
}

export function estimateSemanticContinuity(i: SemanticIntegrityInputs): number {
  return clamp(i.continuity * 0.7 + i.cohesion * 0.3);
}

export function detectSemanticAmbiguity(i: SemanticIntegrityInputs): number {
  return clamp(i.ambiguity * 0.6 + inv(i.clarity) * 0.4);
}

export function classifySemantic(score: number): SemanticVerdict {
  if (score >= 88) return "pristine";
  if (score >= 72) return "coherent";
  if (score >= 55) return "unstable";
  if (score >= 40) return "fragmented";
  return "corrupted";
}

export interface SemanticIntegrityMap {
  cells: { axis: string; value: number; risk: number }[];
  conflict_score: number;
  corruption_score: number;
}

export function buildSemanticIntegrityMap(i: SemanticIntegrityInputs): SemanticIntegrityMap {
  const cells = [
    { axis: "clarity", value: i.clarity, risk: inv(i.clarity) },
    { axis: "cohesion", value: i.cohesion, risk: inv(i.cohesion) },
    { axis: "continuity", value: i.continuity, risk: inv(i.continuity) },
    { axis: "conflicts", value: inv(i.conflicts), risk: i.conflicts },
    { axis: "corruption", value: inv(i.corruption), risk: i.corruption },
    { axis: "ambiguity", value: inv(i.ambiguity), risk: i.ambiguity },
  ];
  return {
    cells,
    conflict_score: detectSemanticConflicts(i),
    corruption_score: detectSemanticCorruption(i),
  };
}
