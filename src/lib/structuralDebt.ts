/**
 * Fase 15.2 — Structural Debt analyzer.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DebtInputs {
  redundantEngines?: number;
  overengineeredFlows?: number;
  duplicateMetrics?: number;
  authorityWasteScore?: number;
  telemetryInflation?: number;
  governanceComplexity?: number;
}

export interface DebtDistribution {
  label: string;
  value: number;
}

export function detectArchitecturalRedundancy(i: DebtInputs): number {
  return clamp((i.redundantEngines ?? 0) * 8);
}
export function detectOperationalOverengineering(i: DebtInputs): number {
  return clamp((i.overengineeredFlows ?? 0) * 7);
}
export function detectSemanticRedundancy(i: DebtInputs): number {
  return clamp((i.duplicateMetrics ?? 0) * 5);
}
export function detectAuthorityWaste(i: DebtInputs): number {
  return clamp(i.authorityWasteScore ?? 0);
}
export function detectTelemetryInflation(i: DebtInputs): number {
  return clamp(i.telemetryInflation ?? 0);
}
export function detectGovernanceComplexity(i: DebtInputs): number {
  return clamp(i.governanceComplexity ?? 0);
}

export function calculateStructuralDebt(i: DebtInputs): number {
  return clamp(
    detectArchitecturalRedundancy(i) * 0.2 +
      detectOperationalOverengineering(i) * 0.2 +
      detectSemanticRedundancy(i) * 0.15 +
      detectAuthorityWaste(i) * 0.15 +
      detectTelemetryInflation(i) * 0.15 +
      detectGovernanceComplexity(i) * 0.15,
  );
}

export function buildDebtDistribution(i: DebtInputs): DebtDistribution[] {
  return [
    { label: "Redundância arquitetural", value: detectArchitecturalRedundancy(i) },
    { label: "Overengineering operacional", value: detectOperationalOverengineering(i) },
    { label: "Redundância semântica", value: detectSemanticRedundancy(i) },
    { label: "Desperdício de autoridade", value: detectAuthorityWaste(i) },
    { label: "Inflação de telemetria", value: detectTelemetryInflation(i) },
    { label: "Complexidade de governança", value: detectGovernanceComplexity(i) },
  ];
}
