/**
 * Fase 13.1 — Semantic Stability Engine.
 * Análise estrutural de estabilidade semântica (orientativo, sem efeitos colaterais).
 */

export interface StabilityEntity {
  id: string;
  cluster?: string | null;
  authority_score?: number;
  readiness_score?: number;
  internal_links_count?: number;
  topical_coverage?: number;
  authority_trend?: number; // -1..1
}

export interface StabilityResult {
  score: number;          // 0..100
  risk: "low" | "medium" | "high" | "critical";
  reasons: string[];
  recommendations: string[];
}

function clamp(v: number, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }

export function calculateSemanticStability(items: StabilityEntity[]): StabilityResult {
  if (!items.length) {
    return { score: 0, risk: "critical", reasons: ["Sem entidades"], recommendations: [] };
  }
  const auths = items.map((i) => i.authority_score ?? 0);
  const avg = auths.reduce((a, b) => a + b, 0) / auths.length;
  const variance = auths.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / auths.length;
  const stdev = Math.sqrt(variance);
  const orphanRate = items.filter((i) => (i.internal_links_count ?? 0) === 0).length / items.length;

  let score = 100;
  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (stdev > 25) { score -= 25; reasons.push("Alta variância de autoridade"); recommendations.push("Equilibrar distribuição de links entre entidades"); }
  if (orphanRate > 0.25) { score -= 20; reasons.push("Mais de 25% de entidades órfãs"); recommendations.push("Reduzir órfãos com linking contextual"); }
  if (avg < 30) { score -= 20; reasons.push("Autoridade média baixa"); recommendations.push("Reforçar conteúdo editorial dos hubs"); }

  score = clamp(score);
  const risk: StabilityResult["risk"] =
    score >= 75 ? "low" : score >= 55 ? "medium" : score >= 35 ? "high" : "critical";

  return { score, risk, reasons, recommendations };
}

export function detectVolatileClusters(items: StabilityEntity[]): Array<{ cluster: string; volatility: number }> {
  const map = new Map<string, number[]>();
  for (const i of items) {
    const key = i.cluster ?? "default";
    const arr = map.get(key) ?? [];
    arr.push(i.authority_trend ?? 0);
    map.set(key, arr);
  }
  return Array.from(map.entries()).map(([cluster, arr]) => {
    const avg = arr.reduce((a, b) => a + Math.abs(b), 0) / arr.length;
    return { cluster, volatility: Math.round(avg * 100) };
  }).filter((x) => x.volatility > 30).sort((a, b) => b.volatility - a.volatility);
}

export function detectAuthorityInstability(items: StabilityEntity[]): number {
  if (!items.length) return 0;
  const trends = items.map((i) => Math.abs(i.authority_trend ?? 0));
  return Math.round((trends.reduce((a, b) => a + b, 0) / trends.length) * 100);
}

export function calculateClusterDependency(items: StabilityEntity[]): Array<{ cluster: string; share: number; risk: "low" | "medium" | "high" }> {
  const total = items.reduce((s, i) => s + (i.authority_score ?? 0), 0) || 1;
  const map = new Map<string, number>();
  for (const i of items) {
    const key = i.cluster ?? "default";
    map.set(key, (map.get(key) ?? 0) + (i.authority_score ?? 0));
  }
  return Array.from(map.entries()).map(([cluster, sum]) => {
    const share = Math.round((sum / total) * 100);
    const risk = share > 65 ? "high" : share > 40 ? "medium" : "low";
    return { cluster, share, risk };
  }).sort((a, b) => b.share - a.share);
}

export function calculateSemanticBalance(items: StabilityEntity[]): number {
  const deps = calculateClusterDependency(items);
  if (!deps.length) return 0;
  const top = deps[0]?.share ?? 0;
  return clamp(100 - top);
}

export function detectOverCentralization(items: StabilityEntity[]): boolean {
  const deps = calculateClusterDependency(items);
  return deps.some((d) => d.share > 65);
}

export function calculateEntropyScore(items: StabilityEntity[]): number {
  const deps = calculateClusterDependency(items);
  if (!deps.length) return 0;
  const entropy = deps.reduce((s, d) => {
    const p = d.share / 100;
    return p > 0 ? s - p * Math.log2(p) : s;
  }, 0);
  // normalize: max entropy ~ log2(n)
  const max = Math.log2(deps.length || 1) || 1;
  return Math.round((entropy / max) * 100);
}
