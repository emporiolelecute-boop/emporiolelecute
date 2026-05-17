/**
 * Fase 15.5 — Systemic Strategy Layer (pure helpers).
 */

const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface StrategyLayerInputs {
  coherence: number;
  alignment: number;
  governance: number;
  semanticIntegrity: number;
  authorityBalance: number;
  observability: number;
  fragmentation: number;
  noise: number;
  drift: number;
  conflicts: number;
}

export interface StrategyLayerOutput {
  strategy_score: number;
  continuity: number;
  integrity: number;
  propagation: number;
  compression: number;
  overload: boolean;
  drift_detected: boolean;
  noise_detected: boolean;
  narrative: string;
}

export function calculateStrategicContinuity(i: StrategyLayerInputs): number {
  return avg([i.coherence, i.alignment, i.governance, inv(i.drift)]);
}
export function calculateStrategicIntegrity(i: StrategyLayerInputs): number {
  return avg([i.semanticIntegrity, i.authorityBalance, inv(i.conflicts)]);
}
export function calculateStrategicPropagation(i: StrategyLayerInputs): number {
  return avg([i.alignment, i.observability, inv(i.fragmentation)]);
}
export function calculateStrategicCompression(i: StrategyLayerInputs): number {
  return avg([inv(i.noise), inv(i.fragmentation), i.coherence]);
}
export function detectStrategicOverload(i: StrategyLayerInputs): boolean {
  return i.noise > 50 || i.fragmentation > 50;
}
export function detectStrategicDrift(i: StrategyLayerInputs): boolean {
  return i.drift > 35;
}
export function detectStrategicNoise(i: StrategyLayerInputs): boolean {
  return i.noise > 40;
}
export function buildStrategicNarrative(score: number): string {
  if (score >= 85) return "Strategy is coherent and compounding.";
  if (score >= 70) return "Strategy is stable with manageable noise.";
  if (score >= 55) return "Strategy is stressed; alignment requires attention.";
  return "Strategy is fragmented; immediate review required.";
}

export function buildSystemicStrategyLayer(i: StrategyLayerInputs): StrategyLayerOutput {
  const continuity = calculateStrategicContinuity(i);
  const integrity = calculateStrategicIntegrity(i);
  const propagation = calculateStrategicPropagation(i);
  const compression = calculateStrategicCompression(i);
  const strategy_score = avg([continuity, integrity, propagation, compression]);
  return {
    strategy_score, continuity, integrity, propagation, compression,
    overload: detectStrategicOverload(i),
    drift_detected: detectStrategicDrift(i),
    noise_detected: detectStrategicNoise(i),
    narrative: buildStrategicNarrative(strategy_score),
  };
}
