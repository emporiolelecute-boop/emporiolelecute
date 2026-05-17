/**
 * Fase 16.0 — Strategic Truth Alignment (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface StrategicTruthInputs {
  truth: number;
  narrative: number;
  reality: number;
  falseSignals: number;
  contradictions: number;
}

export function calculateStrategicTruth(i: StrategicTruthInputs): number {
  return avg([i.truth, i.narrative, i.reality, inv(i.falseSignals), inv(i.contradictions)]);
}
export function estimateNarrativeIntegrity(i: StrategicTruthInputs): number {
  return avg([i.narrative, i.truth, inv(i.contradictions)]);
}
export function detectStrategicFalseSignals(i: StrategicTruthInputs): string[] {
  const out: string[] = [];
  if (i.falseSignals > 45) out.push("Sinais estratégicos falsos detectados");
  if (i.truth < 55) out.push("Verdade estratégica abaixo do ideal");
  return out;
}
export function estimateRealityAlignment(i: StrategicTruthInputs): number {
  return avg([i.reality, i.truth, inv(i.falseSignals)]);
}
export function detectStrategicContradictions(i: StrategicTruthInputs): string[] {
  const out: string[] = [];
  if (i.contradictions > 45) out.push("Contradições estratégicas ativas");
  if (i.narrative < 55) out.push("Narrativa estratégica fragilizada");
  return out;
}
