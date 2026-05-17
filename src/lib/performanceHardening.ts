/**
 * Performance Hardening — read-only diagnostics for runtime weight.
 * Pure functions, no side effects.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface RouteWeight { path: string; componentCount: number; queryCount: number }
export interface DashboardWeight { name: string; widgets: number; queries: number }
export interface QueryUsage { key: string; usageCount: number; resultSize?: number }

export function detectHeavyRoutes(routes: RouteWeight[], threshold = 25): RouteWeight[] {
  return routes.filter((r) => r.componentCount + r.queryCount * 2 > threshold);
}

export function detectOversizedDashboards(dashboards: DashboardWeight[], threshold = 18): DashboardWeight[] {
  return dashboards.filter((d) => d.widgets + d.queries > threshold);
}

export function estimateHydrationPressure(componentCount: number, asyncCount: number): number {
  return clamp((componentCount * 0.3) + (asyncCount * 1.5));
}

export function estimateBundleFragmentation(chunkCount: number, avgChunkKb: number): number {
  if (chunkCount <= 0) return 0;
  const variance = chunkCount > 40 ? 30 : 0;
  return clamp((chunkCount * 0.8) + (avgChunkKb > 250 ? 20 : 0) + variance);
}

export function detectQueryOverfetching(queries: QueryUsage[]): QueryUsage[] {
  return queries.filter((q) => (q.resultSize ?? 0) > 500 && q.usageCount <= 2);
}

export function detectTelemetryOvercomputation(metricCount: number, baseline = 90): number {
  if (metricCount <= baseline) return 0;
  return clamp(((metricCount - baseline) / baseline) * 100);
}

export function buildPerformanceHardeningPlan(input: {
  heavyRoutes: number; oversizedDashboards: number; hydration: number;
  fragmentation: number; overfetching: number; overcomputation: number;
}): string[] {
  const out: string[] = [];
  if (input.heavyRoutes > 0) out.push(`Split ${input.heavyRoutes} heavy route(s) via lazy boundaries.`);
  if (input.oversizedDashboards > 0) out.push(`Tab-split ${input.oversizedDashboards} oversized dashboard(s).`);
  if (input.hydration > 60) out.push("Defer non-critical components below the fold.");
  if (input.fragmentation > 60) out.push("Consolidate small chunks via manualChunks.");
  if (input.overfetching > 0) out.push(`Trim payload of ${input.overfetching} query/queries.`);
  if (input.overcomputation > 50) out.push("Reduce telemetry footprint; keep only consumed metrics.");
  if (!out.length) out.push("Performance envelope healthy.");
  return out;
}

export function calculatePerformancePressure(input: {
  hydration: number; fragmentation: number; overcomputation: number;
}): number {
  return clamp((input.hydration + input.fragmentation + input.overcomputation) / 3);
}
