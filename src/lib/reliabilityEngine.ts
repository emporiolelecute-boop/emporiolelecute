/**
 * Phase 15.4 — Reliability Engine.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (...xs: number[]) => {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
};

export interface ReliabilityInputs {
  consensus: number;
  observability: number;
  explainability: number;
  decisionSynthesis: number;
  reasoningIntegrity: number;
  semanticStability: number;
  conflictDensity: number;
  contradictionPressure: number;
  decayRisk: number;
}

export function calculateReasoningReliability(i: ReliabilityInputs): number {
  return clamp(
    avg(i.reasoningIntegrity, i.consensus, i.explainability) - i.conflictDensity * 0.2,
  );
}

export function calculateDecisionReliability(i: ReliabilityInputs): number {
  return clamp(
    i.decisionSynthesis * 0.5 + i.consensus * 0.3 + (100 - i.contradictionPressure) * 0.2,
  );
}

export function calculateForecastReliability(i: ReliabilityInputs): number {
  return clamp(
    avg(i.semanticStability, i.observability, i.reasoningIntegrity) - i.decayRisk * 0.3,
  );
}

export function calculateSystemReliability(i: ReliabilityInputs): number {
  return clamp(
    avg(
      calculateReasoningReliability(i),
      calculateDecisionReliability(i),
      calculateForecastReliability(i),
    ),
  );
}

export function detectReliabilityCollapse(i: ReliabilityInputs): number {
  return clamp(100 - calculateSystemReliability(i) + i.decayRisk * 0.2);
}

export function detectInconsistentReasoning(i: ReliabilityInputs): number {
  return clamp(i.conflictDensity * 0.5 + i.contradictionPressure * 0.3 + (100 - i.consensus) * 0.2);
}

export function estimateReliabilityDecay(samples: number[]): number {
  if (samples.length < 2) return 0;
  let drop = 0;
  for (let i = 1; i < samples.length; i++) {
    const d = samples[i - 1] - samples[i];
    if (d > 0) drop += d;
  }
  return clamp(drop / (samples.length - 1));
}
