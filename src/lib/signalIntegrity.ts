/**
 * Fase 15.8 — Signal Integrity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SignalInputs {
  clarity: number;
  trust: number;
  fidelity: number;
  noise: number;
  pollution: number;
  bias: number;
}

export function calculateSignalClarity(i: SignalInputs): number {
  return avg([i.clarity, i.fidelity, inv(i.noise), inv(i.pollution)]);
}
export function detectSignalPollution(i: SignalInputs): number {
  return clamp(i.pollution * 0.6 + i.noise * 0.3 + i.bias * 0.1);
}
export function detectStrategicNoise(i: SignalInputs): string[] {
  const out: string[] = [];
  if (i.noise > 50) out.push("Ruído estratégico elevado");
  if (i.pollution > 50) out.push("Poluição de sinal sustentada");
  if (i.bias > 50) out.push("Viés sistemático nos canais");
  return out;
}
export function estimateDecisionSignalStrength(i: SignalInputs): number {
  return avg([i.clarity, i.trust, i.fidelity, inv(i.noise)]);
}
export function estimateSignalTrustworthiness(i: SignalInputs): number {
  return avg([i.trust, i.fidelity, inv(i.bias), inv(i.pollution)]);
}
