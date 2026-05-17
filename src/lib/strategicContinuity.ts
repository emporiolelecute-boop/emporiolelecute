/**
 * Fase 15.5 — Strategic Continuity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ContinuityInputs {
  coherence: number;
  resilience: number;
  governance: number;
  longevity: number;
  scalability: number;
  collapseRisk: number;
  decayRate: number;
  fragmentation: number;
}

export function calculateStrategicContinuity(i: ContinuityInputs): number {
  return avg([i.coherence, i.resilience, i.governance, inv(i.collapseRisk)]);
}
export function calculateLongTermViability(i: ContinuityInputs): number {
  return avg([i.longevity, i.scalability, i.resilience, inv(i.decayRate)]);
}
export function calculateStrategicLongevity(i: ContinuityInputs): number {
  return avg([i.longevity, i.coherence, inv(i.fragmentation)]);
}
export function estimateStrategicDecay(i: ContinuityInputs): number {
  return clamp((i.decayRate * 0.5) + (i.fragmentation * 0.3) + (i.collapseRisk * 0.2));
}
export function estimateSustainabilityProjection(i: ContinuityInputs): number {
  return avg([i.longevity, i.scalability, i.resilience, i.governance, inv(i.decayRate)]);
}
export function detectContinuityBreakpoints(i: ContinuityInputs): string[] {
  const b: string[] = [];
  if (i.collapseRisk > 55) b.push("collapse_pressure");
  if (i.decayRate > 50) b.push("decay_pressure");
  if (i.fragmentation > 50) b.push("fragmentation_pressure");
  return b;
}
