/**
 * Fase 15.9 — Resilience Continuum (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ResilienceContinuumInputs {
  resilience: number;
  recovery: number;
  elasticity: number;
  fragility: number;
  weakening: number;
}

export function calculateResilienceContinuity(i: ResilienceContinuumInputs): number {
  return avg([i.resilience, i.recovery, i.elasticity, inv(i.fragility), inv(i.weakening)]);
}
export function estimateRecoveryPersistence(i: ResilienceContinuumInputs): number {
  return avg([i.recovery, i.elasticity, inv(i.weakening)]);
}
export function detectResilienceWeakening(i: ResilienceContinuumInputs): string[] {
  const out: string[] = [];
  if (i.weakening > 50) out.push("Resiliência em enfraquecimento");
  if (i.fragility > 50) out.push("Fragilidade estrutural elevada");
  return out;
}
export function estimateLongTermRecoveryCapacity(i: ResilienceContinuumInputs): number {
  return avg([i.recovery, i.resilience, inv(i.fragility)]);
}
export function estimateContinuumElasticity(i: ResilienceContinuumInputs): number {
  return avg([i.elasticity, i.recovery, inv(i.weakening)]);
}
