/**
 * Phase 16.2 — Consensus Integrity (pure, read-only).
 */
export type ConsensusVerdict = "unified" | "aligned" | "unstable" | "fragmented" | "divergent";

export interface ConsensusInputs {
  agreement: number;
  divergence: number;
  isolatedEngines: number;
  alignmentDepth: number;
  contradictions: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateConsensusIntegrity(i: ConsensusInputs): number {
  return clamp(
    i.agreement * 0.4 +
    i.alignmentDepth * 0.3 +
    inv(i.divergence) * 0.15 +
    inv(i.contradictions) * 0.1 +
    inv(i.isolatedEngines) * 0.05
  );
}

export function detectConsensusBreaks(i: ConsensusInputs): number {
  return clamp(i.divergence * 0.6 + i.contradictions * 0.4);
}

export function detectStrategicDivergence(i: ConsensusInputs): number {
  return clamp(i.divergence);
}

export function estimateConsensusStability(i: ConsensusInputs): number {
  return clamp(i.agreement * 0.7 + inv(i.divergence) * 0.3);
}

export function detectEngineIsolation(i: ConsensusInputs): number {
  return clamp(i.isolatedEngines);
}

export interface ConsensusMapEntry { engine: string; alignment: number; }

export function buildConsensusMap(i: ConsensusInputs): ConsensusMapEntry[] {
  const base = calculateConsensusIntegrity(i);
  return [
    { engine: "governance", alignment: clamp(base + 4) },
    { engine: "executive", alignment: clamp(base - 1) },
    { engine: "semantic", alignment: clamp(base + 2) },
    { engine: "operational", alignment: clamp(base - 3) },
    { engine: "resilience", alignment: clamp(base + 1) },
    { engine: "consciousness", alignment: clamp(base - 2) },
  ];
}

export function classifyConsensus(score: number): ConsensusVerdict {
  if (score >= 85) return "unified";
  if (score >= 70) return "aligned";
  if (score >= 55) return "unstable";
  if (score >= 40) return "fragmented";
  return "divergent";
}
