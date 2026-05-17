/**
 * Fase 15.6 — Governance Resilience Matrix (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface ResilienceInputs {
  resilience: number;
  governance: number;
  consensus: number;
  collapseRisk: number;
  fragmentation: number;
  drift: number;
  recoverySpeed: number;
  cascadeImpact: number;
}

export function calculateGovernanceResilience(i: ResilienceInputs): number {
  return avg([i.resilience, i.governance, i.consensus, inv(i.collapseRisk)]);
}
export function detectGovernanceWeakZones(i: ResilienceInputs): string[] {
  const r: string[] = [];
  if (i.governance < 60) r.push("governance_floor");
  if (i.consensus < 60) r.push("consensus_floor");
  if (i.resilience < 60) r.push("resilience_floor");
  return r;
}
export function estimateRecoveryElasticity(i: ResilienceInputs): number {
  return avg([i.recoverySpeed, inv(i.fragmentation), inv(i.drift)]);
}
export function estimateCascadeProtection(i: ResilienceInputs): number {
  return clamp(100 - i.cascadeImpact);
}
export function estimateStrategicSurvivalProbability(i: ResilienceInputs): number {
  return avg([
    calculateGovernanceResilience(i),
    estimateRecoveryElasticity(i),
    estimateCascadeProtection(i),
  ]);
}
