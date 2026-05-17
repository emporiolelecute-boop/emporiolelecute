/**
 * Phase 16.4 — Continuity Coherence (pure, read-only).
 */
export type ContinuityCoherenceVerdict = "continuous" | "resilient" | "stable" | "unstable" | "broken";

export interface ContinuityCoherenceInputs {
  persistence: number;
  resilience: number;
  endurance: number;
  dissonance: number;
  inconsistency: number;
  decay: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateContinuityCoherence(i: ContinuityCoherenceInputs): number {
  return clamp(
    i.persistence * 0.3 + i.endurance * 0.25 + i.resilience * 0.2 +
    inv(i.dissonance) * 0.1 + inv(i.inconsistency) * 0.1 + inv(i.decay) * 0.05
  );
}

export function detectContinuityDissonance(i: ContinuityCoherenceInputs): number {
  return clamp(i.dissonance * 0.6 + i.inconsistency * 0.4);
}

export function estimateStrategicPersistence(i: ContinuityCoherenceInputs): number {
  return clamp(i.persistence * 0.5 + i.endurance * 0.3 + inv(i.decay) * 0.2);
}

export function detectTemporalInconsistency(i: ContinuityCoherenceInputs): number {
  return clamp(i.inconsistency * 0.7 + inv(i.endurance) * 0.3);
}

export function estimateContinuityResilience(i: ContinuityCoherenceInputs): number {
  return clamp(i.resilience * 0.6 + i.persistence * 0.4);
}

export function classifyContinuityCoherence(score: number): ContinuityCoherenceVerdict {
  if (score >= 88) return "continuous";
  if (score >= 72) return "resilient";
  if (score >= 58) return "stable";
  if (score >= 42) return "unstable";
  return "broken";
}

export interface ContinuityCoherencePoint {
  step: number;
  expected: number;
}

export function buildContinuityCoherenceProjection(i: ContinuityCoherenceInputs): ContinuityCoherencePoint[] {
  const base = calculateContinuityCoherence(i);
  const drag = (i.decay + i.dissonance) / 400;
  return Array.from({ length: 8 }, (_, k) => ({
    step: k,
    expected: clamp(base - k * drag * 10 + (i.resilience / 100) * (k % 3)),
  }));
}
