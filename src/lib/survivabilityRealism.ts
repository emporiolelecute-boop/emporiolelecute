/**
 * Fase 15.8 — Survivability Realism (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SurvivabilityInputs {
  viability: number;
  resilience: number;
  recovery: number;
  fragility: number;
  collapseRisk: number;
  falseResilience: number;
  survivalGap: number;
}

export function calculateLongTermViability(i: SurvivabilityInputs): number {
  return avg([i.viability, i.resilience, i.recovery, inv(i.fragility)]);
}
export function estimateCollapseProbability(i: SurvivabilityInputs): number {
  return clamp(i.collapseRisk * 0.6 + i.fragility * 0.3 + i.survivalGap * 0.1);
}
export function estimateRecoveryReality(i: SurvivabilityInputs): number {
  return avg([i.recovery, i.resilience, inv(i.falseResilience)]);
}
export function detectFalseResilience(i: SurvivabilityInputs): string[] {
  const out: string[] = [];
  if (i.falseResilience > 50) out.push("Resiliência aparente sem lastro real");
  if (i.fragility > 50 && i.resilience > 70) out.push("Resiliência declarada incompatível com fragilidade");
  if (i.survivalGap > 50) out.push("Gap de sobrevivência crescente");
  return out;
}
export function estimateSurvivalIntegrity(i: SurvivabilityInputs): number {
  return avg([i.viability, i.resilience, i.recovery, inv(i.collapseRisk), inv(i.falseResilience)]);
}
