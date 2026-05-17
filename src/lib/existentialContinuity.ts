/**
 * Fase 15.7 — Existential Continuity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ExistentialInputs {
  stability: number;
  resilience: number;
  longevity: number;
  identity: number;
  fragility: number;
  collapseRisk: number;
  decay: number;
}

export function calculateExistentialStability(i: ExistentialInputs): number {
  return avg([i.stability, i.resilience, i.identity, inv(i.fragility)]);
}
export function detectStructuralFragility(i: ExistentialInputs): string[] {
  const out: string[] = [];
  if (i.fragility > 50) out.push("Fragilidade estrutural elevada");
  if (i.collapseRisk > 50) out.push("Risco de colapso sistêmico");
  if (i.decay > 50) out.push("Decaimento acumulado");
  return out;
}
export function estimateStrategicLongevity(i: ExistentialInputs): number {
  return avg([i.longevity, i.resilience, inv(i.decay)]);
}
export function estimateCollapseResistance(i: ExistentialInputs): number {
  return avg([i.resilience, inv(i.collapseRisk), inv(i.fragility)]);
}
export function estimateEvolutionarySurvivability(i: ExistentialInputs): number {
  return avg([i.longevity, i.resilience, i.identity, inv(i.collapseRisk), inv(i.decay)]);
}
