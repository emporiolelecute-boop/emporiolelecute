/**
 * Fase 13 — Authority Forecast Engine.
 * Projeção heurística por horizonte (30/90/180 dias).
 */

export interface ForecastInput {
  currentAuthority: number;
  currentReadiness: number;
  currentMaturity?: number;
  currentCoverage?: number;
  growthTrend?: number;          // -1..1 (ex.: derivado de snapshots)
  semanticConnectivity?: number; // 0..100
  reviewVelocity?: number;       // reviews/mês
  editorialExpansionRate?: number; // 0..1
  executionsLast30d?: number;
}

export interface ForecastPoint {
  horizonDays: 30 | 90 | 180;
  authority: number;
  readiness: number;
  maturity: number;
  coverage: number;
  confidence: number;
}

function clamp(v: number) { return Math.max(0, Math.min(100, Math.round(v))); }

export function projectAuthorityGrowth(i: ForecastInput): ForecastPoint[] {
  const baseDrive =
    (i.growthTrend ?? 0) * 10 +
    ((i.semanticConnectivity ?? 0) / 100) * 5 +
    Math.min(8, (i.reviewVelocity ?? 0)) +
    ((i.editorialExpansionRate ?? 0) * 6) +
    Math.min(6, (i.executionsLast30d ?? 0) * 0.5);

  const horizons: (30 | 90 | 180)[] = [30, 90, 180];
  return horizons.map((h, idx) => {
    const factor = [1, 2.2, 3.6][idx];
    const a = clamp(i.currentAuthority + baseDrive * factor);
    const r = clamp(i.currentReadiness + baseDrive * factor * 0.9);
    const m = clamp((i.currentMaturity ?? 50) + baseDrive * factor * 0.8);
    const c = clamp((i.currentCoverage ?? 50) + baseDrive * factor * 0.7);
    const confidence = Math.max(30, 85 - idx * 18);
    return { horizonDays: h, authority: a, readiness: r, maturity: m, coverage: c, confidence };
  });
}
