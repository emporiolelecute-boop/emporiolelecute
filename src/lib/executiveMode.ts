/**
 * Executive Mode — KPI compression & priority synthesis (pure helpers, read-only).
 */

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ExecutiveKPI {
  id: string;
  label: string;
  value: number;
  trend?: "up" | "down" | "flat";
  weight?: number;
}

export interface PriorityAction {
  id: string;
  title: string;
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  category: string;
}

export interface OperationalAlert {
  id: string;
  severity: "info" | "warn" | "critical";
  message: string;
  area: string;
}

export interface QuickWin {
  id: string;
  title: string;
  estimatedImpact: number;
}

export interface ContentExecutionItem {
  id: string;
  title: string;
  type: "blog" | "page" | "product" | "taxonomy";
  status: "draft" | "review" | "ready";
}

/** Compress raw KPI list into max 12 executive-relevant entries. */
export function compressKPIs(kpis: ExecutiveKPI[], max = 12): ExecutiveKPI[] {
  return [...kpis]
    .sort((a, b) => (b.weight ?? 50) - (a.weight ?? 50))
    .slice(0, max);
}

/** Rank priority actions by impact/effort ratio. */
export function rankPriorityActions(actions: PriorityAction[]): PriorityAction[] {
  const score = (a: PriorityAction) => {
    const i = a.impact === "high" ? 3 : a.impact === "medium" ? 2 : 1;
    const e = a.effort === "high" ? 3 : a.effort === "medium" ? 2 : 1;
    return i / e;
  };
  return [...actions].sort((a, b) => score(b) - score(a));
}

/** Synthesize alerts — keep only critical+warn (suppress noise). */
export function synthesizeAlerts(alerts: OperationalAlert[]): OperationalAlert[] {
  return alerts.filter((a) => a.severity !== "info").slice(0, 10);
}

export function calculateExecutiveFocusScore(
  alerts: OperationalAlert[],
  actions: PriorityAction[],
): number {
  const noise = alerts.length;
  const focus = actions.filter((a) => a.impact === "high").length;
  const ratio = focus / Math.max(noise + focus, 1);
  return clamp(ratio * 100);
}

export function calculateExecutiveHealthScore(input: {
  authority?: number;
  content?: number;
  technical?: number;
  velocity?: number;
}): number {
  const vals = [input.authority, input.content, input.technical, input.velocity]
    .filter((v): v is number => typeof v === "number");
  if (!vals.length) return 0;
  return clamp(vals.reduce((s, v) => s + v, 0) / vals.length);
}

export function buildDailyExecutionQueue(
  items: ContentExecutionItem[],
  max = 8,
): ContentExecutionItem[] {
  const order: Record<ContentExecutionItem["status"], number> = {
    ready: 0,
    review: 1,
    draft: 2,
  };
  return [...items].sort((a, b) => order[a.status] - order[b.status]).slice(0, max);
}

export function calculateGrowthMomentum(input: {
  weeklyGrowth?: number;
  monthlyGrowth?: number;
  velocity?: number;
}): number {
  const w = input.weeklyGrowth ?? 0;
  const m = input.monthlyGrowth ?? 0;
  const v = input.velocity ?? 0;
  return clamp(w * 0.5 + m * 0.3 + v * 0.2);
}
