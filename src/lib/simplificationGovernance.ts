/**
 * Simplification Governance — read-only diagnostics for long-term sustainability.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ComponentValue { name: string; complexity: number; valueScore: number; usageCount: number }

export function detectComplexityWithoutValue(items: ComponentValue[]): ComponentValue[] {
  return items
    .filter((i) => i.complexity >= 50 && i.valueScore <= 30)
    .sort((a, b) => b.complexity - a.complexity);
}

export function estimateMaintenanceLiability(items: ComponentValue[]): number {
  if (!items.length) return 0;
  const liability = items.reduce((s, i) => s + Math.max(0, i.complexity - i.valueScore), 0);
  return clamp(liability / items.length);
}

export function detectOperationalBloat(input: {
  dashboards: number; engines: number; libs: number;
}): number {
  const baseline = 14 + 25 + 60;
  const total = input.dashboards + input.engines + input.libs;
  if (total <= baseline) return 0;
  return clamp(((total - baseline) / baseline) * 100);
}

export interface BacklogItem { id: string; name: string; reason: string; priority: "low" | "medium" | "high" }

export function buildSimplificationBacklog(input: {
  complexityWithoutValue: ComponentValue[]; unusedItems?: string[];
}): BacklogItem[] {
  const a = input.complexityWithoutValue.map<BacklogItem>((c) => ({
    id: c.name,
    name: c.name,
    reason: `Complexity ${c.complexity} vs value ${c.valueScore}`,
    priority: c.complexity > 75 ? "high" : "medium",
  }));
  const u = (input.unusedItems ?? []).map<BacklogItem>((n) => ({
    id: n, name: n, reason: "No active consumers detected", priority: "low",
  }));
  return [...a, ...u];
}

export function calculateSustainableComplexity(input: {
  bloat: number; liability: number; backlogSize: number;
}): number {
  const penalty = input.bloat * 0.4 + input.liability * 0.4 + Math.min(20, input.backlogSize);
  return clamp(100 - penalty);
}
