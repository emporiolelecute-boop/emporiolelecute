/**
 * Phase 15.3 — Cognitive Resilience. Pure helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface CognitiveResilienceInputs {
  stability: number;       // 0..100
  synthesis: number;       // 0..100
  reasoning: number;       // 0..100
  noise: number;           // 0..100 (higher worse)
  fragmentation: number;   // 0..100 (higher worse)
  conflictDensity: number; // 0..100 (higher worse)
  cognitiveLoad: number;   // 0..100 (higher worse)
  observability: number;   // 0..100
  consensus: number;       // 0..100
}

export function calculateCognitiveResilience(i: CognitiveResilienceInputs): number {
  const positive = (i.stability + i.synthesis + i.reasoning + i.observability + i.consensus) / 5;
  const penalty = (i.noise + i.fragmentation + i.conflictDensity + i.cognitiveLoad) / 4;
  return clamp(positive - penalty * 0.55);
}

export function estimateCognitiveDecay(i: CognitiveResilienceInputs): number {
  return clamp(
    i.cognitiveLoad * 0.35 + i.noise * 0.3 + i.fragmentation * 0.2 + (100 - i.observability) * 0.15,
  );
}

export function estimateStrategicSurvival(i: CognitiveResilienceInputs): number {
  return clamp(calculateCognitiveResilience(i) * 0.7 + i.consensus * 0.3 - estimateCognitiveDecay(i) * 0.2);
}

export function estimateSignalStability(i: CognitiveResilienceInputs): number {
  return clamp(i.stability * 0.5 + i.reasoning * 0.3 + i.observability * 0.2 - i.noise * 0.2);
}

export function detectCognitiveCollapseRisk(i: CognitiveResilienceInputs): number {
  return clamp(
    (100 - calculateCognitiveResilience(i)) * 0.5 +
      estimateCognitiveDecay(i) * 0.3 +
      i.conflictDensity * 0.2,
  );
}

export function detectReasoningExhaustion(i: CognitiveResilienceInputs): number {
  return clamp(i.cognitiveLoad * 0.5 + i.fragmentation * 0.3 + (100 - i.reasoning) * 0.2);
}
