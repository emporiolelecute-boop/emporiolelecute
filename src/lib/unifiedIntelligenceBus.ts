/**
 * Fase 15.1 — Unified Intelligence Bus.
 * Normalizes engine signals and aggregates them into deterministic system fingerprints.
 * Pure helpers — read-only, no side effects.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

const avg = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);
const safe = (n: number | undefined | null) => (typeof n === "number" && Number.isFinite(n) ? n : 0);

export type UnifiedVerdict =
  | "TRANSCENDENT"
  | "HYPER_STABLE"
  | "STABLE"
  | "VOLATILE"
  | "FRAGMENTED"
  | "COLLAPSING";

export interface UnifiedBusSignature {
  operational: Record<string, number>;
  intelligence: Record<string, number>;
  governance: Record<string, number>;
  semantic: Record<string, number>;
  authority: Record<string, number>;
  resilience: Record<string, number>;
  continuity: Record<string, number>;
  anomaly: Record<string, number>;
  explainability: Record<string, number>;
}

export interface UnifiedBusResult {
  signatures: UnifiedBusSignature;
  scores: {
    kernel_score: number;
    coherence_score: number;
    resilience_score: number;
    entropy_score: number;
    observability_score: number;
    anomaly_score: number;
    governance_score: number;
    system_consistency_score: number;
    future_viability_score: number;
    consensus_score: number;
    alignment_score: number;
    bus_stability: number;
    bus_entropy: number;
  };
  fingerprints: {
    operational: string;
    strategic: string;
    evolution: string;
  };
  verdict: UnifiedVerdict;
  reasons: string[];
}

export function normalizeSystemSignals(t: Partial<TelemetrySnapshot>): UnifiedBusSignature {
  return {
    operational: {
      operational_score: clamp(safe(t.operational_score)),
      execution_efficiency: clamp(safe(t.execution_efficiency)),
      operational_debt_score: clamp(safe(t.operational_debt_score)),
      maintenance_pressure_score: clamp(safe(t.maintenance_pressure_score)),
    },
    intelligence: {
      meta_intelligence_score: clamp(safe(t.meta_intelligence_score)),
      strategic_awareness_score: clamp(safe(t.strategic_awareness_score)),
      kernel_coherence_score: clamp(safe(t.kernel_coherence_score)),
      explainability_score: clamp(safe(t.explainability_score)),
    },
    governance: {
      governance_score: clamp(safe(t.governance_score)),
      governance_drift_score: clamp(safe(t.governance_drift_score)),
      strategic_governability_score: clamp(safe(t.strategic_governability_score)),
      systemic_consistency_score: clamp(safe(t.systemic_consistency_score)),
    },
    semantic: {
      semantic_stability_score: clamp(safe(t.semantic_stability_score)),
      semantic_cohesion_score: clamp(safe(t.semantic_cohesion_score)),
      semantic_continuity_score: clamp(safe(t.semantic_continuity_score)),
      semantic_drift_score: clamp(safe(t.semantic_drift_score)),
    },
    authority: {
      authority_distribution_score: clamp(safe(t.authority_distribution_score)),
      authority_persistence_score: clamp(safe(t.authority_persistence_score)),
      authority_balance_score: clamp(safe(t.authority_balance_score)),
      authority_entropy: clamp(safe(t.authority_entropy)),
    },
    resilience: {
      resilience_score: clamp(safe(t.resilience_score)),
      collapse_resistance_score: clamp(safe(t.collapse_resistance_score)),
      resilience_forecast_score: clamp(safe(t.resilience_forecast_score)),
      recovery_continuity_score: clamp(safe(t.recovery_continuity_score)),
    },
    continuity: {
      continuity_depth_score: clamp(safe(t.continuity_depth_score)),
      execution_continuity_score: clamp(safe(t.execution_continuity_score)),
      long_horizon_survivability_score: clamp(safe(t.long_horizon_survivability_score)),
      sustainability_continuity_score: clamp(safe(t.sustainability_continuity_score)),
    },
    anomaly: {
      systemic_noise_score: clamp(safe(t.systemic_noise_score)),
      strategic_noise_score: clamp(safe(t.strategic_noise_score)),
      operational_noise_score: clamp(safe(t.operational_noise_score)),
      false_growth_signal_score: clamp(safe(t.false_growth_signal_score)),
    },
    explainability: {
      explainability_score: clamp(safe(t.explainability_score)),
      lineage_integrity_score: clamp(safe(t.lineage_integrity_score)),
      tracing_coverage_score: clamp(safe(t.tracing_coverage_score)),
      confidence_integrity_score: clamp(safe(t.confidence_integrity_score)),
    },
  };
}

const groupAvg = (g: Record<string, number>) => clamp(avg(Object.values(g)));
const groupInverseAvg = (g: Record<string, number>, invertKeys: string[]) => {
  const xs = Object.entries(g).map(([k, v]) => (invertKeys.includes(k) ? 100 - v : v));
  return clamp(avg(xs));
};

export const aggregateKernelSignals = (s: UnifiedBusSignature) =>
  clamp((groupAvg(s.intelligence) + groupAvg(s.explainability)) / 2);

export const aggregateGovernanceSignals = (s: UnifiedBusSignature) =>
  groupInverseAvg(s.governance, ["governance_drift_score"]);

export const aggregateSemanticSignals = (s: UnifiedBusSignature) =>
  groupInverseAvg(s.semantic, ["semantic_drift_score"]);

export const aggregateAuthoritySignals = (s: UnifiedBusSignature) =>
  groupInverseAvg(s.authority, ["authority_entropy"]);

export const aggregateResilienceSignals = (s: UnifiedBusSignature) => groupAvg(s.resilience);

const hashSignals = (obj: Record<string, number>): string => {
  const entries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
  let h = 0;
  for (const [k, v] of entries) {
    const seed = `${k}:${Math.round(v)}|`;
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) | 0;
    }
  }
  return `sig_${(h >>> 0).toString(16).padStart(8, "0")}`;
};

export function buildOperationalFingerprint(s: UnifiedBusSignature): string {
  return hashSignals({ ...s.operational, ...s.anomaly });
}
export function buildStrategicFingerprint(s: UnifiedBusSignature): string {
  return hashSignals({ ...s.intelligence, ...s.governance, ...s.semantic });
}
export function buildEvolutionFingerprint(s: UnifiedBusSignature): string {
  return hashSignals({ ...s.resilience, ...s.continuity, ...s.authority });
}

export function detectSignalInconsistency(s: UnifiedBusSignature): string[] {
  const out: string[] = [];
  const gov = s.governance.governance_score;
  const drift = s.governance.governance_drift_score;
  if (gov > 75 && drift > 60) out.push("Governança alta vs drift alto.");
  const sem = s.semantic.semantic_stability_score;
  const semDrift = s.semantic.semantic_drift_score;
  if (sem > 75 && semDrift > 60) out.push("Estabilidade semântica alta vs drift alto.");
  const auth = s.authority.authority_distribution_score;
  const authEnt = s.authority.authority_entropy;
  if (auth > 75 && authEnt > 60) out.push("Distribuição de autoridade alta vs entropia alta.");
  return out;
}

export function detectMetricVariance(values: Record<string, number[]>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, arr] of Object.entries(values)) {
    if (arr.length < 2) {
      out[k] = 0;
      continue;
    }
    const m = avg(arr);
    const variance = avg(arr.map((v) => (v - m) ** 2));
    out[k] = clamp(Math.sqrt(variance));
  }
  return out;
}

export function calculateBusStability(s: UnifiedBusSignature): number {
  const groups = [
    groupAvg(s.operational),
    aggregateKernelSignals(s),
    aggregateGovernanceSignals(s),
    aggregateSemanticSignals(s),
    aggregateAuthoritySignals(s),
    aggregateResilienceSignals(s),
  ];
  const m = avg(groups);
  const variance = avg(groups.map((g) => (g - m) ** 2));
  return clamp(100 - Math.sqrt(variance));
}

export function calculateBusEntropy(s: UnifiedBusSignature): number {
  const noise = avg(Object.values(s.anomaly));
  const drift = s.semantic.semantic_drift_score;
  const govDrift = s.governance.governance_drift_score;
  return clamp((noise + drift + govDrift) / 3);
}

export function calculateSystemConsensus(s: UnifiedBusSignature): number {
  const groups = [
    aggregateKernelSignals(s),
    aggregateGovernanceSignals(s),
    aggregateSemanticSignals(s),
    aggregateAuthoritySignals(s),
    aggregateResilienceSignals(s),
  ];
  const m = avg(groups);
  const dispersion = avg(groups.map((g) => Math.abs(g - m)));
  return clamp(100 - dispersion * 1.5);
}

export function calculateCrossEngineAlignment(s: UnifiedBusSignature): number {
  const pairs: Array<[number, number]> = [
    [s.intelligence.meta_intelligence_score, s.governance.governance_score],
    [s.semantic.semantic_stability_score, s.authority.authority_distribution_score],
    [s.resilience.resilience_score, s.continuity.long_horizon_survivability_score],
    [s.operational.operational_score, s.intelligence.kernel_coherence_score],
  ];
  const diffs = pairs.map(([a, b]) => Math.abs(a - b));
  return clamp(100 - avg(diffs));
}

export function buildUnifiedVerdict(scores: UnifiedBusResult["scores"]): {
  verdict: UnifiedVerdict;
  reasons: string[];
} {
  const reasons: string[] = [];
  const composite =
    scores.kernel_score * 0.2 +
    scores.coherence_score * 0.2 +
    scores.resilience_score * 0.15 +
    scores.governance_score * 0.15 +
    scores.observability_score * 0.1 +
    scores.system_consistency_score * 0.1 +
    scores.future_viability_score * 0.1;

  if (composite >= 90 && scores.entropy_score < 15) {
    reasons.push("Composite >= 90 e entropia mínima.");
    return { verdict: "TRANSCENDENT", reasons };
  }
  if (composite >= 80 && scores.entropy_score < 25) {
    reasons.push("Composite >= 80 e entropia baixa.");
    return { verdict: "HYPER_STABLE", reasons };
  }
  if (composite >= 65) {
    reasons.push("Composite >= 65.");
    return { verdict: "STABLE", reasons };
  }
  if (composite >= 50) {
    reasons.push("Composite >= 50 com volatilidade moderada.");
    return { verdict: "VOLATILE", reasons };
  }
  if (composite >= 35 || scores.anomaly_score > 60) {
    reasons.push("Sinais fragmentados ou anomalias elevadas.");
    return { verdict: "FRAGMENTED", reasons };
  }
  reasons.push("Composite muito baixo.");
  return { verdict: "COLLAPSING", reasons };
}

export function buildUnifiedIntelligenceBus(
  t: Partial<TelemetrySnapshot>,
): UnifiedBusResult {
  const signatures = normalizeSystemSignals(t);
  const kernel = aggregateKernelSignals(signatures);
  const governance = aggregateGovernanceSignals(signatures);
  const semantic = aggregateSemanticSignals(signatures);
  const authority = aggregateAuthoritySignals(signatures);
  const resilience = aggregateResilienceSignals(signatures);
  const observability =
    (signatures.explainability.lineage_integrity_score +
      signatures.explainability.tracing_coverage_score +
      signatures.explainability.confidence_integrity_score) /
    3;
  const anomaly = avg(Object.values(signatures.anomaly));
  const entropy = calculateBusEntropy(signatures);
  const stability = calculateBusStability(signatures);
  const consensus = calculateSystemConsensus(signatures);
  const alignment = calculateCrossEngineAlignment(signatures);
  const consistency = clamp((consensus + alignment + stability) / 3);
  const futureViability = clamp(
    (resilience + signatures.continuity.long_horizon_survivability_score + kernel) / 3,
  );
  const coherence = clamp((kernel + alignment + semantic) / 3);

  const scores = {
    kernel_score: kernel,
    coherence_score: coherence,
    resilience_score: resilience,
    entropy_score: entropy,
    observability_score: clamp(observability),
    anomaly_score: clamp(anomaly),
    governance_score: governance,
    system_consistency_score: consistency,
    future_viability_score: futureViability,
    consensus_score: consensus,
    alignment_score: alignment,
    bus_stability: stability,
    bus_entropy: entropy,
  };

  const { verdict, reasons } = buildUnifiedVerdict(scores);
  // Use authority in fingerprints (silences unused-var concern)
  void authority;

  return {
    signatures,
    scores,
    fingerprints: {
      operational: buildOperationalFingerprint(signatures),
      strategic: buildStrategicFingerprint(signatures),
      evolution: buildEvolutionFingerprint(signatures),
    },
    verdict,
    reasons: [...reasons, ...detectSignalInconsistency(signatures)],
  };
}
