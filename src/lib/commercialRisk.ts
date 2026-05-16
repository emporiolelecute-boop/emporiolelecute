/**
 * Fase 13.1 — Commercial Risk Engine.
 * Mapeia exposição comercial e diversidade de intenção.
 */

export interface CommercialEntity {
  id: string;
  cluster?: string | null;
  authority_score?: number;
  business_intent_score?: number; // 0..100
  conversion_potential?: number;  // 0..100
  reviews_count?: number;
  editorial_size?: number;
  has_cta?: boolean;
  revenue_estimate?: number;
}

export interface CommercialRiskResult {
  exposure_score: number;       // 0..100, maior = mais arriscado
  diversity_score: number;      // 0..100, maior = mais saudável
  intent_mismatch_count: number;
  weak_clusters: string[];
  reasons: string[];
}

export function calculateCommercialExposure(items: CommercialEntity[]): number {
  if (!items.length) return 0;
  const totalRev = items.reduce((s, i) => s + (i.revenue_estimate ?? 0), 0) || 1;
  const top = [...items].sort((a, b) => (b.revenue_estimate ?? 0) - (a.revenue_estimate ?? 0)).slice(0, 3);
  const topShare = top.reduce((s, i) => s + (i.revenue_estimate ?? 0), 0) / totalRev;
  return Math.round(topShare * 100);
}

export function detectRevenueDependency(items: CommercialEntity[]): Array<{ cluster: string; share: number }> {
  const total = items.reduce((s, i) => s + (i.revenue_estimate ?? 0), 0) || 1;
  const map = new Map<string, number>();
  for (const i of items) {
    const key = i.cluster ?? "default";
    map.set(key, (map.get(key) ?? 0) + (i.revenue_estimate ?? 0));
  }
  return Array.from(map.entries())
    .map(([cluster, sum]) => ({ cluster, share: Math.round((sum / total) * 100) }))
    .sort((a, b) => b.share - a.share);
}

export function detectWeakCommercialClusters(items: CommercialEntity[]): string[] {
  const map = new Map<string, CommercialEntity[]>();
  for (const i of items) {
    const k = i.cluster ?? "default";
    const arr = map.get(k) ?? [];
    arr.push(i);
    map.set(k, arr);
  }
  const weak: string[] = [];
  for (const [cluster, arr] of map) {
    const reviews = arr.reduce((s, i) => s + (i.reviews_count ?? 0), 0);
    const editorial = arr.reduce((s, i) => s + (i.editorial_size ?? 0), 0);
    const ctas = arr.filter((i) => i.has_cta).length;
    if (reviews < arr.length * 2 || editorial < arr.length * 100 || ctas < arr.length / 2) {
      weak.push(cluster);
    }
  }
  return weak;
}

export function calculateCommercialDiversity(items: CommercialEntity[]): number {
  const deps = detectRevenueDependency(items);
  if (!deps.length) return 0;
  const top = deps[0]?.share ?? 0;
  return Math.max(0, Math.min(100, 100 - top));
}

export function detectIntentMismatch(items: CommercialEntity[]): number {
  return items.filter((i) => {
    const auth = i.authority_score ?? 0;
    const intent = i.business_intent_score ?? 0;
    return (auth > 60 && intent < 30) || (intent > 60 && (i.editorial_size ?? 0) < 200);
  }).length;
}

export function buildCommercialRiskMap(items: CommercialEntity[]): CommercialRiskResult {
  const exposure_score = calculateCommercialExposure(items);
  const diversity_score = calculateCommercialDiversity(items);
  const weak_clusters = detectWeakCommercialClusters(items);
  const intent_mismatch_count = detectIntentMismatch(items);
  const reasons: string[] = [];
  if (exposure_score > 60) reasons.push("Receita concentrada em poucos clusters");
  if (weak_clusters.length > 0) reasons.push(`${weak_clusters.length} cluster(s) sem suporte comercial adequado`);
  if (intent_mismatch_count > 0) reasons.push(`${intent_mismatch_count} entidades com mismatch autoridade/intenção`);
  return { exposure_score, diversity_score, intent_mismatch_count, weak_clusters, reasons };
}
