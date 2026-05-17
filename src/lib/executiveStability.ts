/**
 * Phase 16.2 — Executive Stability (pure, read-only).
 */
export type ExecutiveVerdict = "sovereign" | "stable" | "pressured" | "unstable" | "collapsing";

export interface ExecutiveStabilityInputs {
  decisionConsistency: number;
  strategicLoad: number;
  volatility: number;
  clarity: number;
  pressureIndex: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateExecutiveStability(i: ExecutiveStabilityInputs): number {
  return clamp(
    i.decisionConsistency * 0.4 +
    i.clarity * 0.25 +
    inv(i.volatility) * 0.15 +
    inv(i.strategicLoad) * 0.1 +
    inv(i.pressureIndex) * 0.1
  );
}

export function detectExecutiveInstability(i: ExecutiveStabilityInputs): number {
  return clamp(i.volatility * 0.5 + i.pressureIndex * 0.3 + i.strategicLoad * 0.2);
}

export function detectStrategicOverload(i: ExecutiveStabilityInputs): number {
  return clamp(i.strategicLoad * 0.6 + i.pressureIndex * 0.4);
}

export function estimateDecisionConsistency(i: ExecutiveStabilityInputs): number {
  return clamp(i.decisionConsistency);
}

export function detectOperationalVolatility(i: ExecutiveStabilityInputs): number {
  return clamp(i.volatility);
}

export interface ExecutiveSummary {
  score: number;
  verdict: ExecutiveVerdict;
  instability: number;
  overload: number;
  volatility: number;
  consistency: number;
  headline: string;
}

export function buildExecutiveSummary(i: ExecutiveStabilityInputs): ExecutiveSummary {
  const score = calculateExecutiveStability(i);
  let verdict: ExecutiveVerdict = "stable";
  if (score >= 85) verdict = "sovereign";
  else if (score >= 70) verdict = "stable";
  else if (score >= 55) verdict = "pressured";
  else if (score >= 40) verdict = "unstable";
  else verdict = "collapsing";
  return {
    score, verdict,
    instability: detectExecutiveInstability(i),
    overload: detectStrategicOverload(i),
    volatility: detectOperationalVolatility(i),
    consistency: estimateDecisionConsistency(i),
    headline: `Executive ${verdict} (${score}/100).`,
  };
}
