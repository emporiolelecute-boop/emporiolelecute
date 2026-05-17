/**
 * Fase 16.0 — Semantic Alignment (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SemanticAlignmentInputs {
  alignment: number;
  coherence: number;
  knowledge: number;
  drift: number;
  fragmentation: number;
}

export function calculateSemanticAlignment(i: SemanticAlignmentInputs): number {
  return avg([i.alignment, i.coherence, i.knowledge, inv(i.drift), inv(i.fragmentation)]);
}
export function detectSemanticDrift(i: SemanticAlignmentInputs): string[] {
  const out: string[] = [];
  if (i.drift > 50) out.push("Drift semântico acumulado");
  if (i.coherence < 55) out.push("Coerência semântica fragilizada");
  return out;
}
export function estimateSemanticCoherence(i: SemanticAlignmentInputs): number {
  return avg([i.coherence, i.alignment, inv(i.drift)]);
}
export function detectSemanticFragmentation(i: SemanticAlignmentInputs): string[] {
  const out: string[] = [];
  if (i.fragmentation > 45) out.push("Fragmentação semântica detectada");
  if (i.knowledge < 55) out.push("Integridade de conhecimento baixa");
  return out;
}
export function estimateKnowledgeIntegrity(i: SemanticAlignmentInputs): number {
  return avg([i.knowledge, i.coherence, inv(i.fragmentation)]);
}
