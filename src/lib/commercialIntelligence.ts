/**
 * Commercial Intelligence — read-only analytical correlations between
 * SEO signals (authority, reviews, themes) and commercial potential.
 * Does NOT touch checkout, gateways or sales.
 */

export interface AuthorityConversionInput {
  url: string;
  authorityScore?: number; // 0..100
  conversionRate?: number; // 0..1
  monthlyVisits?: number;
}

export interface ReviewSalesInput {
  productSlug: string;
  reviewCount?: number;
  averageRating?: number; // 0..5
  estimatedSalesPotential?: number; // arbitrary unit
}

export interface ThemeIntentInput {
  theme: string;
  commercialIntentScore?: number; // 0..100
  productsLinked?: number;
}

export interface CorrelationResult {
  pearson: number;
  sampleSize: number;
}

export interface OpportunityEntry {
  id: string;
  kind: "authority-gap" | "review-leverage" | "theme-intent";
  score: number; // 0..100
  rationale: string;
}

function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = xs.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const my = ys.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const ax = xs[i] - mx;
    const ay = ys[i] - my;
    num += ax * ay;
    dx += ax * ax;
    dy += ay * ay;
  }
  const denom = Math.sqrt(dx * dy);
  if (!Number.isFinite(denom) || denom === 0) return 0;
  return Math.round((num / denom) * 1000) / 1000;
}

export function correlateAuthorityVsConversion(input: AuthorityConversionInput[] = []): CorrelationResult {
  const xs = input.map((r) => r.authorityScore ?? 0);
  const ys = input.map((r) => (r.conversionRate ?? 0) * 100);
  return { pearson: pearson(xs, ys), sampleSize: input.length };
}

export function correlateReviewsVsSalesPotential(input: ReviewSalesInput[] = []): CorrelationResult {
  const xs = input.map((r) => (r.reviewCount ?? 0) * (r.averageRating ?? 0));
  const ys = input.map((r) => r.estimatedSalesPotential ?? 0);
  return { pearson: pearson(xs, ys), sampleSize: input.length };
}

export function correlateThemesVsCommercialIntent(input: ThemeIntentInput[] = []): CorrelationResult {
  const xs = input.map((r) => r.commercialIntentScore ?? 0);
  const ys = input.map((r) => r.productsLinked ?? 0);
  return { pearson: pearson(xs, ys), sampleSize: input.length };
}

export function detectHighAuthorityLowConversion(input: AuthorityConversionInput[] = []): OpportunityEntry[] {
  return input
    .filter((r) => (r.authorityScore ?? 0) >= 60 && (r.conversionRate ?? 0) < 0.005)
    .map((r) => ({
      id: r.url,
      kind: "authority-gap",
      score: Math.round((r.authorityScore ?? 0) - (r.conversionRate ?? 0) * 100 * 20),
      rationale: `Authority ${r.authorityScore} but conversion ${(((r.conversionRate ?? 0) * 100)).toFixed(2)}%`,
    }));
}

export function detectCommercialBlindspots(themes: ThemeIntentInput[] = []): OpportunityEntry[] {
  return themes
    .filter((t) => (t.commercialIntentScore ?? 0) >= 60 && (t.productsLinked ?? 0) <= 1)
    .map((t) => ({
      id: t.theme,
      kind: "theme-intent",
      score: Math.min(100, (t.commercialIntentScore ?? 0)),
      rationale: `High intent theme with only ${t.productsLinked ?? 0} product(s)`,
    }));
}

export function buildCommercialOpportunityMap(input: {
  authority?: AuthorityConversionInput[];
  reviews?: ReviewSalesInput[];
  themes?: ThemeIntentInput[];
}): OpportunityEntry[] {
  const a = detectHighAuthorityLowConversion(input.authority ?? []);
  const t = detectCommercialBlindspots(input.themes ?? []);
  const r = (input.reviews ?? [])
    .filter((rv) => (rv.reviewCount ?? 0) < 3 && (rv.estimatedSalesPotential ?? 0) > 0)
    .map<OpportunityEntry>((rv) => ({
      id: rv.productSlug,
      kind: "review-leverage",
      score: Math.min(100, Math.round((rv.estimatedSalesPotential ?? 0) * 0.5)),
      rationale: `Low review volume (${rv.reviewCount ?? 0}) on product with sales potential`,
    }));
  return [...a, ...t, ...r].sort((x, y) => y.score - x.score);
}
