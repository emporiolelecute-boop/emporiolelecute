/**
 * Fase 16.0 — Resilience Unification (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ResilienceUnificationInputs {
  resilience: number;
  recovery: number;
  synchronization: number;
  cascadeWeakness: number;
  fragility: number;
}

export function calculateUnifiedResilience(i: ResilienceUnificationInputs): number {
  return avg([i.resilience, i.recovery, i.synchronization, inv(i.cascadeWeakness), inv(i.fragility)]);
}
export function estimateSystemicRecoveryCapacity(i: ResilienceUnificationInputs): number {
  return avg([i.recovery, i.resilience, inv(i.fragility)]);
}
export function detectCascadeWeakness(i: ResilienceUnificationInputs): string[] {
  const out: string[] = [];
  if (i.cascadeWeakness > 45) out.push("Fragilidade em cascata entre camadas");
  if (i.fragility > 50) out.push("Fragilidade estrutural elevada");
  return out;
}
export function estimateResilienceSynchronization(i: ResilienceUnificationInputs): number {
  return avg([i.synchronization, i.resilience, inv(i.cascadeWeakness)]);
}
export function estimateContinuityResilience(i: ResilienceUnificationInputs): number {
  return avg([i.resilience, i.recovery, i.synchronization, inv(i.fragility)]);
}
