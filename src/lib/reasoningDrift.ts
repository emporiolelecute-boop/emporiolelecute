/**
 * Phase 15.4 — Reasoning Drift detection.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DriftInputs {
  baseline: number;
  current: number;
  noise?: number;
}

export interface DriftReading {
  drift_score: number;
  velocity: number;
  acceleration: number;
  severity: "low" | "medium" | "high" | "critical";
}

function severity(score: number): DriftReading["severity"] {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function driftFrom(i: DriftInputs): number {
  const delta = Math.abs(i.current - i.baseline);
  return clamp(delta + (i.noise ?? 0) * 0.3);
}

export function detectReasoningDrift(i: DriftInputs): DriftReading {
  const drift = driftFrom(i);
  return { drift_score: drift, velocity: clamp(drift * 0.6), acceleration: clamp(drift * 0.3), severity: severity(drift) };
}
export const detectStrategicDrift = detectReasoningDrift;
export const detectSemanticDrift = detectReasoningDrift;
export const detectOperationalDrift = detectReasoningDrift;
export const detectGovernanceDrift = detectReasoningDrift;

export function calculateDriftVelocity(samples: number[]): number {
  if (samples.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < samples.length; i++) total += Math.abs(samples[i] - samples[i - 1]);
  return clamp(total / (samples.length - 1));
}

export function estimateDriftAcceleration(samples: number[]): number {
  if (samples.length < 3) return 0;
  const v: number[] = [];
  for (let i = 1; i < samples.length; i++) v.push(samples[i] - samples[i - 1]);
  let acc = 0;
  for (let i = 1; i < v.length; i++) acc += Math.abs(v[i] - v[i - 1]);
  return clamp(acc / (v.length - 1));
}

export function estimateCollapseProbability(drift: number, instability: number): number {
  return clamp(drift * 0.6 + instability * 0.4);
}

export interface DriftTimelinePoint {
  layer: string;
  drift: number;
  severity: DriftReading["severity"];
}

export function buildDriftTimeline(
  layers: { layer: string; reading: DriftReading }[],
): DriftTimelinePoint[] {
  return layers.map((l) => ({
    layer: l.layer,
    drift: l.reading.drift_score,
    severity: l.reading.severity,
  }));
}
