/**
 * Fase 15.9 — Semantic Continuity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface SemanticContinuityInputs {
  topical: number;
  knowledge: number;
  coherence: number;
  decay: number;
  fragmentation: number;
  instability: number;
}

export function calculateSemanticContinuity(i: SemanticContinuityInputs): number {
  return avg([i.topical, i.knowledge, i.coherence, inv(i.decay), inv(i.fragmentation)]);
}
export function detectSemanticDecay(i: SemanticContinuityInputs): string[] {
  const out: string[] = [];
  if (i.decay > 50) out.push("Decaimento semântico ativo");
  if (i.instability > 50) out.push("Instabilidade semântica recorrente");
  return out;
}
export function estimateTopicalPersistence(i: SemanticContinuityInputs): number {
  return avg([i.topical, i.coherence, inv(i.fragmentation)]);
}
export function estimateKnowledgeLongevity(i: SemanticContinuityInputs): number {
  return avg([i.knowledge, i.coherence, inv(i.decay)]);
}
export function detectSemanticFragmentation(i: SemanticContinuityInputs): string[] {
  const out: string[] = [];
  if (i.fragmentation > 45) out.push("Fragmentação temática detectada");
  if (i.coherence < 55) out.push("Coerência semântica fragilizada");
  return out;
}
