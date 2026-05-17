/**
 * Fase 15.6 — Predictive Governance (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export type PredictabilityClass = "stable" | "volatile" | "unstable" | "collapsing";

export interface PredictiveInputs {
  consensus: number;
  alignment: number;
  governance: number;
  noise: number;
  drift: number;
  fragmentation: number;
  collapseRisk: number;
  narrativeCoherence: number;
}

export function estimateStrategicPredictability(i: PredictiveInputs): number {
  return avg([i.consensus, i.alignment, inv(i.drift), inv(i.noise)]);
}
export function estimateOperationalVariance(i: PredictiveInputs): number {
  return clamp((i.noise * 0.4) + (i.drift * 0.3) + (i.fragmentation * 0.3));
}
export function estimateGovernanceDrift(i: PredictiveInputs): number {
  return clamp((i.drift * 0.6) + (i.fragmentation * 0.2) + (i.noise * 0.2));
}
export function detectInstabilityVectors(i: PredictiveInputs): string[] {
  const v: string[] = [];
  if (i.drift > 35) v.push("drift");
  if (i.noise > 35) v.push("noise");
  if (i.fragmentation > 35) v.push("fragmentation");
  if (i.collapseRisk > 45) v.push("collapse_pressure");
  return v;
}
export function detectNarrativeDissonance(i: PredictiveInputs): number {
  return clamp(100 - i.narrativeCoherence + (i.noise * 0.2));
}
export function estimateLongTermGovernanceHealth(i: PredictiveInputs): number {
  return avg([i.governance, i.alignment, inv(i.collapseRisk), inv(i.fragmentation)]);
}
export function classifyPredictability(score: number, variance: number): PredictabilityClass {
  if (variance > 70 || score < 30) return "collapsing";
  if (variance > 50) return "unstable";
  if (variance > 30) return "volatile";
  return "stable";
}
