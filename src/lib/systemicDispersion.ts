/**
 * Phase 16.2 — Systemic Dispersion (pure, read-only).
 */
export type DispersionVerdict = "concentrated" | "balanced" | "distributed" | "scattered" | "chaotic";

export interface DispersionInputs {
  signalDispersion: number;
  authorityDispersion: number;
  operationalScatter: number;
  semanticDispersion: number;
  concentrationIndex: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function calculateSystemicDispersion(i: DispersionInputs): number {
  return clamp(
    i.signalDispersion * 0.25 +
    i.authorityDispersion * 0.25 +
    i.operationalScatter * 0.25 +
    i.semanticDispersion * 0.25
  );
}

export function detectSignalDispersion(i: DispersionInputs): number { return clamp(i.signalDispersion); }
export function detectAuthorityDispersion(i: DispersionInputs): number { return clamp(i.authorityDispersion); }
export function estimateOperationalScatter(i: DispersionInputs): number { return clamp(i.operationalScatter); }
export function detectSemanticDispersion(i: DispersionInputs): number { return clamp(i.semanticDispersion); }

export interface DispersionHeatCell { dimension: string; value: number; }

export function buildDispersionHeatmap(i: DispersionInputs): DispersionHeatCell[] {
  return [
    { dimension: "signal", value: clamp(i.signalDispersion) },
    { dimension: "authority", value: clamp(i.authorityDispersion) },
    { dimension: "operational", value: clamp(i.operationalScatter) },
    { dimension: "semantic", value: clamp(i.semanticDispersion) },
    { dimension: "concentration", value: clamp(100 - i.concentrationIndex) },
  ];
}

export function classifyDispersion(score: number, concentration: number): DispersionVerdict {
  if (concentration >= 75 && score < 30) return "concentrated";
  if (score < 35) return "balanced";
  if (score < 55) return "distributed";
  if (score < 75) return "scattered";
  return "chaotic";
}
