/**
 * Fase 13 — Execution Prioritization Engine.
 * Ordena ações por janela ROI/esforço e tipo.
 */

import type { DecisionResult } from "./seoDecisionEngine";

export interface PrioritizedAction {
  entityType: string;
  entityId: string;
  entitySlug?: string;
  entityName?: string;
  reason: string;
  opportunityScore: number;
  estimatedROI: number;
  effort: number;
  confidence: number;
  band: "quick_win" | "strategic" | "recovery";
}

export interface ExecutionQueues {
  quickWins: PrioritizedAction[];
  strategicWins: PrioritizedAction[];
  recoveryActions: PrioritizedAction[];
}

export function buildExecutionQueues(decisions: DecisionResult[]): ExecutionQueues {
  const enriched: PrioritizedAction[] = decisions.map((d) => {
    const ratio = d.estimatedROI / Math.max(1, d.executionEffort);
    let band: PrioritizedAction["band"] = "strategic";
    if (d.executionEffort <= 30 && d.estimatedROI >= 45) band = "quick_win";
    else if (d.risks.some((r) => r.includes("orphan") || r.includes("decay") || r.includes("regression"))) band = "recovery";

    return {
      entityType: d.entityType,
      entityId: d.entityId,
      entitySlug: d.entitySlug,
      entityName: d.entityName,
      reason: d.recommendations[0] ?? "ação editorial recomendada",
      opportunityScore: d.opportunityScore,
      estimatedROI: d.estimatedROI,
      effort: d.executionEffort,
      confidence: d.confidence,
      band,
    };
  });

  const byROI = [...enriched].sort((a, b) => b.estimatedROI - a.estimatedROI);

  return {
    quickWins: enriched.filter((e) => e.band === "quick_win").sort((a, b) => b.estimatedROI / Math.max(1, a.effort) - a.estimatedROI / Math.max(1, b.effort)).slice(0, 10),
    strategicWins: byROI.filter((e) => e.band === "strategic").slice(0, 10),
    recoveryActions: enriched.filter((e) => e.band === "recovery").sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 10),
  };
}

// Fase 13.2 — filas operacionais avançadas
export function buildOperationalQueue(decisions: DecisionResult[]): PrioritizedAction[] {
  return buildExecutionQueues(decisions).quickWins
    .concat(buildExecutionQueues(decisions).strategicWins)
    .sort((a, b) => b.estimatedROI / Math.max(1, a.effort) - a.estimatedROI / Math.max(1, b.effort))
    .slice(0, 20);
}

export function buildRecoveryQueue(decisions: DecisionResult[]): PrioritizedAction[] {
  return buildExecutionQueues(decisions).recoveryActions;
}

export function buildMaintenanceQueue(decisions: DecisionResult[]): PrioritizedAction[] {
  return decisions
    .filter((d) => d.executionEffort <= 20 && d.estimatedROI >= 25 && d.estimatedROI < 45)
    .map((d) => ({
      entityType: d.entityType,
      entityId: d.entityId,
      entitySlug: d.entitySlug,
      entityName: d.entityName,
      reason: "manutenção contínua",
      opportunityScore: d.opportunityScore,
      estimatedROI: d.estimatedROI,
      effort: d.executionEffort,
      confidence: d.confidence,
      band: "strategic" as const,
    }))
    .slice(0, 15);
}

export function buildCompoundingQueue(decisions: DecisionResult[]): PrioritizedAction[] {
  return decisions
    .filter((d) => d.estimatedROI >= 60 && d.confidence >= 0.6)
    .sort((a, b) => b.estimatedROI * b.confidence - a.estimatedROI * a.confidence)
    .map((d) => ({
      entityType: d.entityType,
      entityId: d.entityId,
      entitySlug: d.entitySlug,
      entityName: d.entityName,
      reason: "potencial de composição",
      opportunityScore: d.opportunityScore,
      estimatedROI: d.estimatedROI,
      effort: d.executionEffort,
      confidence: d.confidence,
      band: "strategic" as const,
    }))
    .slice(0, 10);
}

export interface ExecutionConflict {
  entityId: string;
  reason: string;
}
export function detectExecutionConflicts(decisions: DecisionResult[]): ExecutionConflict[] {
  const seen = new Map<string, number>();
  const out: ExecutionConflict[] = [];
  for (const d of decisions) {
    const k = d.entityId;
    seen.set(k, (seen.get(k) ?? 0) + 1);
    if ((seen.get(k) ?? 0) > 1) {
      out.push({ entityId: k, reason: "ações concorrentes na mesma entidade" });
    }
  }
  return out;
}

