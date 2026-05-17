/**
 * Phase 16.1 — Temporal Coherence (pure, read-only).
 */
export type TemporalVerdict = "coherent" | "stable" | "oscillating" | "fragmented" | "unstable";

export interface TemporalCoherenceInputs {
  longitudinalStability: number;
  driftRate: number;
  oscillation: number;
  memoryConsistency: number;
  trendStability: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateTemporalCoherence(i: TemporalCoherenceInputs): number {
  return clamp(
    i.longitudinalStability * 0.3 +
    i.memoryConsistency * 0.25 +
    i.trendStability * 0.2 +
    inv(i.driftRate) * 0.15 +
    inv(i.oscillation) * 0.1
  );
}

export function detectStrategicDrift(i: TemporalCoherenceInputs): number {
  return clamp(i.driftRate * 0.7 + (100 - i.trendStability) * 0.3);
}

export function detectExecutionOscillation(i: TemporalCoherenceInputs): number {
  return clamp(i.oscillation);
}

export function estimateLongitudinalStability(i: TemporalCoherenceInputs): number {
  return clamp(i.longitudinalStability * 0.6 + i.memoryConsistency * 0.4);
}

export function detectMemoryInconsistency(i: TemporalCoherenceInputs): number {
  return inv(i.memoryConsistency);
}

export interface TimelinePoint { label: string; value: number; }

export function buildTimelineContinuity(i: TemporalCoherenceInputs): TimelinePoint[] {
  const base = calculateTemporalCoherence(i);
  return [
    { label: "T-4", value: clamp(base - 6) },
    { label: "T-3", value: clamp(base - 3) },
    { label: "T-2", value: clamp(base - 1) },
    { label: "T-1", value: clamp(base) },
    { label: "now", value: clamp(base + 2) },
  ];
}

export function classifyTemporal(score: number): TemporalVerdict {
  if (score >= 85) return "coherent";
  if (score >= 70) return "stable";
  if (score >= 55) return "oscillating";
  if (score >= 40) return "fragmented";
  return "unstable";
}
