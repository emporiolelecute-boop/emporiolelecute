/**
 * Fase 15.8 — Semantic Grounding (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SemanticGroundingInputs {
  grounding: number;
  knowledge: number;
  hallucination: number;
  authorityInflation: number;
  evidence: number;
  consistency: number;
}

export function calculateSemanticGrounding(i: SemanticGroundingInputs): number {
  return avg([i.grounding, i.evidence, i.consistency, inv(i.hallucination)]);
}
export function detectSemanticHallucination(i: SemanticGroundingInputs): number {
  return clamp(i.hallucination * 0.7 + i.authorityInflation * 0.3);
}
export function detectAuthorityInflation(i: SemanticGroundingInputs): string[] {
  const out: string[] = [];
  if (i.authorityInflation > 50) out.push("Autoridade inflada além da evidência");
  if (i.hallucination > 50) out.push("Hallucination semântica recorrente");
  if (i.evidence < 55) out.push("Lastro evidencial insuficiente");
  return out;
}
export function estimateSemanticReality(i: SemanticGroundingInputs): number {
  return avg([i.grounding, i.evidence, inv(i.hallucination), inv(i.authorityInflation)]);
}
export function estimateKnowledgeGrounding(i: SemanticGroundingInputs): number {
  return avg([i.knowledge, i.evidence, i.consistency]);
}
