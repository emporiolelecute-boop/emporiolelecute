/**
 * Fase 13.1 — Saturation Engine.
 * Detecta saturação semântica e overlap (somente leitura).
 */

export interface SaturationEntity {
  id: string;
  cluster?: string | null;
  topical_coverage?: number;
  internal_links_count?: number;
  editorial_size?: number;
  similarity_score?: number; // 0..1 vs siblings
}

export type SaturationBucket = "Untapped" | "Growing" | "Competitive" | "Saturated" | "Overloaded";

export interface SaturationResult {
  bucket: SaturationBucket;
  score: number;
  reasons: string[];
}

export function calculateSaturation(cluster: SaturationEntity[]): SaturationResult {
  const n = cluster.length;
  if (n === 0) return { bucket: "Untapped", score: 0, reasons: ["Sem entidades"] };

  const avgSimilarity = cluster.reduce((s, e) => s + (e.similarity_score ?? 0), 0) / n;
  const avgLinks = cluster.reduce((s, e) => s + (e.internal_links_count ?? 0), 0) / n;
  const avgEditorial = cluster.reduce((s, e) => s + (e.editorial_size ?? 0), 0) / n;

  let score = 0;
  const reasons: string[] = [];

  score += Math.min(40, n * 3);
  if (avgSimilarity > 0.7) { score += 25; reasons.push("Alta similaridade editorial"); }
  if (avgLinks > 25) { score += 15; reasons.push("Excesso de links internos repetidos"); }
  if (avgEditorial < 200) { score += 10; reasons.push("Baixa diferenciação editorial"); }

  score = Math.min(100, Math.round(score));

  const bucket: SaturationBucket =
    score < 20 ? "Untapped" :
    score < 45 ? "Growing" :
    score < 65 ? "Competitive" :
    score < 85 ? "Saturated" : "Overloaded";

  return { bucket, score, reasons };
}

export function detectTopicExhaustion(cluster: SaturationEntity[]): boolean {
  const r = calculateSaturation(cluster);
  return r.bucket === "Saturated" || r.bucket === "Overloaded";
}

export function detectKeywordCannibalizationTrend(cluster: SaturationEntity[]): number {
  if (!cluster.length) return 0;
  const avg = cluster.reduce((s, e) => s + (e.similarity_score ?? 0), 0) / cluster.length;
  return Math.round(avg * 100);
}

export function detectExcessiveOverlap(cluster: SaturationEntity[]): boolean {
  return detectKeywordCannibalizationTrend(cluster) > 70;
}

export function estimateRemainingOpportunity(cluster: SaturationEntity[]): number {
  const r = calculateSaturation(cluster);
  return Math.max(0, 100 - r.score);
}

export function buildSaturationBuckets(
  clusters: Record<string, SaturationEntity[]>
): Array<{ cluster: string } & SaturationResult> {
  return Object.entries(clusters).map(([cluster, items]) => ({
    cluster,
    ...calculateSaturation(items),
  }));
}
