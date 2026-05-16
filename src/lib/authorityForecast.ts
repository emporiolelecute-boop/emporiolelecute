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

// Fase 13.1 — Expansões: decay, colapso, distribuição, recuperação e teto.

export type ForecastScenario = "optimistic" | "stable" | "fragile" | "collapsing";

export interface DecayForecast {
  scenario: ForecastScenario;
  decayPer30d: number;
  projectedAuthority30d: number;
  projectedAuthority90d: number;
}

export function forecastDecay(i: ForecastInput): DecayForecast {
  const trend = i.growthTrend ?? 0;
  const editorial = i.editorialExpansionRate ?? 0;
  const scenario: ForecastScenario =
    trend > 0.3 ? "optimistic" :
    trend > 0 ? "stable" :
    trend > -0.3 ? "fragile" : "collapsing";

  const decayPer30d = Math.max(0, Math.round((-trend) * 10 + (editorial < 0.1 ? 4 : 0)));
  return {
    scenario,
    decayPer30d,
    projectedAuthority30d: Math.max(0, i.currentAuthority - decayPer30d),
    projectedAuthority90d: Math.max(0, i.currentAuthority - decayPer30d * 2.5),
  };
}

export function forecastClusterCollapse(items: ForecastInput[]): number {
  if (!items.length) return 0;
  const collapsing = items.filter((i) => (i.growthTrend ?? 0) < -0.4).length;
  return Math.round((collapsing / items.length) * 100);
}

export function forecastAuthorityDistribution(items: ForecastInput[]): {
  topShare: number;
  giniLike: number;
} {
  if (!items.length) return { topShare: 0, giniLike: 0 };
  const auths = items.map((i) => i.currentAuthority).sort((a, b) => b - a);
  const total = auths.reduce((a, b) => a + b, 0) || 1;
  const top = auths.slice(0, Math.max(1, Math.ceil(auths.length * 0.2))).reduce((a, b) => a + b, 0);
  const topShare = Math.round((top / total) * 100);
  const mean = total / auths.length;
  const dispersion = auths.reduce((s, v) => s + Math.abs(v - mean), 0) / (2 * auths.length * mean || 1);
  return { topShare, giniLike: Math.round(dispersion * 100) };
}

export function estimateRecoveryDifficulty(i: ForecastInput): number {
  const trend = i.growthTrend ?? 0;
  const exec = i.executionsLast30d ?? 0;
  let d = 50;
  if (trend < 0) d += Math.min(40, Math.abs(trend) * 80);
  if (exec < 2) d += 10;
  if ((i.semanticConnectivity ?? 0) < 30) d += 10;
  return Math.max(0, Math.min(100, Math.round(d)));
}

export function estimateGrowthCeiling(i: ForecastInput): number {
  const base = i.currentAuthority;
  const ceiling = base + 30 + ((i.semanticConnectivity ?? 0) / 5) + ((i.editorialExpansionRate ?? 0) * 20);
  return Math.max(0, Math.min(100, Math.round(ceiling)));
}
