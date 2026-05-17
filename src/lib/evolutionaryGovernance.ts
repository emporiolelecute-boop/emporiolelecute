/**
 * Fase 15.6 — Evolutionary Governance (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface EvolutionInputs {
  consistency: number;
  resilience: number;
  governance: number;
  drift: number;
  fragmentation: number;
  decayRate: number;
  longevity: number;
  scalability: number;
}

export function estimateEvolutionaryStability(i: EvolutionInputs): number {
  return avg([i.consistency, i.resilience, inv(i.drift), inv(i.fragmentation)]);
}
export function estimateAdaptiveConsistency(i: EvolutionInputs): number {
  return avg([i.consistency, i.governance, inv(i.decayRate)]);
}
export function detectEvolutionaryRegression(i: EvolutionInputs): boolean {
  return i.decayRate > 45 || i.drift > 50;
}
export function detectGovernanceMutationRisk(i: EvolutionInputs): number {
  return clamp((i.drift * 0.4) + (i.fragmentation * 0.3) + (i.decayRate * 0.3));
}
export function estimateLongTermEvolutionCapacity(i: EvolutionInputs): number {
  return avg([i.longevity, i.scalability, i.resilience, inv(i.decayRate)]);
}
