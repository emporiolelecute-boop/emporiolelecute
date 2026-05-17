/**
 * Phase 16.1 — Causal Alignment (pure, read-only).
 */
export type CausalVerdict = "aligned" | "connected" | "unstable" | "fragmented" | "invalid";

export interface CausalAlignmentInputs {
  causalIntegrity: number;
  dependencyStrength: number;
  brokenChains: number;
  falseCorrelations: number;
  circularReasoning: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function estimateCausalIntegrity(i: CausalAlignmentInputs): number {
  return clamp(i.causalIntegrity * 0.6 + inv(i.brokenChains) * 0.4);
}

export function detectBrokenCausalChains(i: CausalAlignmentInputs): number {
  return clamp(i.brokenChains);
}

export function detectFalseCorrelations(i: CausalAlignmentInputs): number {
  return clamp(i.falseCorrelations);
}

export function calculateStrategicDependency(i: CausalAlignmentInputs): number {
  return clamp(i.dependencyStrength);
}

export function detectCircularReasoning(i: CausalAlignmentInputs): number {
  return clamp(i.circularReasoning);
}

export interface CausalNode { id: string; weight: number; }
export interface CausalEdge { from: string; to: string; strength: number; }

export function buildCausalAlignmentGraph(i: CausalAlignmentInputs): { nodes: CausalNode[]; edges: CausalEdge[]; score: number; } {
  const score = clamp(
    i.causalIntegrity * 0.4 +
    i.dependencyStrength * 0.2 +
    inv(i.brokenChains) * 0.2 +
    inv(i.falseCorrelations) * 0.1 +
    inv(i.circularReasoning) * 0.1
  );
  const nodes: CausalNode[] = [
    { id: "governance", weight: clamp(score + 4) },
    { id: "executive", weight: clamp(score - 2) },
    { id: "semantic", weight: clamp(score + 1) },
    { id: "operational", weight: clamp(score - 3) },
    { id: "resilience", weight: clamp(score + 2) },
  ];
  const edges: CausalEdge[] = [
    { from: "governance", to: "executive", strength: clamp(score) },
    { from: "executive", to: "operational", strength: clamp(score - 4) },
    { from: "semantic", to: "executive", strength: clamp(score - 2) },
    { from: "operational", to: "resilience", strength: clamp(score - 6) },
    { from: "governance", to: "semantic", strength: clamp(score + 1) },
  ];
  return { nodes, edges, score };
}

export function classifyCausal(score: number): CausalVerdict {
  if (score >= 85) return "aligned";
  if (score >= 70) return "connected";
  if (score >= 55) return "unstable";
  if (score >= 40) return "fragmented";
  return "invalid";
}
