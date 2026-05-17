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
