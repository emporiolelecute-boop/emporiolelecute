/**
 * Fase 15.2 — Scalability Engine.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ScalabilityInputs {
  currentVolume?: number;
  systemComplexity?: number;
  operationalDebt?: number;
  resilience?: number;
  authorityHeadroom?: number;
  semanticHeadroom?: number;
  executionHeadroom?: number;
}

export function calculateScalabilityScore(i: ScalabilityInputs): number {
  return clamp(
    (i.resilience ?? 50) * 0.3 +
      (i.executionHeadroom ?? 50) * 0.2 +
      (i.semanticHeadroom ?? 50) * 0.2 +
      (i.authorityHeadroom ?? 50) * 0.2 -
      (i.operationalDebt ?? 0) * 0.25 -
      (i.systemComplexity ?? 0) * 0.2,
  );
}

export function estimateScalingLimit(i: ScalabilityInputs): number {
  const headroom =
    ((i.executionHeadroom ?? 50) + (i.semanticHeadroom ?? 50) + (i.authorityHeadroom ?? 50)) / 3;
  return Math.round((i.currentVolume ?? 100) * (1 + headroom / 50));
}

export function estimateScalingFragility(i: ScalabilityInputs): number {
  return clamp((i.operationalDebt ?? 0) * 0.5 + (i.systemComplexity ?? 0) * 0.5);
}

export function estimateMaintenanceExplosion(i: ScalabilityInputs): number {
  return clamp((i.systemComplexity ?? 0) * 0.6 + (i.operationalDebt ?? 0) * 0.4);
}

export function estimateOperationalExpansionCost(i: ScalabilityInputs): number {
  return clamp(100 - (i.executionHeadroom ?? 50));
}
export function estimateSemanticExpansionCost(i: ScalabilityInputs): number {
  return clamp(100 - (i.semanticHeadroom ?? 50));
}
export function estimateAuthorityExpansionCost(i: ScalabilityInputs): number {
  return clamp(100 - (i.authorityHeadroom ?? 50));
}

export function detectScalingBottlenecks(i: ScalabilityInputs): string[] {
  const out: string[] = [];
  if ((i.executionHeadroom ?? 50) < 40) out.push("Execução sem folga para crescimento.");
  if ((i.semanticHeadroom ?? 50) < 40) out.push("Cobertura semântica próxima do limite.");
  if ((i.authorityHeadroom ?? 50) < 40) out.push("Autoridade saturada em clusters chave.");
  if ((i.operationalDebt ?? 0) > 60) out.push("Débito operacional limita expansão.");
  return out;
}
