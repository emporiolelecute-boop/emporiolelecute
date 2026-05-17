/**
 * Phase 16.1 — Operational Continuity (pure, read-only).
 */
export type ContinuityVerdict = "persistent" | "resilient" | "vulnerable" | "unstable" | "degrading";

export interface OperationalContinuityInputs {
  persistence: number;
  recoveryCapacity: number;
  decayRate: number;
  continuityBreaks: number;
  strategicPersistence: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateOperationalContinuity(i: OperationalContinuityInputs): number {
  return clamp(
    i.persistence * 0.35 +
    i.recoveryCapacity * 0.25 +
    i.strategicPersistence * 0.2 +
    inv(i.decayRate) * 0.1 +
    inv(i.continuityBreaks) * 0.1
  );
}

export function detectContinuityBreaks(i: OperationalContinuityInputs): number {
  return clamp(i.continuityBreaks);
}

export function estimateRecoveryContinuity(i: OperationalContinuityInputs): number {
  return clamp(i.recoveryCapacity * 0.7 + i.persistence * 0.3);
}

export function estimateStrategicPersistence(i: OperationalContinuityInputs): number {
  return clamp(i.strategicPersistence);
}

export function detectExecutionDecay(i: OperationalContinuityInputs): number {
  return clamp(i.decayRate);
}

export interface ContinuityForecastPoint { horizon: string; projected: number; }

export function buildContinuityForecast(i: OperationalContinuityInputs): ContinuityForecastPoint[] {
  const base = calculateOperationalContinuity(i);
  const decay = i.decayRate / 100;
  return [
    { horizon: "30d", projected: clamp(base - decay * 4) },
    { horizon: "60d", projected: clamp(base - decay * 8) },
    { horizon: "90d", projected: clamp(base - decay * 12) },
    { horizon: "180d", projected: clamp(base - decay * 20) },
  ];
}

export function classifyContinuity(score: number): ContinuityVerdict {
  if (score >= 85) return "persistent";
  if (score >= 70) return "resilient";
  if (score >= 55) return "vulnerable";
  if (score >= 40) return "unstable";
  return "degrading";
}
