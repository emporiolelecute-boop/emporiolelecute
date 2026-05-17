/**
 * Fase 15.2 — Executive Causality narrative.
 */
export interface ExecutiveCausalityInputs {
  fabricScore: number;
  cohesion: number;
  integrity: number;
  scalability: number;
  debt: number;
  collapseProbability: number;
}

export function explainStrategicImpact(i: ExecutiveCausalityInputs): string {
  return `Estratégia opera em coesão ${i.cohesion} com tecido em ${i.fabricScore}.`;
}
export function explainOperationalImpact(i: ExecutiveCausalityInputs): string {
  return `Débito estrutural em ${i.debt} pressiona execução do tecido operacional.`;
}
export function explainSemanticImpact(i: ExecutiveCausalityInputs): string {
  return `Integridade semântica/estrutural em ${i.integrity}.`;
}
export function explainAuthorityImpact(i: ExecutiveCausalityInputs): string {
  return `Escalabilidade efetiva em ${i.scalability}; risco de colapso ${i.collapseProbability}.`;
}

export function buildExecutiveNarrative(i: ExecutiveCausalityInputs): string[] {
  return [
    explainStrategicImpact(i),
    explainOperationalImpact(i),
    explainSemanticImpact(i),
    explainAuthorityImpact(i),
  ];
}

export interface DecisionImpactNode {
  decision: string;
  impacts: { layer: string; severity: "low" | "medium" | "high" }[];
}

export function buildDecisionImpactTree(
  decisions: Array<{ decision: string; layers: string[] }>,
  defaultSeverity: "low" | "medium" | "high" = "medium",
): DecisionImpactNode[] {
  return decisions.map((d) => ({
    decision: d.decision,
    impacts: d.layers.map((l) => ({ layer: l, severity: defaultSeverity })),
  }));
}

export function buildExecutiveCausalitySummary(i: ExecutiveCausalityInputs) {
  return {
    narrative: buildExecutiveNarrative(i),
    fabric: i.fabricScore,
    cohesion: i.cohesion,
    integrity: i.integrity,
    scalability: i.scalability,
    debt: i.debt,
    collapse: i.collapseProbability,
  };
}
