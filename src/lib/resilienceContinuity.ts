/**
 * Phase 16.2 — Resilience Continuity (pure, read-only).
 */
export type ResilienceVerdict = "durable" | "resilient" | "stable" | "vulnerable" | "exhausted";

export interface ResilienceContinuityInputs {
  recoveryCohesion: number;
  recoveryDurability: number;
  fatigue: number;
  weakSpots: number;
  recoveryVelocity: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateResilienceContinuity(i: ResilienceContinuityInputs): number {
  return clamp(
    i.recoveryCohesion * 0.35 +
    i.recoveryDurability * 0.3 +
    i.recoveryVelocity * 0.15 +
    inv(i.fatigue) * 0.1 +
    inv(i.weakSpots) * 0.1
  );
}

export function estimateRecoveryCohesion(i: ResilienceContinuityInputs): number {
  return clamp(i.recoveryCohesion);
}

export function detectRecoveryWeakness(i: ResilienceContinuityInputs): number {
  return clamp(i.weakSpots);
}

export function estimateRecoveryDurability(i: ResilienceContinuityInputs): number {
  return clamp(i.recoveryDurability);
}

export function detectResilienceFatigue(i: ResilienceContinuityInputs): number {
  return clamp(i.fatigue);
}

export interface ContinuityProjectionPoint { horizon: string; projected: number; }

export function buildContinuityProjection(i: ResilienceContinuityInputs): ContinuityProjectionPoint[] {
  const base = calculateResilienceContinuity(i);
  const fatigueDecay = i.fatigue / 100;
  return [
    { horizon: "30d", projected: clamp(base - fatigueDecay * 3) },
    { horizon: "60d", projected: clamp(base - fatigueDecay * 7) },
    { horizon: "90d", projected: clamp(base - fatigueDecay * 11) },
    { horizon: "180d", projected: clamp(base - fatigueDecay * 18) },
  ];
}

export function classifyResilience(score: number): ResilienceVerdict {
  if (score >= 85) return "durable";
  if (score >= 70) return "resilient";
  if (score >= 55) return "stable";
  if (score >= 40) return "vulnerable";
  return "exhausted";
}
