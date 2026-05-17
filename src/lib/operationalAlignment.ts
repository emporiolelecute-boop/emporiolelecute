/**
 * Phase 16.4 — Operational Alignment (pure, read-only).
 */
export type OpAlignmentVerdict = "harmonized" | "aligned" | "unstable" | "dispersed" | "collapsing";

export interface OperationalAlignmentInputs {
  execution: number;
  coordination: number;
  alignment: number;
  dispersion: number;
  dissonance: number;
  conflicts: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateOperationalAlignment(i: OperationalAlignmentInputs): number {
  return clamp(
    i.alignment * 0.35 + i.execution * 0.25 + i.coordination * 0.2 +
    inv(i.dispersion) * 0.1 + inv(i.dissonance) * 0.05 + inv(i.conflicts) * 0.05
  );
}

export function detectExecutionDispersion(i: OperationalAlignmentInputs): number {
  return clamp(i.dispersion * 0.7 + inv(i.execution) * 0.3);
}

export function detectOperationalDissonance(i: OperationalAlignmentInputs): number {
  return clamp(i.dissonance * 0.6 + i.conflicts * 0.4);
}

export function estimateOperationalHarmony(i: OperationalAlignmentInputs): number {
  return clamp(i.alignment * 0.5 + i.coordination * 0.3 + inv(i.dissonance) * 0.2);
}

export function detectAlignmentConflicts(i: OperationalAlignmentInputs): number {
  return clamp(i.conflicts * 0.7 + i.dispersion * 0.3);
}

export function classifyOperationalAlignment(score: number): OpAlignmentVerdict {
  if (score >= 85) return "harmonized";
  if (score >= 70) return "aligned";
  if (score >= 55) return "unstable";
  if (score >= 40) return "dispersed";
  return "collapsing";
}

export interface OperationalAlignmentCell {
  source: string;
  target: string;
  dissonance: number;
}

export function buildOperationalAlignmentHeatmap(i: OperationalAlignmentInputs): OperationalAlignmentCell[] {
  const dims = [
    { name: "execution", v: i.execution },
    { name: "alignment", v: i.alignment },
    { name: "coordination", v: i.coordination },
    { name: "dispersion", v: inv(i.dispersion) },
    { name: "dissonance", v: inv(i.dissonance) },
  ];
  const out: OperationalAlignmentCell[] = [];
  for (let a = 0; a < dims.length; a++) {
    for (let b = a + 1; b < dims.length; b++) {
      out.push({ source: dims[a].name, target: dims[b].name, dissonance: clamp(Math.abs(dims[a].v - dims[b].v)) });
    }
  }
  return out;
}
