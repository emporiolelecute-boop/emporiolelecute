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
