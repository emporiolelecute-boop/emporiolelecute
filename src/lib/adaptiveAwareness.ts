/**
 * Fase 15.7 — Adaptive Awareness (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface AdaptiveInputs {
  adaptability: number;
  resilience: number;
  evolution: number;
  consistency: number;
  fatigue: number;
  regression: number;
  rigidity: number;
}

export function calculateAdaptiveMaturity(i: AdaptiveInputs): number {
  return avg([i.adaptability, i.evolution, i.consistency, inv(i.rigidity)]);
}
export function estimateEvolutionaryCapacity(i: AdaptiveInputs): number {
  return avg([i.evolution, i.adaptability, i.resilience, inv(i.regression)]);
}
export function detectAdaptationFatigue(i: AdaptiveInputs): number {
  return clamp(i.fatigue * 0.6 + i.regression * 0.4);
}
export function detectAdaptiveRegression(i: AdaptiveInputs): string[] {
  const out: string[] = [];
  if (i.regression > 50) out.push("Regressão adaptativa em curso");
  if (i.rigidity > 60) out.push("Rigidez sistêmica elevada");
  if (i.fatigue > 60) out.push("Fadiga adaptativa crítica");
  return out;
}
export function estimateLongTermAdaptability(i: AdaptiveInputs): number {
  return avg([i.evolution, i.adaptability, inv(i.fatigue), inv(i.rigidity)]);
}
