/**
 * Phase 17 — Metric Compression Engine (pure, read-only).
 */
import type { CanonMetric, CoreMetricsCanon } from "./coreMetricsCanon";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface ExecutiveSignal {
  key: string;
  label: string;
  value: number;          // 0..100
  composition: string[];  // source metric names
  weights: Record<string, number>;
  confidence: number;     // 0..100
}

const SIGNAL_MAP: Record<string, { label: string; sources: string[] }> = {
  systemic_consistency_index: { label: "Systemic Consistency", sources: ["coherence_matrix_score", "integrity_grid_score", "stability_fabric_score", "temporal_coherence_score"] },
  operational_clarity_index: { label: "Operational Clarity", sources: ["operational_continuity_score", "operational_harmony_score", "operational_alignment_score", "execution_efficiency"] },
  semantic_strength_index: { label: "Semantic Strength", sources: ["knowledge_health_score", "semantic_roi_avg", "coherence_matrix_score"] },
  execution_pressure_index: { label: "Execution Pressure", sources: ["execution_efficiency", "operational_continuity_score"] },
  resilience_index: { label: "Resilience", sources: ["resilience_continuity_score", "resilience_integrity_score", "resilience_unification_score"] },
  strategic_focus_index: { label: "Strategic Focus", sources: ["executive_core_score", "semantic_roi_avg", "strategic_reality_score"] },
  governance_integrity_index: { label: "Governance Integrity", sources: ["governance_matrix_score", "integrity_grid_score"] },
  authority_quality_index: { label: "Authority Quality", sources: ["authority_growth_projection", "knowledge_health_score"] },
};

function valueFor(name: string, metrics: CanonMetric[]): number {
  // Read-only proxy: use metric weight as a deterministic stand-in for current value.
  const m = metrics.find((x) => x.name === name);
  return m ? clamp(m.weight * 0.6 + m.executiveImpact * 0.4) : 0;
}

export function buildUnifiedExecutiveSignals(canon: CoreMetricsCanon): ExecutiveSignal[] {
  return Object.entries(SIGNAL_MAP).map(([key, cfg]) => {
    const present = cfg.sources.filter((s) => canon.metrics.some((m) => m.name === s));
    const weights: Record<string, number> = {};
    let sum = 0;
    present.forEach((p) => {
      const m = canon.metrics.find((x) => x.name === p)!;
      weights[p] = m.weight;
      sum += m.weight;
    });
    let value = 0;
    present.forEach((p) => {
      const w = sum > 0 ? weights[p] / sum : 1 / Math.max(present.length, 1);
      value += valueFor(p, canon.metrics) * w;
    });
    const confidence = clamp((present.length / cfg.sources.length) * 100);
    return { key, label: cfg.label, value: clamp(value), composition: present, weights, confidence };
  });
}

export interface CompressedSignalMap {
  signals: ExecutiveSignal[];
  raw_metric_count: number;
  compressed_signal_count: number;
  compression_ratio: number; // 0..1
}

export function buildCompressedSignalMap(canon: CoreMetricsCanon): CompressedSignalMap {
  const signals = buildUnifiedExecutiveSignals(canon);
  return {
    signals,
    raw_metric_count: canon.metrics.length,
    compressed_signal_count: signals.length,
    compression_ratio: +(signals.length / Math.max(canon.metrics.length, 1)).toFixed(3),
  };
}

export function compressRedundantSignals(canon: CoreMetricsCanon): { removed: string[]; kept: string[] } {
  const removed = canon.metrics.filter((m) => m.category === "REDUNDANT" || m.category === "DEPRECATED").map((m) => m.name);
  const kept = canon.metrics.filter((m) => !removed.includes(m.name)).map((m) => m.name);
  return { removed, kept };
}

export function calculateSignalEntropy(canon: CoreMetricsCanon): number {
  // Higher entropy = more dispersion across many low-weight metrics.
  const total = canon.metrics.length;
  const lowWeight = canon.metrics.filter((m) => m.weight < 60).length;
  const redundant = canon.metrics.filter((m) => m.redundancy >= 50).length;
  return clamp((lowWeight / total) * 50 + (redundant / total) * 50);
}

export function calculateObservabilityNoise(canon: CoreMetricsCanon): number {
  const total = canon.metrics.length;
  const noisy = canon.metrics.filter((m) => m.usage < 30 || m.redundancy >= 60).length;
  return clamp((noisy / total) * 100);
}

export function detectSignalInflation(canon: CoreMetricsCanon): {
  inflation_score: number;
  inflated_metrics: string[];
} {
  const inflated = canon.metrics
    .filter((m) => m.redundancy >= 60 && m.executiveImpact < 60)
    .map((m) => m.name);
  return {
    inflation_score: clamp((inflated.length / canon.metrics.length) * 100),
    inflated_metrics: inflated,
  };
}
