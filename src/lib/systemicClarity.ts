/**
 * Fase 15.7 — Systemic Clarity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ClarityInputs {
  clarity: number;
  transparency: number;
  legibility: number;
  semanticFog: number;
  noise: number;
  ambiguity: number;
}

export function calculateSystemicClarity(i: ClarityInputs): number {
  return avg([i.clarity, i.transparency, inv(i.semanticFog), inv(i.noise)]);
}
export function calculateOperationalTransparency(i: ClarityInputs): number {
  return avg([i.transparency, i.legibility, inv(i.ambiguity)]);
}
export function detectStrategicNoise(i: ClarityInputs): number {
  return clamp(i.noise * 0.6 + i.ambiguity * 0.4);
}
export function detectSemanticFog(i: ClarityInputs): number {
  return clamp(i.semanticFog * 0.7 + i.ambiguity * 0.3);
}
export function estimateDecisionLegibility(i: ClarityInputs): number {
  return avg([i.legibility, i.transparency, inv(i.semanticFog), inv(i.noise)]);
}
