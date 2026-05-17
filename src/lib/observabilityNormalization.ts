/**
 * Phase 17 — Observability Normalization (pure, read-only).
 */
import type { CoreMetricsCanon } from "./coreMetricsCanon";
import { calculateObservabilityNoise, calculateSignalEntropy } from "./metricCompression";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface NormalizedTelemetry {
  before_count: number;
  after_count: number;
  drop_ratio: number; // 0..1
  kept: string[];
  dropped: string[];
}

export function normalizeTelemetry(canon: CoreMetricsCanon): NormalizedTelemetry {
  const kept = canon.metrics.filter((m) => m.category === "CORE" || m.category === "DERIVED" || m.category === "DIAGNOSTIC")
    .map((m) => m.name);
  const dropped = canon.metrics.filter((m) => !kept.includes(m.name)).map((m) => m.name);
  return {
    before_count: canon.metrics.length,
    after_count: kept.length,
    drop_ratio: +(dropped.length / Math.max(canon.metrics.length, 1)).toFixed(3),
    kept,
    dropped,
  };
}

export interface NormalizedScore { name: string; raw: number; normalized: number }

export function normalizeScores(scores: { name: string; value: number }[]): NormalizedScore[] {
  if (!scores.length) return [];
  const values = scores.map((s) => s.value);
  const max = Math.max(...values, 1);
  return scores.map((s) => ({
    name: s.name,
    raw: s.value,
    normalized: clamp((s.value / max) * 100),
  }));
}

export function detectScoreInflation(scores: { name: string; value: number }[]): {
  inflation_score: number;
  inflated: string[];
} {
  // Inflation = many scores clustered above 90 with low dispersion.
  const high = scores.filter((s) => s.value >= 90);
  const ratio = high.length / Math.max(scores.length, 1);
  return {
    inflation_score: clamp(ratio * 100),
    inflated: high.map((s) => s.name),
  };
}

export function detectArtificialComplexity(canon: CoreMetricsCanon): number {
  const derived = canon.metrics.filter((m) => m.dependencies.length >= 2).length;
  const total = canon.metrics.length || 1;
  return clamp((derived / total) * 100);
}

export function calculateObservabilityEfficiency(canon: CoreMetricsCanon): number {
  const noise = calculateObservabilityNoise(canon);
  const entropy = calculateSignalEntropy(canon);
  return clamp(100 - (noise * 0.55 + entropy * 0.45));
}

export function calculateSignalToNoiseRatio(canon: CoreMetricsCanon): number {
  const signal = canon.metrics.filter((m) => m.category === "CORE").length;
  const noise = canon.metrics.filter((m) => m.category === "REDUNDANT" || m.category === "DEPRECATED").length;
  if (noise === 0) return signal > 0 ? 100 : 0;
  return clamp((signal / (signal + noise)) * 100);
}
