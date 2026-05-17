/**
 * Fase 15.7 — Longitudinal Consistency (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface LongitudinalInputs {
  consistency: number;
  identity: number;
  continuity: number;
  narrativeStability: number;
  drift: number;
  mutation: number;
}

export function calculateLongitudinalConsistency(i: LongitudinalInputs): number {
  return avg([i.consistency, i.continuity, i.narrativeStability, inv(i.drift)]);
}
export function detectStrategicDeviation(i: LongitudinalInputs): number {
  return clamp(i.drift * 0.6 + i.mutation * 0.4);
}
export function detectNarrativeMutation(i: LongitudinalInputs): string[] {
  const out: string[] = [];
  if (i.mutation > 50) out.push("Mutação narrativa detectada");
  if (i.drift > 50) out.push("Drift narrativo sustentado");
  if (i.narrativeStability < 55) out.push("Estabilidade narrativa baixa");
  return out;
}
export function estimateContinuityStrength(i: LongitudinalInputs): number {
  return avg([i.continuity, i.consistency, inv(i.mutation)]);
}
export function estimateIdentityPersistence(i: LongitudinalInputs): number {
  return avg([i.identity, i.consistency, i.continuity, inv(i.drift)]);
}
