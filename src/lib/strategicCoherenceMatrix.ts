/**
 * Phase 16.4 — Strategic Coherence Matrix (pure, read-only).
 */
export type CoherenceVerdict = "UNIFIED" | "SYNCHRONIZED" | "STABLE" | "DIVERGENT" | "FRACTURED";

export interface CoherenceMatrixInputs {
  systemic: number;
  alignment: number;
  cognitive: number;
  semantic: number;
  operational: number;
  governance: number;
  continuity: number;
  resilience: number;
  execution: number;
  misalignment: number;
  divergence: number;
  dispersion: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateCoherenceMatrix(i: CoherenceMatrixInputs): number {
  const pos = [i.systemic, i.alignment, i.cognitive, i.semantic, i.operational, i.governance, i.continuity, i.resilience, i.execution];
  const neg = [i.misalignment, i.divergence, i.dispersion];
  const p = pos.reduce((a, b) => a + b, 0) / pos.length;
  const n = neg.reduce((a, b) => a + b, 0) / neg.length;
  return clamp(p * 0.72 + inv(n) * 0.28);
}

export function calculateSystemicCoherence(i: CoherenceMatrixInputs): number {
  return clamp(i.systemic * 0.5 + i.alignment * 0.3 + inv(i.divergence) * 0.2);
}

export function calculateStrategicAlignment(i: CoherenceMatrixInputs): number {
  return clamp(i.alignment * 0.45 + i.governance * 0.2 + i.execution * 0.2 + inv(i.misalignment) * 0.15);
}

export function detectCoherenceBreaks(i: CoherenceMatrixInputs): string[] {
  const out: string[] = [];
  if (i.misalignment > 50) out.push("Strategic misalignment");
  if (i.divergence > 50) out.push("Semantic divergence");
  if (i.dispersion > 50) out.push("Operational dispersion");
  if (i.cognitive < 50) out.push("Cognitive fragmentation");
  if (i.governance < 50) out.push("Governance dissonance");
  if (i.continuity < 50) out.push("Continuity break");
  return out;
}

export function estimateCoherencePersistence(i: CoherenceMatrixInputs): number {
  return clamp(i.resilience * 0.4 + i.continuity * 0.35 + inv(i.dispersion) * 0.25);
}

export interface CoherenceVerdictResult {
  verdict: CoherenceVerdict;
  score: number;
  strengths: string[];
  divergence_points: string[];
  unstable_domains: string[];
  aligned_clusters: string[];
  coherence_summary: string;
  alignment_summary: string;
}

export function buildCoherenceVerdict(i: CoherenceMatrixInputs): CoherenceVerdictResult {
  const score = calculateCoherenceMatrix(i);
  let verdict: CoherenceVerdict = "STABLE";
  if (score >= 90) verdict = "UNIFIED";
  else if (score >= 76) verdict = "SYNCHRONIZED";
  else if (score >= 60) verdict = "STABLE";
  else if (score >= 45) verdict = "DIVERGENT";
  else verdict = "FRACTURED";

  const strengths: string[] = [];
  if (i.systemic >= 70) strengths.push("Systemic coherence");
  if (i.alignment >= 70) strengths.push("Strategic alignment");
  if (i.cognitive >= 70) strengths.push("Cognitive consistency");
  if (i.semantic >= 70) strengths.push("Semantic coherence");
  if (i.governance >= 70) strengths.push("Governance alignment");

  const layers: [string, number][] = [
    ["systemic", i.systemic], ["alignment", i.alignment], ["cognitive", i.cognitive],
    ["semantic", i.semantic], ["operational", i.operational], ["governance", i.governance],
    ["continuity", i.continuity], ["resilience", i.resilience], ["execution", i.execution],
  ];
  const sorted = [...layers].sort((a, b) => b[1] - a[1]);
  const aligned_clusters = sorted.slice(0, 4).map((l) => l[0]);
  const unstable_domains = sorted.filter((l) => l[1] < 55).map((l) => l[0]);

  return {
    verdict, score, strengths,
    divergence_points: detectCoherenceBreaks(i),
    unstable_domains,
    aligned_clusters,
    coherence_summary: `Systemic coherence ${calculateSystemicCoherence(i)}/100, persistence ${estimateCoherencePersistence(i)}/100.`,
    alignment_summary: `Strategic alignment ${calculateStrategicAlignment(i)}/100 across ${layers.length} layers.`,
  };
}
