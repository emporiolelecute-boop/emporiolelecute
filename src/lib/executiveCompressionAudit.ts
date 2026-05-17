/**
 * Executive Compression Audit — read-only.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DashboardSignals {
  id: string;
  kpiCount: number;
  actionableKpis: number;
  uniqueInsights: number;
  duplicatedInsights: number;
}

export function detectSignalInflation(d: DashboardSignals): number {
  if (d.kpiCount === 0) return 0;
  const ratio = d.actionableKpis / d.kpiCount;
  return clamp((1 - ratio) * 100);
}

export function detectKpiOverload(d: DashboardSignals, ceiling = 8): number {
  if (d.kpiCount <= ceiling) return 0;
  return clamp(((d.kpiCount - ceiling) / ceiling) * 100);
}

export function calculateActionabilityScore(d: DashboardSignals): number {
  if (d.kpiCount === 0) return 0;
  return clamp((d.actionableKpis / d.kpiCount) * 100);
}

export function calculateExecutiveReadability(d: DashboardSignals): number {
  const inflation = detectSignalInflation(d);
  const overload = detectKpiOverload(d);
  return clamp(100 - inflation * 0.5 - overload * 0.5);
}

export function detectAnalyticsTheater(d: DashboardSignals): boolean {
  return d.kpiCount >= 10 && calculateActionabilityScore(d) < 30;
}

export function calculateOperationalFatigue(
  dashboards: DashboardSignals[],
): number {
  if (!dashboards.length) return 0;
  const inflation =
    dashboards.reduce((a, d) => a + detectSignalInflation(d), 0) /
    dashboards.length;
  const overload =
    dashboards.reduce((a, d) => a + detectKpiOverload(d), 0) /
    dashboards.length;
  const theaterCount = dashboards.filter(detectAnalyticsTheater).length;
  return clamp(
    inflation * 0.4 + overload * 0.4 + (theaterCount / dashboards.length) * 60,
  );
}

export function calculateCompressionScore(input: {
  totalKpis: number;
  actionableKpis: number;
  uniqueInsights: number;
  duplicatedInsights: number;
}): number {
  if (input.totalKpis === 0) return 0;
  const action = (input.actionableKpis / input.totalKpis) * 100;
  const uniqueRatio =
    input.uniqueInsights /
    Math.max(1, input.uniqueInsights + input.duplicatedInsights);
  return clamp(action * 0.6 + uniqueRatio * 100 * 0.4);
}

export interface ExecutiveAuditSummary {
  fatigue: number;
  compression: number;
  theaterCount: number;
  inflatedDashboards: string[];
  overloadedDashboards: string[];
}

export function buildExecutiveAuditSummary(
  dashboards: DashboardSignals[],
): ExecutiveAuditSummary {
  const totalKpis = dashboards.reduce((a, d) => a + d.kpiCount, 0);
  const actionable = dashboards.reduce((a, d) => a + d.actionableKpis, 0);
  const unique = dashboards.reduce((a, d) => a + d.uniqueInsights, 0);
  const dupes = dashboards.reduce((a, d) => a + d.duplicatedInsights, 0);
  return {
    fatigue: calculateOperationalFatigue(dashboards),
    compression: calculateCompressionScore({
      totalKpis,
      actionableKpis: actionable,
      uniqueInsights: unique,
      duplicatedInsights: dupes,
    }),
    theaterCount: dashboards.filter(detectAnalyticsTheater).length,
    inflatedDashboards: dashboards
      .filter((d) => detectSignalInflation(d) >= 60)
      .map((d) => d.id),
    overloadedDashboards: dashboards
      .filter((d) => detectKpiOverload(d) >= 40)
      .map((d) => d.id),
  };
}
