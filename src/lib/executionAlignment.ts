/**
 * Fase 15.5 — Execution Alignment (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ExecutionInputs {
  strategicAlignment: number;
  operationalAlignment: number;
  fragmentation: number;
  drift: number;
  noise: number;
  consensus: number;
  governance: number;
  pressure: number;
}

export function calculateExecutionAlignment(i: ExecutionInputs): number {
  return avg([i.strategicAlignment, i.operationalAlignment, i.consensus,
    inv(i.fragmentation), inv(i.drift)]);
}
export function detectExecutionDrift(i: ExecutionInputs): number { return clamp(i.drift); }
export function detectExecutionFragmentation(i: ExecutionInputs): number { return clamp(i.fragmentation); }
export function detectExecutionInconsistency(i: ExecutionInputs): number {
  return clamp((i.noise + i.fragmentation) / 2);
}
export function estimateExecutionReliability(i: ExecutionInputs): number {
  return avg([inv(i.noise), inv(i.drift), i.governance, i.consensus]);
}
export function estimateExecutionPressure(i: ExecutionInputs): number {
  return avg([i.pressure, i.fragmentation, i.drift]);
}
export function estimateExecutionCollapse(i: ExecutionInputs): number {
  return clamp((i.pressure * 0.4 + i.fragmentation * 0.3 + i.drift * 0.3));
}
