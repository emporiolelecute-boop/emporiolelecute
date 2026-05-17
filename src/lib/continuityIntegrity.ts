/**
 * Phase 16.3 — Continuity Integrity (pure, read-only).
 */
export type ContinuityVerdict = "continuous" | "resilient" | "stable" | "unstable" | "broken";

export interface ContinuityIntegrityInputs {
  persistence: number;
  recovery: number;
  decay: number;
  fractures: number;
  endurance: number;
  momentum: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateContinuityIntegrity(i: ContinuityIntegrityInputs): number {
  return clamp(
    i.persistence * 0.3 + i.endurance * 0.2 + i.momentum * 0.15 +
    i.recovery * 0.15 + inv(i.decay) * 0.1 + inv(i.fractures) * 0.1
  );
}

export function detectContinuityFractures(i: ContinuityIntegrityInputs): number {
  return clamp(i.fractures * 0.7 + inv(i.endurance) * 0.3);
}

export function estimateStrategicContinuity(i: ContinuityIntegrityInputs): number {
  return clamp(i.persistence * 0.5 + i.endurance * 0.3 + i.momentum * 0.2);
}

export function detectPersistenceDecay(i: ContinuityIntegrityInputs): number {
  return clamp(i.decay * 0.6 + inv(i.persistence) * 0.4);
}

export function estimateRecoveryIntegrity(i: ContinuityIntegrityInputs): number {
  return clamp(i.recovery * 0.7 + inv(i.fractures) * 0.3);
}

export function classifyContinuity(score: number): ContinuityVerdict {
  if (score >= 88) return "continuous";
  if (score >= 72) return "resilient";
  if (score >= 58) return "stable";
  if (score >= 42) return "unstable";
  return "broken";
}

export interface ContinuityProjectionPoint {
  step: number;
  expected: number;
}

export function buildContinuityIntegrityProjection(i: ContinuityIntegrityInputs): ContinuityProjectionPoint[] {
  const base = calculateContinuityIntegrity(i);
  const decay = i.decay / 200;
  return Array.from({ length: 8 }, (_, k) => ({
    step: k,
    expected: clamp(base - k * decay * 10 + (i.recovery / 100) * (k % 3)),
  }));
}
