/**
 * Fase 15 — SEO Kernel.
 * Read-only. Consolidates kernel-level coherence.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type KernelVerdict =
  | "OPTIMAL"
  | "COHERENT"
  | "STABLE"
  | "FRAGMENTED"
  | "OVERLOADED"
  | "COLLAPSING";

export interface KernelInputs {
  totalEngines: number;
  totalMetrics: number;
  redundantMetrics: number;
  overlappingEngines: number;
  deprecatedMetrics: number;
  opaqueMetrics: number;
  untraceableMetrics: number;
}

export function calculateMetricRedundancy(i: KernelInputs): number {
  if (i.totalMetrics === 0) return 0;
  return clamp((i.redundantMetrics / i.totalMetrics) * 100);
}

export function calculateEngineOverlap(i: KernelInputs): number {
  if (i.totalEngines === 0) return 0;
  return clamp((i.overlappingEngines / i.totalEngines) * 100);
}

export function calculateArchitecturalEntropy(i: KernelInputs): number {
  return clamp(
    calculateMetricRedundancy(i) * 0.4 +
    calculateEngineOverlap(i) * 0.4 +
    ((i.untraceableMetrics / Math.max(1, i.totalMetrics)) * 100) * 0.2,
  );
}

export function calculateOperationalCompression(i: KernelInputs): number {
  // higher = better compression (lower redundancy/opacity)
  const opacity = (i.opaqueMetrics / Math.max(1, i.totalMetrics)) * 100;
  return clamp(100 - (calculateMetricRedundancy(i) * 0.5 + opacity * 0.5));
}

export function calculateSystemCompression(i: KernelInputs): number {
  return clamp(
    calculateOperationalCompression(i) * 0.6 +
    (100 - calculateEngineOverlap(i)) * 0.4,
  );
}

export function calculateOrchestrationStability(i: KernelInputs, t: TelemetrySnapshot): number {
  return clamp(
    (100 - calculateEngineOverlap(i)) * 0.5 +
    (t.systemic_synchronization_score ?? 0) * 0.3 +
    (t.structural_integrity_score ?? 0) * 0.2,
  );
}

export function calculateMaintainability(i: KernelInputs, t: TelemetrySnapshot): number {
  const debt = (t.operational_debt_score ?? 0);
  return clamp(
    (100 - calculateArchitecturalEntropy(i)) * 0.4 +
    (100 - debt) * 0.3 +
    calculateOperationalCompression(i) * 0.3,
  );
}

export function calculateKernelCoherence(i: KernelInputs, t: TelemetrySnapshot): number {
  return clamp(
    (100 - calculateArchitecturalEntropy(i)) * 0.3 +
    calculateOrchestrationStability(i, t) * 0.25 +
    calculateMaintainability(i, t) * 0.25 +
    calculateSystemCompression(i) * 0.2,
  );
}

export interface KernelReport {
  verdict: KernelVerdict;
  coherence: number;
  redundancy: number;
  overlap: number;
  entropy: number;
  compression: number;
  orchestration: number;
  maintainability: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  overlaps: string[];
  redundancies: string[];
  compression_opportunities: string[];
  maintenance_risks: string[];
  orchestration_conflicts: string[];
}

export function buildKernelVerdict(i: KernelInputs, t: TelemetrySnapshot): KernelReport {
  const coherence = calculateKernelCoherence(i, t);
  const redundancy = calculateMetricRedundancy(i);
  const overlap = calculateEngineOverlap(i);
  const entropy = calculateArchitecturalEntropy(i);
  const compression = calculateSystemCompression(i);
  const orchestration = calculateOrchestrationStability(i, t);
  const maintainability = calculateMaintainability(i, t);

  let verdict: KernelVerdict = "STABLE";
  if (coherence >= 90) verdict = "OPTIMAL";
  else if (coherence >= 78) verdict = "COHERENT";
  else if (coherence >= 62) verdict = "STABLE";
  else if (coherence >= 45) verdict = "FRAGMENTED";
  else if (coherence >= 30) verdict = "OVERLOADED";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (compression >= 75) strengths.push("Alta compressão operacional.");
  if (orchestration >= 75) strengths.push("Orquestração estável.");
  if (maintainability >= 75) strengths.push("Manutenibilidade saudável.");

  const weaknesses: string[] = [];
  if (redundancy > 35) weaknesses.push("Redundância de métricas elevada.");
  if (overlap > 35) weaknesses.push("Sobreposição de engines significativa.");
  if (entropy > 50) weaknesses.push("Entropia arquitetural acima do tolerável.");

  const overlaps: string[] = [];
  if (overlap > 25) overlaps.push(`${i.overlappingEngines}/${i.totalEngines} engines com domínio sobreposto.`);

  const redundancies: string[] = [];
  if (redundancy > 25) redundancies.push(`${i.redundantMetrics}/${i.totalMetrics} métricas redundantes detectadas.`);

  const compression_opportunities: string[] = [];
  if (i.opaqueMetrics > 0) compression_opportunities.push(`${i.opaqueMetrics} métricas opacas candidatas a consolidação.`);
  if (i.deprecatedMetrics > 0) compression_opportunities.push(`${i.deprecatedMetrics} métricas deprecated podem ser removidas.`);

  const maintenance_risks: string[] = [];
  if (maintainability < 55) maintenance_risks.push("Custo de manutenção crescente.");
  if ((t.operational_debt_score ?? 0) > 50) maintenance_risks.push("Dívida operacional elevada.");

  const orchestration_conflicts: string[] = [];
  if (orchestration < 55) orchestration_conflicts.push("Orquestração fragmentada entre engines.");

  const summary = `Kernel ${verdict.toLowerCase()} (${coherence}). Redundância ${redundancy}, overlap ${overlap}, entropia ${entropy}.`;

  return {
    verdict, coherence, redundancy, overlap, entropy, compression, orchestration, maintainability,
    summary, strengths, weaknesses, overlaps, redundancies,
    compression_opportunities, maintenance_risks, orchestration_conflicts,
  };
}
