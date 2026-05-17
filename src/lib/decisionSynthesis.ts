/**
 * Phase 15.3 — Decision Synthesis. Pure helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface SignalBundle {
  primary: number; supporting: number[]; noise: number;
}

const synth = (b: SignalBundle): number => {
  const sup = b.supporting.length ? b.supporting.reduce((a, x) => a + x, 0) / b.supporting.length : b.primary;
  return clamp(b.primary * 0.6 + sup * 0.4 - b.noise * 0.25);
};

export const synthesizeStrategicSignals = (b: SignalBundle) => synth(b);
export const synthesizeOperationalSignals = (b: SignalBundle) => synth(b);
export const synthesizeAuthoritySignals = (b: SignalBundle) => synth(b);
export const synthesizeSemanticSignals = (b: SignalBundle) => synth(b);
export const synthesizeGovernanceSignals = (b: SignalBundle) => synth(b);

export interface DecisionSynthesisInput {
  strategic: SignalBundle;
  operational: SignalBundle;
  authority: SignalBundle;
  semantic: SignalBundle;
  governance: SignalBundle;
  consensusScore: number; // 0..100
  conflictScore: number;  // 0..100
  latencyScore: number;   // 0..100 (lower = faster)
}

export interface DecisionSynthesisResult {
  synthesis_score: number;
  confidence_score: number;
  consistency_score: number;
  instability_score: number;
  latency_score: number;
  layer_scores: Record<string, number>;
}

export function calculateDecisionConfidence(i: DecisionSynthesisInput): number {
  const layers = [
    synthesizeStrategicSignals(i.strategic),
    synthesizeOperationalSignals(i.operational),
    synthesizeAuthoritySignals(i.authority),
    synthesizeSemanticSignals(i.semantic),
    synthesizeGovernanceSignals(i.governance),
  ];
  const mean = layers.reduce((a, b) => a + b, 0) / layers.length;
  return clamp(mean * 0.7 + i.consensusScore * 0.3 - i.conflictScore * 0.2);
}

export function calculateDecisionConsistency(i: DecisionSynthesisInput): number {
  const layers = [
    synthesizeStrategicSignals(i.strategic),
    synthesizeOperationalSignals(i.operational),
    synthesizeAuthoritySignals(i.authority),
    synthesizeSemanticSignals(i.semantic),
    synthesizeGovernanceSignals(i.governance),
  ];
  const mean = layers.reduce((a, b) => a + b, 0) / layers.length;
  const variance = layers.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / layers.length;
  return clamp(100 - Math.sqrt(variance) * 1.5);
}

export function detectDecisionInstability(i: DecisionSynthesisInput): number {
  return clamp(i.conflictScore * 0.6 + (100 - i.consensusScore) * 0.4);
}

export function detectDecisionLatency(i: DecisionSynthesisInput): number {
  return clamp(i.latencyScore);
}

export function buildDecisionSynthesis(i: DecisionSynthesisInput): DecisionSynthesisResult {
  const layer_scores: Record<string, number> = {
    strategic: synthesizeStrategicSignals(i.strategic),
    operational: synthesizeOperationalSignals(i.operational),
    authority: synthesizeAuthoritySignals(i.authority),
    semantic: synthesizeSemanticSignals(i.semantic),
    governance: synthesizeGovernanceSignals(i.governance),
  };
  const confidence = calculateDecisionConfidence(i);
  const consistency = calculateDecisionConsistency(i);
  const instability = detectDecisionInstability(i);
  const latency = detectDecisionLatency(i);
  const synthesis = clamp(confidence * 0.5 + consistency * 0.4 - instability * 0.15);
  return {
    synthesis_score: synthesis,
    confidence_score: confidence,
    consistency_score: consistency,
    instability_score: instability,
    latency_score: latency,
    layer_scores,
  };
}
