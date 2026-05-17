/**
 * Fase 15.7 — Cognitive Stability (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface CognitiveStabilityInputs {
  reasoning: number;
  consistency: number;
  resilience: number;
  focus: number;
  fragmentation: number;
  confusion: number;
  conflicts: number;
  noise: number;
}

export function calculateCognitiveStability(i: CognitiveStabilityInputs): number {
  return avg([i.reasoning, i.consistency, i.resilience, inv(i.fragmentation), inv(i.noise)]);
}
export function calculateDecisionConsistency(i: CognitiveStabilityInputs): number {
  return avg([i.consistency, i.reasoning, inv(i.conflicts), inv(i.confusion)]);
}
export function detectReasoningInstability(i: CognitiveStabilityInputs): string[] {
  const out: string[] = [];
  if (i.noise > 50) out.push("Ruído cognitivo elevado");
  if (i.fragmentation > 50) out.push("Fragmentação de raciocínio");
  if (i.reasoning < 55) out.push("Reasoning operacional fraco");
  return out;
}
export function detectStrategicConflicts(i: CognitiveStabilityInputs): string[] {
  const out: string[] = [];
  if (i.conflicts > 50) out.push("Conflitos estratégicos ativos");
  if (i.confusion > 60) out.push("Confusão estratégica crítica");
  return out;
}
export function estimateCognitiveResilience(i: CognitiveStabilityInputs): number {
  return avg([i.resilience, i.focus, inv(i.fragmentation), inv(i.conflicts)]);
}
export function estimateStrategicFocus(i: CognitiveStabilityInputs): number {
  return avg([i.focus, inv(i.noise), inv(i.confusion), i.consistency]);
}
