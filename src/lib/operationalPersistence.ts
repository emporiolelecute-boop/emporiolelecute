/**
 * Fase 15.9 — Operational Persistence (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface OperationalPersistenceInputs {
  durability: number;
  reliability: number;
  maintenance: number;
  longevity: number;
  decay: number;
  fatigue: number;
}

export function calculateOperationalPersistence(i: OperationalPersistenceInputs): number {
  return avg([i.durability, i.reliability, i.maintenance, i.longevity, inv(i.decay), inv(i.fatigue)]);
}
export function estimateExecutionDurability(i: OperationalPersistenceInputs): number {
  return avg([i.durability, i.reliability, inv(i.fatigue)]);
}
export function detectExecutionDecay(i: OperationalPersistenceInputs): string[] {
  const out: string[] = [];
  if (i.decay > 50) out.push("Decaimento contínuo de execução");
  if (i.fatigue > 50) out.push("Fadiga operacional sistêmica");
  if (i.maintenance < 50) out.push("Manutenção insuficiente");
  return out;
}
export function estimateOperationalLongevity(i: OperationalPersistenceInputs): number {
  return avg([i.longevity, i.durability, inv(i.decay)]);
}
export function estimateMaintenanceSustainability(i: OperationalPersistenceInputs): number {
  return avg([i.maintenance, i.reliability, inv(i.fatigue)]);
}
