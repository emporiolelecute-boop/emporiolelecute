/**
 * Human Operations Layer — generates operational checklists and a
 * human decision queue. Pure data — no scheduling, no side-effects.
 */

export interface DecisionItem {
  id: string;
  topic: string;
  urgency: "low" | "medium" | "high";
  contextSummary?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  cadence: "weekly" | "monthly" | "quarterly";
}

export interface ExecutiveReviewSummary {
  cycle: "weekly" | "monthly" | "quarterly";
  highlights: string[];
  risks: string[];
  decisionsRequired: number;
}

export function buildWeeklyOperationalChecklist(): ChecklistItem[] {
  return [
    { id: "w-1", label: "Review SEO Executive Home KPIs", cadence: "weekly" },
    { id: "w-2", label: "Triage commercial opportunity radar", cadence: "weekly" },
    { id: "w-3", label: "Capture Operational Reality snapshot", cadence: "weekly" },
    { id: "w-4", label: "Inspect dashboard noise and prune unused widgets", cadence: "weekly" },
    { id: "w-5", label: "Verify sitemap status and indexation deltas", cadence: "weekly" },
  ];
}

export function buildMonthlyReviewChecklist(): ChecklistItem[] {
  return [
    { id: "m-1", label: "Review unused dashboards and metrics", cadence: "monthly" },
    { id: "m-2", label: "Validate documentation coverage", cadence: "monthly" },
    { id: "m-3", label: "Review pruning candidates and decide actions", cadence: "monthly" },
    { id: "m-4", label: "Audit performance pressure across admin routes", cadence: "monthly" },
    { id: "m-5", label: "Reconcile authority vs conversion outliers", cadence: "monthly" },
  ];
}

export function buildQuarterlyAuditChecklist(): ChecklistItem[] {
  return [
    { id: "q-1", label: "Full SEO OS sustainability audit", cadence: "quarterly" },
    { id: "q-2", label: "Decide pruning approvals (manual)", cadence: "quarterly" },
    { id: "q-3", label: "Review governance maturity & ownership", cadence: "quarterly" },
    { id: "q-4", label: "Refresh living documentation", cadence: "quarterly" },
    { id: "q-5", label: "Validate commercial intelligence assumptions", cadence: "quarterly" },
  ];
}

export function buildExecutiveReviewSummary(input: {
  cycle: "weekly" | "monthly" | "quarterly";
  highlights?: string[];
  risks?: string[];
  decisionsRequired?: number;
}): ExecutiveReviewSummary {
  return {
    cycle: input.cycle,
    highlights: input.highlights ?? [],
    risks: input.risks ?? [],
    decisionsRequired: input.decisionsRequired ?? 0,
  };
}

export function buildHumanDecisionQueue(items: DecisionItem[] = []): DecisionItem[] {
  const order: Record<DecisionItem["urgency"], number> = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => order[a.urgency] - order[b.urgency]);
}
