/**
 * Phase 16.3 — Operational Conflict Engine (pure, read-only).
 */
export type ConflictVerdict = "harmonized" | "aligned" | "unstable" | "conflicting" | "collapsing";

export interface OperationalConflictInputs {
  contradictions: number;
  pressure: number;
  execution: number;
  alignment: number;
  bottlenecks: number;
  coordination: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function detectOperationalConflicts(i: OperationalConflictInputs): number {
  return clamp(i.contradictions * 0.45 + i.bottlenecks * 0.3 + i.pressure * 0.25);
}

export function calculateOperationalIntegrity(i: OperationalConflictInputs): number {
  return clamp(
    i.alignment * 0.35 + i.execution * 0.25 + i.coordination * 0.2 +
    inv(i.contradictions) * 0.1 + inv(i.bottlenecks) * 0.1
  );
}

export function detectExecutionContradictions(i: OperationalConflictInputs): number {
  return clamp(i.contradictions * 0.7 + inv(i.execution) * 0.3);
}

export function estimateOperationalHarmony(i: OperationalConflictInputs): number {
  return clamp(i.alignment * 0.5 + i.coordination * 0.3 + inv(i.pressure) * 0.2);
}

export function detectStrategicPressureConflicts(i: OperationalConflictInputs): number {
  return clamp(i.pressure * 0.6 + i.bottlenecks * 0.4);
}

export function classifyConflict(score: number): ConflictVerdict {
  if (score >= 85) return "harmonized";
  if (score >= 70) return "aligned";
  if (score >= 55) return "unstable";
  if (score >= 40) return "conflicting";
  return "collapsing";
}

export interface ConflictHeatmapCell {
  source: string;
  target: string;
  conflict: number;
}

export function buildConflictHeatmap(i: OperationalConflictInputs): ConflictHeatmapCell[] {
  const dims = [
    { name: "execution", v: i.execution },
    { name: "alignment", v: i.alignment },
    { name: "coordination", v: i.coordination },
    { name: "pressure", v: inv(i.pressure) },
    { name: "bottlenecks", v: inv(i.bottlenecks) },
  ];
  const out: ConflictHeatmapCell[] = [];
  for (let a = 0; a < dims.length; a++) {
    for (let b = a + 1; b < dims.length; b++) {
      const conflict = clamp(Math.abs(dims[a].v - dims[b].v));
      out.push({ source: dims[a].name, target: dims[b].name, conflict });
    }
  }
  return out;
}
