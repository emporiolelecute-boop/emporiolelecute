/**
 * Fase 15.9 — Entropy Resistance (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface EntropyResistanceInputs {
  structure: number;
  durability: number;
  persistence: number;
  entropy: number;
  acceleration: number;
  pressure: number;
}

export function calculateEntropyResistance(i: EntropyResistanceInputs): number {
  return avg([i.structure, i.durability, i.persistence, inv(i.entropy), inv(i.pressure)]);
}
export function detectEntropyAcceleration(i: EntropyResistanceInputs): string[] {
  const out: string[] = [];
  if (i.acceleration > 50) out.push("Aceleração entrópica detectada");
  if (i.entropy > 55) out.push("Entropia sistêmica alta");
  return out;
}
export function estimateStructuralPersistence(i: EntropyResistanceInputs): number {
  return avg([i.structure, i.durability, inv(i.entropy)]);
}
export function estimateDecayPressure(i: EntropyResistanceInputs): number {
  return avg([i.pressure, i.acceleration, i.entropy]);
}
export function estimateSystemicDurability(i: EntropyResistanceInputs): number {
  return avg([i.durability, i.persistence, i.structure, inv(i.acceleration)]);
}
