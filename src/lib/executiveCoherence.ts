/**
 * Fase 15.6 — Executive Coherence (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface CoherenceInputs {
  strategicCoherence: number;
  alignment: number;
  consensus: number;
  narrativeCoherence: number;
  noise: number;
  conflicts: number;
  contradictions: number;
}

export function calculateExecutiveCoherence(i: CoherenceInputs): number {
  return avg([i.strategicCoherence, i.alignment, i.consensus,
    inv(i.contradictions), inv(i.noise)]);
}
export function calculateNarrativeConsistency(i: CoherenceInputs): number {
  return avg([i.narrativeCoherence, inv(i.contradictions), inv(i.noise)]);
}
export function detectExecutiveContradictions(i: CoherenceInputs): number {
  return clamp((i.contradictions * 0.6) + (i.conflicts * 0.4));
}
export function detectStrategicNoise(i: CoherenceInputs): number {
  return clamp((i.noise * 0.7) + (i.contradictions * 0.3));
}
export function estimateLeadershipClarity(i: CoherenceInputs): number {
  return avg([i.strategicCoherence, i.narrativeCoherence, inv(i.noise), i.consensus]);
}
