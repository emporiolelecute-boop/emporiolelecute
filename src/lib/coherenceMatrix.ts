/**
 * Phase 15.4 — Coherence Matrix.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (...xs: number[]) => {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
};

export interface CoherenceInputs {
  strategic: number;
  operational: number;
  semantic: number;
  authority: number;
  governance: number;
  consensus: number;
  contradictionPressure: number;
  conflictDensity: number;
}

export interface CoherenceMatrix {
  cross_layer_coherence: number;
  strategic_coherence: number;
  operational_coherence: number;
  semantic_coherence: number;
  authority_coherence: number;
  governance_coherence: number;
  breakpoints: string[];
  collapse_risk: number;
}

const layerCoh = (v: number, penalty: number) => clamp(v - penalty * 0.4);

export function calculateStrategicCoherence(i: CoherenceInputs): number {
  return layerCoh(i.strategic, i.contradictionPressure);
}
export function calculateOperationalCoherence(i: CoherenceInputs): number {
  return layerCoh(i.operational, i.conflictDensity);
}
export function calculateSemanticCoherence(i: CoherenceInputs): number {
  return layerCoh(i.semantic, i.contradictionPressure);
}
export function calculateAuthorityCoherence(i: CoherenceInputs): number {
  return layerCoh(i.authority, i.conflictDensity);
}
export function calculateGovernanceCoherence(i: CoherenceInputs): number {
  return layerCoh(i.governance, i.contradictionPressure);
}

export function calculateCrossLayerCoherence(i: CoherenceInputs): number {
  return clamp(
    avg(
      calculateStrategicCoherence(i),
      calculateOperationalCoherence(i),
      calculateSemanticCoherence(i),
      calculateAuthorityCoherence(i),
      calculateGovernanceCoherence(i),
    ) * 0.8 + i.consensus * 0.2,
  );
}

export function detectCoherenceBreakpoints(i: CoherenceInputs): string[] {
  const out: string[] = [];
  if (calculateStrategicCoherence(i) < 50) out.push("strategic");
  if (calculateOperationalCoherence(i) < 50) out.push("operational");
  if (calculateSemanticCoherence(i) < 50) out.push("semantic");
  if (calculateAuthorityCoherence(i) < 50) out.push("authority");
  if (calculateGovernanceCoherence(i) < 50) out.push("governance");
  return out;
}

export function detectCoherenceCollapse(i: CoherenceInputs): number {
  const cross = calculateCrossLayerCoherence(i);
  return clamp((100 - cross) * 0.7 + i.contradictionPressure * 0.3);
}

export function buildCoherenceMatrix(i: CoherenceInputs): CoherenceMatrix {
  return {
    cross_layer_coherence: calculateCrossLayerCoherence(i),
    strategic_coherence: calculateStrategicCoherence(i),
    operational_coherence: calculateOperationalCoherence(i),
    semantic_coherence: calculateSemanticCoherence(i),
    authority_coherence: calculateAuthorityCoherence(i),
    governance_coherence: calculateGovernanceCoherence(i),
    breakpoints: detectCoherenceBreakpoints(i),
    collapse_risk: detectCoherenceCollapse(i),
  };
}
