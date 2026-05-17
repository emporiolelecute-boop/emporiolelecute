/**
 * Final Phase — Performance Stabilization.
 * Diagnostic-only estimators for system load and future risk.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface SelectorProfile { selector: string; rowsScanned: number; avgMs: number }
export interface AggregationProfile { name: string; complexity: number }

export function detectHeavySelectors(profiles: SelectorProfile[]): string[] {
  return profiles.filter((p) => p.avgMs > 200 || p.rowsScanned > 5000).map((p) => p.selector);
}

export function detectExpensiveAggregations(items: AggregationProfile[]): string[] {
  return items.filter((i) => i.complexity > 70).map((i) => i.name);
}

export function detectRedundantCalculations(calls: Array<{ name: string; count: number }>): string[] {
  return calls.filter((c) => c.count > 10).map((c) => c.name);
}

export function estimateTelemetryLoad(metricCount: number, snapshotsPerDay: number): number {
  return clamp((metricCount * snapshotsPerDay) / 50);
}

export function estimateSnapshotGrowth(snapshotsTotal: number, daysAlive: number): number {
  if (daysAlive <= 0) return 0;
  return clamp((snapshotsTotal / daysAlive) * 30 / 100 * 100);
}

export function buildPerformancePressureMap(input: {
  heavySelectors: number; expensiveAggs: number; telemetryLoad: number; snapshotGrowth: number;
}): Record<string, number> {
  return {
    db: clamp(input.heavySelectors * 10 + input.expensiveAggs * 8),
    telemetry: clamp(input.telemetryLoad),
    storage: clamp(input.snapshotGrowth),
  };
}

export function estimateFutureScalabilityRisk(map: Record<string, number>): number {
  const vals = Object.values(map);
  if (!vals.length) return 0;
  return clamp(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ---------------------------------------------------------------------------
// Final Phase — additional performance estimators (additive, read-only)
// ---------------------------------------------------------------------------

export function detectHeavyTelemetryFlows(flows: Array<{ name: string; recordsPerHour: number }>): string[] {
  return flows.filter((f) => f.recordsPerHour > 5000).map((f) => f.name);
}

export function detectOverlappingComputations(items: Array<{ name: string; signature: string }>): string[] {
  const sigs: Record<string, string[]> = {};
  for (const i of items) (sigs[i.signature] ??= []).push(i.name);
  const out: string[] = [];
  for (const names of Object.values(sigs)) if (names.length > 1) out.push(...names);
  return out;
}

export function estimateDashboardWeight(input: { widgets: number; charts: number; queries: number }): number {
  return clamp(input.widgets * 1.2 + input.charts * 2 + input.queries * 1.5);
}

export function calculateSystemLatencyRisk(input: {
  heavyFlows: number; overlapping: number; dashboardWeight: number;
}): number {
  return clamp(input.heavyFlows * 8 + input.overlapping * 4 + input.dashboardWeight * 0.3);
}

export function calculateScalabilityScore(input: {
  latencyRisk: number; snapshotGrowth: number; telemetryLoad: number;
}): number {
  return clamp(100 - (input.latencyRisk + input.snapshotGrowth + input.telemetryLoad) / 3);
}

export function buildOptimizationSuggestions(input: {
  heavyFlows: string[]; overlapping: string[]; latencyRisk: number;
}): string[] {
  const out: string[] = [];
  if (input.heavyFlows.length) out.push(`Throttle/agregar ${input.heavyFlows.length} fluxo(s) pesado(s).`);
  if (input.overlapping.length) out.push(`Unificar ${input.overlapping.length} cálculo(s) redundante(s).`);
  if (input.latencyRisk > 60) out.push("Mover agregações para snapshot manual ou materialized view.");
  if (!out.length) out.push("Sem otimizações urgentes detectadas.");
  return out;
}
