/**
 * Fase 14.2 — Semantic Entropy Engine.
 */
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export interface EntropyInputs {
  clusters: Array<{ key: string; weight: number; coherence: number }>;
  noiseSignals: number;
  meaningOverlap: number;
}

export function calculateSemanticEntropy(i: EntropyInputs): number {
  const total = i.clusters.reduce((a, c) => a + c.weight, 0) || 1;
  const probs = i.clusters.map((c) => c.weight / total).filter((p) => p > 0);
  const H = -probs.reduce((a, p) => a + p * Math.log2(p), 0);
  const maxH = Math.log2(Math.max(2, probs.length));
  return Math.round((H / maxH) * 100);
}

export function detectEntropyAcceleration(series: number[]): number {
  if (series.length < 2) return 0;
  const deltas = series.slice(1).map((v, idx) => v - series[idx]);
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  return Math.round(clamp(50 + avg * 2));
}

export function detectSemanticNoise(noise: number, signal: number): number {
  const ratio = noise / Math.max(1, signal);
  return Math.round(clamp(ratio * 50));
}

export function detectMeaningDilution(overlap: number, clusterCount: number): number {
  const dilution = overlap * Math.log2(Math.max(2, clusterCount));
  return Math.round(clamp(dilution));
}

export function calculateClusterEntropy(cluster: { coherence: number; spread: number }): number {
  return Math.round(clamp(100 - cluster.coherence + cluster.spread / 2));
}

export function detectAuthorityDispersion(weights: number[]): number {
  if (!weights.length) return 0;
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const norm = weights.map((w) => w / total);
  const variance = norm.reduce((a, p) => a + Math.pow(p - 1 / norm.length, 2), 0);
  return Math.round(clamp(100 - variance * 1000));
}

export interface EntropyMapEntry { key: string; entropy: number; risk: "low" | "medium" | "high"; }
export function buildEntropyMap(clusters: EntropyInputs["clusters"]): EntropyMapEntry[] {
  return clusters.map((c) => {
    const entropy = calculateClusterEntropy({ coherence: c.coherence, spread: c.weight });
    const risk: EntropyMapEntry["risk"] = entropy > 70 ? "high" : entropy > 45 ? "medium" : "low";
    return { key: c.key, entropy, risk };
  });
}
