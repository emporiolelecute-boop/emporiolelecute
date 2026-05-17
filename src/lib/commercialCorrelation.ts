/**
 * Commercial Correlation Layer — read-only analytical correlations.
 * NO checkout/payment integrations. NO mutation of business logic.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const ax = xs[i] - mx, ay = ys[i] - my;
    num += ax * ay; dx += ax * ax; dy += ay * ay;
  }
  const d = Math.sqrt(dx * dy);
  return d === 0 ? 0 : Math.round((num / d) * 1000) / 1000;
}

export interface ThemeRevenue { theme: string; revenuePotential?: number; productsLinked?: number }
export interface AuthorityIntent { url: string; authority?: number; commercialIntent?: number }
export interface ReviewTrust { slug: string; reviews?: number; trustScore?: number; conversion?: number }
export interface TaxonomyDepth { taxonomy: string; depth?: number; salesOpportunity?: number }
export interface CommercialEntity { id: string; signalStrength?: number; commercialActivation?: number }

export interface CorrelationOut { pearson: number; sampleSize: number }

export function correlateThemesVsRevenuePotential(rows: ThemeRevenue[] = []): CorrelationOut {
  return {
    pearson: pearson(rows.map((r) => r.productsLinked ?? 0), rows.map((r) => r.revenuePotential ?? 0)),
    sampleSize: rows.length,
  };
}

export function correlateAuthorityVsCommercialIntent(rows: AuthorityIntent[] = []): CorrelationOut {
  return {
    pearson: pearson(rows.map((r) => r.authority ?? 0), rows.map((r) => r.commercialIntent ?? 0)),
    sampleSize: rows.length,
  };
}

export function correlateReviewsVsConversionTrust(rows: ReviewTrust[] = []): CorrelationOut {
  return {
    pearson: pearson(
      rows.map((r) => (r.reviews ?? 0) * (r.trustScore ?? 0)),
      rows.map((r) => (r.conversion ?? 0) * 100)
    ),
    sampleSize: rows.length,
  };
}

export function correlateTaxonomyDepthVsSalesOpportunity(rows: TaxonomyDepth[] = []): CorrelationOut {
  return {
    pearson: pearson(rows.map((r) => r.depth ?? 0), rows.map((r) => r.salesOpportunity ?? 0)),
    sampleSize: rows.length,
  };
}

export function detectCommerciallyUnderleveragedEntities(rows: CommercialEntity[] = []): CommercialEntity[] {
  return rows
    .filter((r) => (r.signalStrength ?? 0) >= 60 && (r.commercialActivation ?? 0) < 30)
    .sort((a, b) => (b.signalStrength ?? 0) - (a.signalStrength ?? 0));
}

export interface PriorityEntry { id: string; score: number; rationale: string }

export function buildCommercialPriorityMatrix(input: {
  underleveraged?: CommercialEntity[];
  authorityCorr?: CorrelationOut;
  themeCorr?: CorrelationOut;
}): PriorityEntry[] {
  const u = (input.underleveraged ?? []).map<PriorityEntry>((e) => ({
    id: e.id,
    score: clamp((e.signalStrength ?? 0) - (e.commercialActivation ?? 0)),
    rationale: `Signal ${e.signalStrength ?? 0}, activation ${e.commercialActivation ?? 0}`,
  }));
  return u.sort((a, b) => b.score - a.score).slice(0, 30);
}

export function calculateCommercialLeverage(input: {
  underleveragedCount: number; authorityPearson: number; themePearson: number;
}): number {
  const positivity = ((input.authorityPearson + input.themePearson) / 2 + 1) * 50;
  const penalty = Math.min(50, input.underleveragedCount * 2);
  return clamp(positivity - penalty + 30);
}
