/**
 * Phase 16.4 — Governance Alignment (pure, read-only).
 */
export type GovernanceVerdict = "sovereign" | "aligned" | "stable" | "unstable" | "fragmented";

export interface GovernanceAlignmentInputs {
  authority: number;
  consistency: number;
  continuity: number;
  conflicts: number;
  drift: number;
  harmony: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateGovernanceAlignment(i: GovernanceAlignmentInputs): number {
  return clamp(
    i.authority * 0.3 + i.consistency * 0.25 + i.continuity * 0.2 + i.harmony * 0.1 +
    inv(i.conflicts) * 0.1 + inv(i.drift) * 0.05
  );
}

export function detectGovernanceConflicts(i: GovernanceAlignmentInputs): number {
  return clamp(i.conflicts * 0.7 + inv(i.consistency) * 0.3);
}

export function estimateGovernanceContinuity(i: GovernanceAlignmentInputs): number {
  return clamp(i.continuity * 0.6 + i.consistency * 0.4);
}

export function detectStrategicGovernanceDrift(i: GovernanceAlignmentInputs): number {
  return clamp(i.drift * 0.7 + inv(i.authority) * 0.3);
}

export function calculateGovernanceHarmony(i: GovernanceAlignmentInputs): number {
  return clamp(i.harmony * 0.6 + i.consistency * 0.2 + inv(i.conflicts) * 0.2);
}

export function classifyGovernance(score: number): GovernanceVerdict {
  if (score >= 88) return "sovereign";
  if (score >= 72) return "aligned";
  if (score >= 58) return "stable";
  if (score >= 42) return "unstable";
  return "fragmented";
}

export interface GovernanceAlignmentMap {
  axes: { name: string; value: number }[];
  strongest: string;
  weakest: string;
}

export function buildGovernanceAlignmentMap(i: GovernanceAlignmentInputs): GovernanceAlignmentMap {
  const axes = [
    { name: "authority", value: i.authority },
    { name: "consistency", value: i.consistency },
    { name: "continuity", value: i.continuity },
    { name: "harmony", value: i.harmony },
    { name: "drift_resistance", value: inv(i.drift) },
    { name: "conflict_resistance", value: inv(i.conflicts) },
  ];
  const sorted = [...axes].sort((a, b) => b.value - a.value);
  return { axes, strongest: sorted[0].name, weakest: sorted[sorted.length - 1].name };
}
