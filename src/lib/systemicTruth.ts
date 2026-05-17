/**
 * Fase 15.8 — Systemic Truth (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SystemicTruthInputs {
  truth: number;
  coherence: number;
  consistency: number;
  contradictions: number;
  falsehoods: number;
  narrativeDrift: number;
}

export function calculateSystemicTruth(i: SystemicTruthInputs): number {
  return avg([i.truth, i.coherence, i.consistency, inv(i.contradictions), inv(i.falsehoods)]);
}
export function calculateStrategicCoherence(i: SystemicTruthInputs): number {
  return avg([i.coherence, i.consistency, inv(i.narrativeDrift)]);
}
export function detectNarrativeFalsehoods(i: SystemicTruthInputs): string[] {
  const out: string[] = [];
  if (i.falsehoods > 50) out.push("Falsidades narrativas sustentadas");
  if (i.narrativeDrift > 50) out.push("Drift narrativo amplificando distorções");
  return out;
}
export function detectSystemicContradictions(i: SystemicTruthInputs): string[] {
  const out: string[] = [];
  if (i.contradictions > 50) out.push("Contradições sistêmicas críticas");
  if (i.coherence < 55 && i.consistency < 55) out.push("Coerência e consistência abaixo do limiar");
  return out;
}
export function estimateRealityConsistency(i: SystemicTruthInputs): number {
  return avg([i.consistency, i.coherence, inv(i.contradictions), inv(i.falsehoods)]);
}
