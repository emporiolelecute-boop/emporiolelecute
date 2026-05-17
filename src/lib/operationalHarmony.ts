/**
 * Fase 16.0 — Operational Harmony (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface OperationalHarmonyInputs {
  flow: number;
  synchronization: number;
  reliability: number;
  conflict: number;
  noise: number;
}

export function calculateOperationalHarmony(i: OperationalHarmonyInputs): number {
  return avg([i.flow, i.synchronization, i.reliability, inv(i.conflict), inv(i.noise)]);
}
export function estimateExecutionSynchronization(i: OperationalHarmonyInputs): number {
  return avg([i.synchronization, i.reliability, inv(i.conflict)]);
}
export function detectOperationalConflict(i: OperationalHarmonyInputs): string[] {
  const out: string[] = [];
  if (i.conflict > 50) out.push("Conflito operacional ativo");
  if (i.noise > 50) out.push("Ruído de execução elevado");
  return out;
}
export function estimateOperationalFlow(i: OperationalHarmonyInputs): number {
  return avg([i.flow, i.synchronization, inv(i.noise)]);
}
export function detectExecutionNoise(i: OperationalHarmonyInputs): string[] {
  const out: string[] = [];
  if (i.noise > 45) out.push("Ruído acumulado na execução");
  if (i.flow < 55) out.push("Fluxo operacional abaixo do ideal");
  return out;
}
