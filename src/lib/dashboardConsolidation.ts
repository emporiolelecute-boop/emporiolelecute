/**
 * Dashboard Consolidation — pure analytical helpers.
 */
import type { DashboardDescriptor, RedundancyHit } from "./systemAudit";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface MergeCandidate {
  primary: string;
  secondary: string;
  overlap: number;
  recommendation: "merge" | "tab" | "widget";
  sharedSurface: string[];
}

export function buildMergeCandidates(
  dashboards: DashboardDescriptor[],
  redundancy: RedundancyHit[],
): MergeCandidate[] {
  const byId = new Map(dashboards.map((d) => [d.id, d]));
  return redundancy.map((r) => {
    const a = byId.get(r.a);
    const b = byId.get(r.b);
    const primary =
      (a?.usageScore ?? 0) >= (b?.usageScore ?? 0) ? r.a : r.b;
    const secondary = primary === r.a ? r.b : r.a;
    const recommendation: MergeCandidate["recommendation"] =
      r.overlap >= 75 ? "merge" : r.overlap >= 55 ? "tab" : "widget";
    return {
      primary,
      secondary,
      overlap: r.overlap,
      recommendation,
      sharedSurface: r.sharedResponsibilities,
    };
  });
}

export function detectThinDashboards(
  dashboards: DashboardDescriptor[],
): string[] {
  return dashboards
    .filter(
      (d) =>
        d.responsibilities.length <= 2 && (d.incrementalValue ?? 0) < 30,
    )
    .map((d) => d.id);
}

export function detectWidgetCandidates(
  dashboards: DashboardDescriptor[],
): string[] {
  return dashboards
    .filter(
      (d) =>
        d.responsibilities.length <= 1 || (d.incrementalValue ?? 0) < 20,
    )
    .map((d) => d.id);
}

export function detectDuplicatedTelemetry(
  dashboards: DashboardDescriptor[],
): string[] {
  const seen = new Map<string, string[]>();
  for (const d of dashboards) {
    for (const r of d.responsibilities) {
      const k = r.toLowerCase();
      (seen.get(k) ?? seen.set(k, []).get(k)!).push(d.id);
    }
  }
  return [...seen.entries()]
    .filter(([, ids]) => ids.length >= 3)
    .map(([k]) => k);
}

export function consolidationImpactScore(
  candidates: MergeCandidate[],
  total: number,
): number {
  if (total === 0) return 0;
  const reducible = candidates.length;
  return clamp((reducible / total) * 100);
}
