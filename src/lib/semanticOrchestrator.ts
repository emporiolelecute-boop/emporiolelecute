/**
 * Fase 11.2 — Semantic Orchestrator (SAFE MODE).
 *
 * Cruza authority, maturity, content gaps e linking para gerar
 * a fila TOP de execução editorial. Não automatiza nada — apenas
 * prioriza para o humano.
 */

import type { EditorialTarget } from "./editorialPriorities";
import type { GapResult } from "./contentGapEngine";

export type OrchestratorEntityType =
  | EditorialTarget["type"]
  | "combination"
  | "product"
  | "blog_post"
  | "tag";

export interface OrchestratorItem {
  entityType: OrchestratorEntityType;
  entityId?: string;
  entityName: string;
  entitySlug: string;
  authority: number;
  maturity: number;
  readiness: number;
  impactScore: number;   // 0..100
  effortScore: number;   // 0..100 (menor = mais barato)
  priority: number;      // computado: impacto / effort
  actions: string[];
}

export interface OrchestratorInput {
  editorialTargets?: Array<EditorialTarget & { id?: string; maturity?: number }>;
  gaps?: Array<GapResult & { id?: string; maturity?: number; authority?: number; readiness?: number }>;
}

function effortFromActions(actions: string[]): number {
  // 5 ações grandes ~ effort 80. 1 ação ~ effort 20.
  if (actions.length === 0) return 10;
  return Math.min(95, 15 + actions.length * 12);
}

function priorityScore(impact: number, effort: number): number {
  const safeEffort = Math.max(10, effort);
  return Math.round((impact / safeEffort) * 50);
}

export function buildSemanticExecutionPlan(input: OrchestratorInput): OrchestratorItem[] {
  const items: OrchestratorItem[] = [];

  for (const t of input.editorialTargets ?? []) {
    const impact =
      (t.priority === "critical" ? 90 :
       t.priority === "high"     ? 75 :
       t.priority === "medium"   ? 55 : 35);
    const effort = effortFromActions(t.suggested_actions);
    items.push({
      entityType: t.type,
      entityId: t.id,
      entityName: t.name,
      entitySlug: t.slug,
      authority: t.authority,
      maturity: t.maturity ?? Math.round((t.authority + t.topicalCoverage + t.readiness) / 3),
      readiness: t.readiness,
      impactScore: impact,
      effortScore: effort,
      priority: priorityScore(impact, effort),
      actions: t.suggested_actions,
    });
  }

  for (const g of input.gaps ?? []) {
    const impact = g.opportunityScore;
    const effort = effortFromActions(g.suggestedActions);
    items.push({
      entityType: g.entityType,
      entityId: g.id,
      entityName: g.name,
      entitySlug: g.slug,
      authority: g.authority ?? 0,
      maturity: g.maturity ?? 0,
      readiness: g.readiness ?? 0,
      impactScore: impact,
      effortScore: effort,
      priority: priorityScore(impact, effort),
      actions: g.suggestedActions,
    });
  }

  // dedup por slug+tipo, mantendo melhor priority
  const dedup = new Map<string, OrchestratorItem>();
  for (const i of items) {
    const key = `${i.entityType}:${i.entitySlug}`;
    const prev = dedup.get(key);
    if (!prev || i.priority > prev.priority) dedup.set(key, i);
  }

  return Array.from(dedup.values())
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 20);
}
