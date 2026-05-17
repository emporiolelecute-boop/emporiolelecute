/**
 * Phase 16.3 — Systemic Trust Integrity (pure, read-only).
 */
export type TrustVerdict = "trusted" | "reliable" | "unstable" | "weak" | "compromised";

export interface SystemicTrustInputs {
  authority: number;
  consistency: number;
  reliability: number;
  signalClarity: number;
  distortion: number;
  collapseSignals: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateSystemicTrustIntegrity(i: SystemicTrustInputs): number {
  return clamp(
    i.authority * 0.3 + i.consistency * 0.25 + i.reliability * 0.2 +
    i.signalClarity * 0.1 + inv(i.distortion) * 0.1 + inv(i.collapseSignals) * 0.05
  );
}

export function detectTrustDisruptions(i: SystemicTrustInputs): string[] {
  const out: string[] = [];
  if (i.distortion > 40) out.push("Authority distortion");
  if (i.consistency < 55) out.push("Inconsistent trust signals");
  if (i.reliability < 55) out.push("Reliability erosion");
  if (i.collapseSignals > 35) out.push("Confidence collapse markers");
  return out;
}

export function detectAuthorityDistortion(i: SystemicTrustInputs): number {
  return clamp(i.distortion * 0.7 + inv(i.authority) * 0.3);
}

export function estimateTrustContinuity(i: SystemicTrustInputs): number {
  return clamp(i.consistency * 0.5 + i.reliability * 0.3 + inv(i.collapseSignals) * 0.2);
}

export function detectConfidenceCollapse(i: SystemicTrustInputs): number {
  return clamp(i.collapseSignals * 0.6 + inv(i.reliability) * 0.4);
}

export function classifyTrust(score: number): TrustVerdict {
  if (score >= 85) return "trusted";
  if (score >= 70) return "reliable";
  if (score >= 55) return "unstable";
  if (score >= 40) return "weak";
  return "compromised";
}

export interface TrustIntegrityMap {
  nodes: { layer: string; trust: number }[];
  weakest: string;
  strongest: string;
}

export function buildTrustIntegrityMap(i: SystemicTrustInputs): TrustIntegrityMap {
  const nodes = [
    { layer: "authority", trust: i.authority },
    { layer: "consistency", trust: i.consistency },
    { layer: "reliability", trust: i.reliability },
    { layer: "clarity", trust: i.signalClarity },
    { layer: "distortion_resistance", trust: inv(i.distortion) },
  ];
  const sorted = [...nodes].sort((a, b) => b.trust - a.trust);
  return { nodes, strongest: sorted[0].layer, weakest: sorted[sorted.length - 1].layer };
}
