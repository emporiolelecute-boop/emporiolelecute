/**
 * Admin Performance Compression — diagnostic helpers (pure, read-only).
 */

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface RouteChunk {
  path: string;
  estimatedKb: number;
  componentCount?: number;
  queryCount?: number;
}

export interface SidebarRenderProfile {
  totalItems: number;
  visibleItems: number;
  collapsibleGroups: number;
}

export function analyzeRouteChunks(routes: RouteChunk[]): {
  heavy: RouteChunk[];
  totalKb: number;
  avgKb: number;
} {
  const totalKb = routes.reduce((s, r) => s + r.estimatedKb, 0);
  const avgKb = routes.length ? totalKb / routes.length : 0;
  const heavy = routes.filter((r) => r.estimatedKb > avgKb * 1.5);
  return { heavy, totalKb: Math.round(totalKb), avgKb: Math.round(avgKb) };
}

export function calculateDashboardWeight(route: RouteChunk): number {
  return clamp(
    route.estimatedKb * 0.4 +
      (route.componentCount ?? 0) * 1.5 +
      (route.queryCount ?? 0) * 3,
  );
}

export function calculateSidebarRenderCost(p: SidebarRenderProfile): number {
  return clamp(p.totalItems * 0.6 + p.collapsibleGroups * 1.5);
}

export function calculateTelemetryRenderDensity(kpisPerRoute: number[]): number {
  if (!kpisPerRoute.length) return 0;
  const avg = kpisPerRoute.reduce((s, n) => s + n, 0) / kpisPerRoute.length;
  return clamp(avg * 2);
}

export function calculateHydrationPressure(routes: RouteChunk[]): number {
  if (!routes.length) return 0;
  const avg =
    routes.reduce((s, r) => s + (r.componentCount ?? 0), 0) / routes.length;
  return clamp(avg * 1.5);
}

export function detectOverRenderRisk(routes: RouteChunk[]): RouteChunk[] {
  return routes.filter(
    (r) => (r.componentCount ?? 0) > 30 || (r.queryCount ?? 0) > 10,
  );
}

export function calculateLazyGroupingScore(routes: RouteChunk[]): number {
  if (!routes.length) return 100;
  const lazy = routes.filter((r) => r.estimatedKb < 200).length;
  return clamp((lazy / routes.length) * 100);
}

export function buildDefaultRouteProfile(): RouteChunk[] {
  return [
    { path: "/admin", estimatedKb: 120, componentCount: 14, queryCount: 4 },
    { path: "/admin/executive-mode", estimatedKb: 90, componentCount: 12, queryCount: 3 },
    { path: "/admin/seo-os", estimatedKb: 380, componentCount: 32, queryCount: 8 },
    { path: "/admin/seo-war-room", estimatedKb: 320, componentCount: 28, queryCount: 7 },
    { path: "/admin/seo-control-tower", estimatedKb: 340, componentCount: 30, queryCount: 9 },
    { path: "/admin/seo-civilization", estimatedKb: 420, componentCount: 36, queryCount: 12 },
    { path: "/admin/seo-singularity", estimatedKb: 440, componentCount: 40, queryCount: 14 },
    { path: "/admin/seo-system-audit", estimatedKb: 280, componentCount: 22, queryCount: 5 },
    { path: "/admin/seo-final-governance", estimatedKb: 290, componentCount: 24, queryCount: 6 },
    { path: "/admin/seo-operational-reality", estimatedKb: 260, componentCount: 22, queryCount: 5 },
    { path: "/admin/seo-operational-consolidation", estimatedKb: 220, componentCount: 18, queryCount: 4 },
  ];
}
