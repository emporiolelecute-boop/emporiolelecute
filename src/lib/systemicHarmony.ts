/**
 * Fase 16.0 — Systemic Harmony (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SystemicHarmonyInputs {
  alignment: number;
  synchronization: number;
  coherence: number;
  dissonance: number;
  asymmetry: number;
}

export function calculateSystemicHarmony(i: SystemicHarmonyInputs): number {
  return avg([i.alignment, i.synchronization, i.coherence, inv(i.dissonance), inv(i.asymmetry)]);
}
export function estimateCrossLayerAlignment(i: SystemicHarmonyInputs): number {
  return avg([i.alignment, i.coherence, inv(i.asymmetry)]);
}
export function detectLayerDissonance(i: SystemicHarmonyInputs): string[] {
  const out: string[] = [];
  if (i.dissonance > 50) out.push("Dissonância entre camadas detectada");
  if (i.asymmetry > 50) out.push("Assimetria estratégica relevante");
  return out;
}
export function detectStrategicAsymmetry(i: SystemicHarmonyInputs): string[] {
  const out: string[] = [];
  if (i.asymmetry > 45) out.push("Assimetria persistente entre camadas");
  if (i.alignment < 55) out.push("Alinhamento estratégico abaixo do ideal");
  return out;
}
export function estimateOperationalSynchronization(i: SystemicHarmonyInputs): number {
  return avg([i.synchronization, i.coherence, inv(i.dissonance)]);
}
