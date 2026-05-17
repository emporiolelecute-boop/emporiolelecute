/**
 * Final Phase — Telemetry Pruning.
 * Classifies metric value without removing anything.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export type TelemetryClass =
  | "CORE" | "ACTIVE" | "SUPPORTING" | "EXPERIMENTAL" | "LEGACY" | "PRUNABLE" | "ARCHIVED";

export interface MetricUsage {
  metric: string;
  consumers: number;
  variance: number;
  lastReadDaysAgo: number;
  overlapsWith?: string[];
}

export function detectTelemetryObesity(total: number, baseline = 80): number {
  if (total <= baseline) return 0;
  return clamp(((total - baseline) / baseline) * 100);
}

export function classifyTelemetryImportance(m: MetricUsage): TelemetryClass {
  if (m.consumers >= 5 && m.variance > 5) return "CORE";
  if (m.consumers >= 3) return "ACTIVE";
  if (m.consumers >= 1 && m.lastReadDaysAgo < 30) return "SUPPORTING";
  if (m.consumers >= 1 && m.lastReadDaysAgo < 90) return "EXPERIMENTAL";
  if (m.lastReadDaysAgo >= 180) return "ARCHIVED";
  if ((m.overlapsWith?.length ?? 0) >= 2) return "PRUNABLE";
  return "LEGACY";
}

export function detectLowSignalMetrics(metrics: MetricUsage[]): string[] {
  return metrics.filter((m) => m.variance < 1).map((m) => m.metric);
}

export function detectNeverUsedMetrics(metrics: MetricUsage[]): string[] {
  return metrics.filter((m) => m.consumers === 0).map((m) => m.metric);
}

export function detectOverlappingTelemetry(metrics: MetricUsage[]): string[] {
  return metrics.filter((m) => (m.overlapsWith?.length ?? 0) >= 2).map((m) => m.metric);
}

export function buildTelemetryRetentionMap(metrics: MetricUsage[]): Record<TelemetryClass, string[]> {
  const out: Record<TelemetryClass, string[]> = {
    CORE: [], ACTIVE: [], SUPPORTING: [], EXPERIMENTAL: [], LEGACY: [], PRUNABLE: [], ARCHIVED: [],
  };
  for (const m of metrics) out[classifyTelemetryImportance(m)].push(m.metric);
  return out;
}

export function estimateTelemetryMaintenanceCost(metrics: MetricUsage[]): number {
  const map = buildTelemetryRetentionMap(metrics);
  const cost = map.CORE.length * 1 + map.ACTIVE.length * 2 + map.SUPPORTING.length * 3 +
    map.EXPERIMENTAL.length * 4 + map.LEGACY.length * 5 + map.PRUNABLE.length * 6 + map.ARCHIVED.length * 2;
  return clamp(cost);
}
