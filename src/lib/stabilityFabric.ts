/**
 * Phase 16.2 — Stability Fabric (pure, read-only).
 */
export type FabricVerdict = "IMMUTABLE" | "RESILIENT" | "STABLE" | "FRAGILE" | "COLLAPSING";

export interface StabilityFabricInputs {
  integrity: number;
  resilience: number;
  equilibrium: number;
  consensus: number;
  recovery: number;
  signal: number;
  degradation: number;
  fragmentation: number;
  volatility: number;
  dispersion: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateStabilityFabric(i: StabilityFabricInputs): number {
  const positives = [i.integrity, i.resilience, i.equilibrium, i.consensus, i.recovery, i.signal];
  const negatives = [i.degradation, i.fragmentation, i.volatility, i.dispersion];
  const pos = positives.reduce((a, b) => a + b, 0) / positives.length;
  const neg = negatives.reduce((a, b) => a + b, 0) / negatives.length;
  return clamp(pos * 0.7 + inv(neg) * 0.3);
}

export function calculateSystemicIntegrity(i: StabilityFabricInputs): number {
  return clamp(i.integrity * 0.6 + i.consensus * 0.25 + inv(i.fragmentation) * 0.15);
}

export function calculateStrategicEquilibrium(i: StabilityFabricInputs): number {
  return clamp(i.equilibrium * 0.5 + i.consensus * 0.2 + inv(i.volatility) * 0.2 + inv(i.dispersion) * 0.1);
}

export function detectStabilityBreaks(i: StabilityFabricInputs): string[] {
  const breaks: string[] = [];
  if (i.fragmentation > 50) breaks.push("Structural fragmentation");
  if (i.degradation > 50) breaks.push("Silent degradation pressure");
  if (i.volatility > 50) breaks.push("Operational volatility");
  if (i.dispersion > 50) breaks.push("Systemic dispersion");
  if (i.consensus < 50) breaks.push("Consensus erosion");
  return breaks;
}

export function estimateStabilityPersistence(i: StabilityFabricInputs): number {
  return clamp(i.resilience * 0.5 + i.recovery * 0.3 + inv(i.degradation) * 0.2);
}

export interface FabricVerdictResult {
  verdict: FabricVerdict;
  score: number;
  strengths: string[];
  fracture_points: string[];
  unstable_layers: string[];
  resilient_clusters: string[];
  persistence_summary: string;
  integrity_summary: string;
}

export function buildFabricVerdict(i: StabilityFabricInputs): FabricVerdictResult {
  const score = calculateStabilityFabric(i);
  let verdict: FabricVerdict = "STABLE";
  if (score >= 88) verdict = "IMMUTABLE";
  else if (score >= 75) verdict = "RESILIENT";
  else if (score >= 60) verdict = "STABLE";
  else if (score >= 45) verdict = "FRAGILE";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (i.integrity >= 70) strengths.push("Integrity baseline");
  if (i.resilience >= 70) strengths.push("Resilience reservoir");
  if (i.consensus >= 70) strengths.push("Consensus alignment");
  if (i.recovery >= 70) strengths.push("Recovery capacity");

  const layers: [string, number][] = [
    ["integrity", i.integrity], ["resilience", i.resilience], ["equilibrium", i.equilibrium],
    ["consensus", i.consensus], ["recovery", i.recovery], ["signal", i.signal],
  ];
  const sorted = [...layers].sort((a, b) => b[1] - a[1]);
  const resilient_clusters = sorted.slice(0, 3).map((l) => l[0]);
  const unstable_layers = sorted.filter((l) => l[1] < 55).map((l) => l[0]);

  return {
    verdict, score, strengths,
    fracture_points: detectStabilityBreaks(i),
    unstable_layers,
    resilient_clusters,
    persistence_summary: `Persistence estimated at ${estimateStabilityPersistence(i)}/100.`,
    integrity_summary: `Integrity ${calculateSystemicIntegrity(i)}/100, equilibrium ${calculateStrategicEquilibrium(i)}/100.`,
  };
}
