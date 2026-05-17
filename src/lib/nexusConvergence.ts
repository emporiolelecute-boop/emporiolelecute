/**
 * Phase 16.1 — Nexus Convergence (pure, read-only).
 * Synthesises cross-engine convergence indicators.
 */

export type NexusVerdict = "SYNCHRONIZED" | "STABLE" | "PARTIAL" | "FRACTURED" | "COLLAPSING";

export interface NexusConvergenceInputs {
  governance: number;
  consciousness: number;
  reality: number;
  continuity: number;
  executive: number;
  semantic: number;
  operational: number;
  resilience: number;
  fragmentation: number;
  dissonance: number;
  drift: number;
  entropy: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateNexusConvergence(i: NexusConvergenceInputs): number {
  const positives = [i.governance, i.consciousness, i.reality, i.continuity, i.executive, i.semantic, i.operational, i.resilience];
  const negatives = [i.fragmentation, i.dissonance, i.drift, i.entropy];
  const pos = positives.reduce((a, b) => a + b, 0) / positives.length;
  const neg = negatives.reduce((a, b) => a + b, 0) / negatives.length;
  return clamp(pos * 0.7 + inv(neg) * 0.3);
}

export function calculateCrossEngineAlignment(i: NexusConvergenceInputs): number {
  const vals = [i.governance, i.consciousness, i.reality, i.continuity, i.executive, i.semantic, i.operational, i.resilience];
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
  return clamp(100 - Math.sqrt(variance) * 2);
}

export function detectStrategicDissonance(i: NexusConvergenceInputs): number {
  return clamp(i.dissonance * 0.6 + i.drift * 0.4);
}

export function detectSemanticFragmentation(i: NexusConvergenceInputs): number {
  return clamp(i.fragmentation * 0.7 + (100 - i.semantic) * 0.3);
}

export function estimateOperationalHarmony(i: NexusConvergenceInputs): number {
  return clamp(i.operational * 0.6 + i.resilience * 0.4 - i.entropy * 0.2);
}

export interface NexusVerdictResult {
  verdict: NexusVerdict;
  score: number;
  blockers: string[];
  strengths: string[];
  unstable_domains: string[];
  dominant_engines: string[];
  conflict_zones: string[];
  convergence_summary: string;
}

export function buildNexusVerdict(i: NexusConvergenceInputs): NexusVerdictResult {
  const score = calculateNexusConvergence(i);
  let verdict: NexusVerdict = "STABLE";
  if (score >= 85) verdict = "SYNCHRONIZED";
  else if (score >= 70) verdict = "STABLE";
  else if (score >= 55) verdict = "PARTIAL";
  else if (score >= 40) verdict = "FRACTURED";
  else verdict = "COLLAPSING";

  const engines: [string, number][] = [
    ["governance", i.governance], ["consciousness", i.consciousness], ["reality", i.reality],
    ["continuity", i.continuity], ["executive", i.executive], ["semantic", i.semantic],
    ["operational", i.operational], ["resilience", i.resilience],
  ];
  const sorted = [...engines].sort((a, b) => b[1] - a[1]);
  const dominant_engines = sorted.slice(0, 3).map((e) => e[0]);
  const unstable_domains = sorted.filter((e) => e[1] < 55).map((e) => e[0]);

  const blockers: string[] = [];
  if (i.fragmentation > 50) blockers.push("High semantic fragmentation");
  if (i.dissonance > 50) blockers.push("Cross-engine dissonance");
  if (i.entropy > 50) blockers.push("Operational entropy");
  if (i.drift > 50) blockers.push("Strategic drift");

  const strengths: string[] = [];
  if (i.resilience >= 70) strengths.push("Resilience baseline");
  if (i.semantic >= 70) strengths.push("Semantic coherence");
  if (i.executive >= 70) strengths.push("Executive clarity");
  if (i.governance >= 70) strengths.push("Governance integrity");

  const conflict_zones = unstable_domains.length
    ? unstable_domains.map((d) => `${d} divergent`)
    : ["none observed"];

  return {
    verdict, score, blockers, strengths, unstable_domains, dominant_engines, conflict_zones,
    convergence_summary: `Nexus ${verdict.toLowerCase()} at ${score}/100.`,
  };
}
