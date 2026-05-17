/**
 * Phase 16.2 — Degradation Detection (pure, read-only).
 */
export type DegradationRisk = "negligible" | "low" | "moderate" | "high" | "critical";

export interface DegradationInputs {
  authorityDecay: number;
  semanticErosion: number;
  operationalRegression: number;
  silentSignals: number;
  velocity: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function detectSilentDegradation(i: DegradationInputs): number {
  return clamp(i.silentSignals * 0.5 + i.authorityDecay * 0.25 + i.semanticErosion * 0.25);
}

export function detectAuthorityDecay(i: DegradationInputs): number {
  return clamp(i.authorityDecay);
}

export function detectSemanticErosion(i: DegradationInputs): number {
  return clamp(i.semanticErosion);
}

export function detectOperationalRegression(i: DegradationInputs): number {
  return clamp(i.operationalRegression);
}

export function estimateDegradationVelocity(i: DegradationInputs): number {
  return clamp(i.velocity * 0.6 + (i.authorityDecay + i.semanticErosion) * 0.2);
}

export function classifyDegradationRisk(score: number): DegradationRisk {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  if (score >= 15) return "low";
  return "negligible";
}
