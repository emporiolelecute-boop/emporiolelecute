/**
 * Final Phase — Executive UX Compression.
 * Compresses many metrics into decision-ready signals.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ExecutiveOverview {
  systemStatus: "HEALTHY" | "STABLE" | "WATCH" | "AT_RISK" | "CRITICAL";
  headlineScore: number;
  systemicTrend: "improving" | "stable" | "declining";
}

export function buildExecutiveOverview(scores: number[]): ExecutiveOverview {
  if (!scores.length) return { systemStatus: "WATCH", headlineScore: 0, systemicTrend: "stable" };
  const avg = clamp(scores.reduce((a, b) => a + b, 0) / scores.length);
  const status: ExecutiveOverview["systemStatus"] =
    avg >= 85 ? "HEALTHY" : avg >= 70 ? "STABLE" : avg >= 55 ? "WATCH" : avg >= 40 ? "AT_RISK" : "CRITICAL";
  return { systemStatus: status, headlineScore: avg, systemicTrend: "stable" };
}

export function buildTopStrategicPriorities(items: Array<{ name: string; weight: number }>): string[] {
  return [...items].sort((a, b) => b.weight - a.weight).slice(0, 5).map((i) => i.name);
}

export function buildTopCriticalRisks(items: Array<{ name: string; severity: number }>): string[] {
  return [...items].sort((a, b) => b.severity - a.severity).slice(0, 5).map((i) => i.name);
}

export function buildTopExecutionActions(items: Array<{ name: string; leverage: number }>): string[] {
  return [...items].sort((a, b) => b.leverage - a.leverage).slice(0, 5).map((i) => i.name);
}

export function buildSuppressionHighlights(items: Array<{ name: string; cost: number }>): string[] {
  return [...items].sort((a, b) => b.cost - a.cost).slice(0, 5).map((i) => i.name);
}

export function buildExecutiveFocusAreas(scores: Record<string, number>): string[] {
  return Object.entries(scores)
    .filter(([, v]) => v < 60)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([k]) => k);
}

export function compressOperationalNarrative(overview: ExecutiveOverview, priorities: string[], risks: string[]): string {
  return [
    `Status: ${overview.systemStatus} (${overview.headlineScore}).`,
    priorities.length ? `Prioridades: ${priorities.slice(0, 3).join(", ")}.` : "",
    risks.length ? `Riscos críticos: ${risks.slice(0, 3).join(", ")}.` : "",
  ].filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Final Phase — UX compression helpers (additive, read-only)
// ---------------------------------------------------------------------------

export interface WidgetCandidate { id: string; importance: number; lastInteractionDaysAgo: number }

export function prioritizeExecutiveWidgets(widgets: WidgetCandidate[], topN = 12): string[] {
  return [...widgets]
    .sort((a, b) => b.importance - a.importance || a.lastInteractionDaysAgo - b.lastInteractionDaysAgo)
    .slice(0, topN)
    .map((w) => w.id);
}

export function detectDashboardNoise(dashboards: number, activeDashboards: number): number {
  if (dashboards === 0) return 0;
  const idle = Math.max(0, dashboards - activeDashboards);
  return clamp((idle / dashboards) * 100);
}

export function buildExecutiveSummaryCards(scores: Record<string, number>): Array<{ label: string; value: number }> {
  return Object.entries(scores).slice(0, 6).map(([label, value]) => ({ label, value }));
}

export function compressNavigationDepth(maxDepth: number, baseline = 3): number {
  if (maxDepth <= baseline) return 0;
  return clamp(((maxDepth - baseline) / baseline) * 100);
}

export function calculateCognitiveLoad(input: {
  widgets: number; metrics: number; dashboards: number;
}): number {
  const score = input.widgets * 1.1 + input.metrics * 0.2 + input.dashboards * 1.5;
  return clamp(score);
}

export function suggestUiSimplification(input: {
  noise: number; cognitiveLoad: number; navDepth: number;
}): string[] {
  const out: string[] = [];
  if (input.noise > 50) out.push("Esconder dashboards inativos.");
  if (input.cognitiveLoad > 60) out.push("Reduzir widgets por tela para ≤ 12.");
  if (input.navDepth > 40) out.push("Achatar a navegação admin para ≤ 3 níveis.");
  if (!out.length) out.push("UX executiva dentro do envelope confortável.");
  return out;
}
