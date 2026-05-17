/**
 * Phase 16.3 — Strategic Integrity Grid (pure, read-only).
 */
export type IntegrityVerdict = "ABSOLUTE" | "CONSOLIDATED" | "STABLE" | "FRACTURED" | "COLLAPSING";

export interface IntegrityGridInputs {
  executive: number;
  coherence: number;
  trust: number;
  semantic: number;
  continuity: number;
  operational: number;
  governance: number;
  resilience: number;
  convergence: number;
  fragmentation: number;
  erosion: number;
  conflict: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateIntegrityGrid(i: IntegrityGridInputs): number {
  const pos = [i.executive, i.coherence, i.trust, i.semantic, i.continuity, i.operational, i.governance, i.resilience, i.convergence];
  const neg = [i.fragmentation, i.erosion, i.conflict];
  const p = pos.reduce((a, b) => a + b, 0) / pos.length;
  const n = neg.reduce((a, b) => a + b, 0) / neg.length;
  return clamp(p * 0.72 + inv(n) * 0.28);
}

export function calculateExecutiveIntegrity(i: IntegrityGridInputs): number {
  return clamp(i.executive * 0.55 + i.coherence * 0.25 + inv(i.conflict) * 0.2);
}

export function calculateStrategicCoherence(i: IntegrityGridInputs): number {
  return clamp(i.coherence * 0.5 + i.convergence * 0.2 + i.governance * 0.15 + inv(i.fragmentation) * 0.15);
}

export function detectIntegrityBreaks(i: IntegrityGridInputs): string[] {
  const out: string[] = [];
  if (i.fragmentation > 50) out.push("Hidden fragmentation");
  if (i.erosion > 50) out.push("Strategic erosion");
  if (i.conflict > 50) out.push("Operational conflicts");
  if (i.coherence < 50) out.push("Coherence breakdown");
  if (i.trust < 50) out.push("Trust collapse");
  if (i.continuity < 50) out.push("Continuity rupture");
  return out;
}

export function estimateIntegrityPersistence(i: IntegrityGridInputs): number {
  return clamp(i.resilience * 0.4 + i.continuity * 0.3 + inv(i.erosion) * 0.3);
}

export interface IntegrityVerdictResult {
  verdict: IntegrityVerdict;
  score: number;
  strengths: string[];
  instability_points: string[];
  fragmented_layers: string[];
  resilient_domains: string[];
  integrity_summary: string;
  coherence_summary: string;
}

export function buildIntegrityVerdict(i: IntegrityGridInputs): IntegrityVerdictResult {
  const score = calculateIntegrityGrid(i);
  let verdict: IntegrityVerdict = "STABLE";
  if (score >= 90) verdict = "ABSOLUTE";
  else if (score >= 78) verdict = "CONSOLIDATED";
  else if (score >= 62) verdict = "STABLE";
  else if (score >= 45) verdict = "FRACTURED";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (i.executive >= 70) strengths.push("Executive integrity");
  if (i.trust >= 70) strengths.push("Systemic trust");
  if (i.semantic >= 70) strengths.push("Semantic integrity");
  if (i.resilience >= 70) strengths.push("Resilient base");
  if (i.governance >= 70) strengths.push("Governance");

  const layers: [string, number][] = [
    ["executive", i.executive], ["coherence", i.coherence], ["trust", i.trust],
    ["semantic", i.semantic], ["continuity", i.continuity], ["operational", i.operational],
    ["governance", i.governance], ["resilience", i.resilience], ["convergence", i.convergence],
  ];
  const sorted = [...layers].sort((a, b) => b[1] - a[1]);
  const resilient_domains = sorted.slice(0, 4).map((l) => l[0]);
  const fragmented_layers = sorted.filter((l) => l[1] < 55).map((l) => l[0]);

  return {
    verdict, score, strengths,
    instability_points: detectIntegrityBreaks(i),
    fragmented_layers,
    resilient_domains,
    integrity_summary: `Executive integrity ${calculateExecutiveIntegrity(i)}/100, persistence ${estimateIntegrityPersistence(i)}/100.`,
    coherence_summary: `Strategic coherence ${calculateStrategicCoherence(i)}/100 across ${layers.length} layers.`,
  };
}
