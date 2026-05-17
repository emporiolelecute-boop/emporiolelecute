/**
 * Admin Performance Observability — read-only estimators for the
 * admin runtime: render cost, telemetry cost, React Query pressure,
 * bundle risk, hydration complexity and heavy routes.
 */

export interface DashboardWeightInput {
  route: string;
  components: number;
  asyncQueries?: number;
  chartCount?: number;
  tableCount?: number;
}

export interface TelemetryFlowInput {
  name: string;
  fields: number;
  emittersPerHour?: number;
}

export interface QueryProfileInput {
  key: string;
  refetchIntervalMs?: number;
  cacheConsumers?: number;
  payloadKb?: number;
}

export interface RouteProfileInput {
  route: string;
  estimatedJsKb?: number;
  componentCount?: number;
  hasCharts?: boolean;
}

export interface PerformanceRecommendation {
  area: string;
  severity: "low" | "medium" | "high";
  message: string;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export function estimateDashboardRenderCost(d: DashboardWeightInput): number {
  const base = d.components * 1.5 + (d.chartCount ?? 0) * 4 + (d.tableCount ?? 0) * 3;
  const async = (d.asyncQueries ?? 0) * 2;
  return clamp(Math.round(base + async));
}

export function estimateTelemetryCost(flows: TelemetryFlowInput[] = []): number {
  if (flows.length === 0) return 0;
  const cost = flows.reduce((s, f) => s + f.fields * Math.max(1, f.emittersPerHour ?? 1), 0);
  return clamp(Math.round(cost / 10));
}

export function estimateReactQueryPressure(queries: QueryProfileInput[] = []): number {
  if (queries.length === 0) return 0;
  const pressure = queries.reduce((s, q) => {
    const freq = q.refetchIntervalMs ? 3600_000 / Math.max(1000, q.refetchIntervalMs) : 1;
    const payload = q.payloadKb ?? 5;
    return s + freq * payload * Math.max(1, q.cacheConsumers ?? 1);
  }, 0);
  return clamp(Math.round(pressure / 50));
}

export function estimateBundleGrowthRisk(routes: RouteProfileInput[] = []): number {
  if (routes.length === 0) return 0;
  const totalKb = routes.reduce((s, r) => s + (r.estimatedJsKb ?? 0), 0);
  return clamp(Math.round((totalKb / 4000) * 100));
}

export function estimateHydrationComplexity(routes: RouteProfileInput[] = []): number {
  if (routes.length === 0) return 0;
  const total = routes.reduce(
    (s, r) => s + (r.componentCount ?? 0) + (r.hasCharts ? 8 : 0),
    0,
  );
  return clamp(Math.round(total / Math.max(1, routes.length)));
}

export function detectHeavyAdminRoutes(routes: RouteProfileInput[] = []): RouteProfileInput[] {
  return routes
    .filter((r) => (r.estimatedJsKb ?? 0) > 400 || (r.componentCount ?? 0) > 25)
    .sort((a, b) => (b.estimatedJsKb ?? 0) - (a.estimatedJsKb ?? 0));
}

export function buildPerformanceRecommendations(input: {
  renderCost?: number;
  telemetryCost?: number;
  queryPressure?: number;
  bundleRisk?: number;
  hydrationComplexity?: number;
}): PerformanceRecommendation[] {
  const rec: PerformanceRecommendation[] = [];
  if ((input.renderCost ?? 0) > 60)
    rec.push({ area: "rendering", severity: "high", message: "Split heavy dashboards or lazy-load charts." });
  if ((input.telemetryCost ?? 0) > 50)
    rec.push({ area: "telemetry", severity: "medium", message: "Prune low-signal telemetry fields." });
  if ((input.queryPressure ?? 0) > 50)
    rec.push({ area: "react-query", severity: "high", message: "Increase staleTime or batch related queries." });
  if ((input.bundleRisk ?? 0) > 60)
    rec.push({ area: "bundle", severity: "medium", message: "Lazy-load admin-only routes to shrink bundle." });
  if ((input.hydrationComplexity ?? 0) > 40)
    rec.push({ area: "hydration", severity: "low", message: "Consider component-level memoization." });
  return rec;
}
