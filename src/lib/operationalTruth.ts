/**
 * Fase 15.8 — Operational Truth (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface OperationalTruthInputs {
  honesty: number;
  reliability: number;
  transparency: number;
  reproducibility: number;
  artificialMomentum: number;
  fiction: number;
  noise: number;
}

export function calculateOperationalTruth(i: OperationalTruthInputs): number {
  return avg([i.honesty, i.reliability, i.transparency, inv(i.fiction), inv(i.artificialMomentum)]);
}
export function estimateExecutionHonesty(i: OperationalTruthInputs): number {
  return avg([i.honesty, i.reproducibility, inv(i.fiction)]);
}
export function detectOperationalFiction(i: OperationalTruthInputs): string[] {
  const out: string[] = [];
  if (i.fiction > 50) out.push("Indicadores operacionais inflados");
  if (i.artificialMomentum > 50) out.push("Momentum artificial detectado");
  if (i.honesty < 55) out.push("Baixa honestidade de execução");
  return out;
}
export function detectArtificialMomentum(i: OperationalTruthInputs): number {
  return clamp(i.artificialMomentum * 0.6 + i.fiction * 0.4);
}
export function estimateExecutionReliability(i: OperationalTruthInputs): number {
  return avg([i.reliability, i.reproducibility, inv(i.noise), inv(i.fiction)]);
}
export function estimateOperationalTransparency(i: OperationalTruthInputs): number {
  return avg([i.transparency, i.honesty, inv(i.noise)]);
}
