/**
 * Fase 15.1 — Engine Consensus.
 * Cross-engine agreement, divergence, and conflict graph helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export interface EngineSignal {
  engine_key: string;
  domain: string;
  metric: string;
  value: number;
}

export interface ConsensusCell {
  engine_a: string;
  engine_b: string;
  agreement: number;
}

export interface EngineConflict {
  engine_a: string;
  engine_b: string;
  conflict_type:
    | "semantic_disagreement"
    | "authority_conflict"
    | "governance_mismatch"
    | "forecast_instability"
    | "telemetry_noise"
    | "divergence";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

const severityFromGap = (gap: number): EngineConflict["severity"] => {
  if (gap >= 60) return "critical";
  if (gap >= 40) return "high";
  if (gap >= 25) return "medium";
  return "low";
};

export function calculateConsensus(signals: EngineSignal[]): number {
  if (signals.length === 0) return 100;
  const byMetric = new Map<string, number[]>();
  for (const s of signals) {
    const arr = byMetric.get(s.metric) ?? [];
    arr.push(s.value);
    byMetric.set(s.metric, arr);
  }
  const dispersions: number[] = [];
  for (const arr of byMetric.values()) {
    if (arr.length < 2) continue;
    const m = avg(arr);
    dispersions.push(avg(arr.map((v) => Math.abs(v - m))));
  }
  if (dispersions.length === 0) return 100;
  return clamp(100 - avg(dispersions) * 1.5);
}

export function detectEngineDivergence(signals: EngineSignal[]): EngineConflict[] {
  const out: EngineConflict[] = [];
  const byMetric = new Map<string, EngineSignal[]>();
  for (const s of signals) {
    const arr = byMetric.get(s.metric) ?? [];
    arr.push(s);
    byMetric.set(s.metric, arr);
  }
  for (const [metric, group] of byMetric) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const gap = Math.abs(group[i].value - group[j].value);
        if (gap >= 25) {
          out.push({
            engine_a: group[i].engine_key,
            engine_b: group[j].engine_key,
            conflict_type: "divergence",
            severity: severityFromGap(gap),
            description: `Divergência em ${metric}: ${gap.toFixed(0)} pts.`,
          });
        }
      }
    }
  }
  return out;
}

const detectDomainConflict = (
  signals: EngineSignal[],
  domain: string,
  type: EngineConflict["conflict_type"],
): EngineConflict[] => {
  const filtered = signals.filter((s) => s.domain === domain);
  return detectEngineDivergence(filtered).map((c) => ({ ...c, conflict_type: type }));
};

export const detectSemanticDisagreement = (s: EngineSignal[]) =>
  detectDomainConflict(s, "semantic", "semantic_disagreement");
export const detectAuthorityConflict = (s: EngineSignal[]) =>
  detectDomainConflict(s, "authority", "authority_conflict");
export const detectGovernanceMismatch = (s: EngineSignal[]) =>
  detectDomainConflict(s, "governance", "governance_mismatch");
export const detectForecastInstability = (s: EngineSignal[]) =>
  detectDomainConflict(s, "resilience", "forecast_instability");

export function detectTelemetryNoise(signals: EngineSignal[]): EngineConflict[] {
  const out: EngineConflict[] = [];
  for (const s of signals) {
    if (!Number.isFinite(s.value) || s.value < 0 || s.value > 100) {
      out.push({
        engine_a: s.engine_key,
        engine_b: s.engine_key,
        conflict_type: "telemetry_noise",
        severity: "high",
        description: `Sinal fora de escala em ${s.metric}: ${s.value}.`,
      });
    }
  }
  return out;
}

export function buildConsensusMatrix(signals: EngineSignal[]): ConsensusCell[] {
  const engines = Array.from(new Set(signals.map((s) => s.engine_key)));
  const cells: ConsensusCell[] = [];
  for (let i = 0; i < engines.length; i++) {
    for (let j = i + 1; j < engines.length; j++) {
      const a = engines[i];
      const b = engines[j];
      const metricsA = new Map(signals.filter((s) => s.engine_key === a).map((s) => [s.metric, s.value]));
      const metricsB = new Map(signals.filter((s) => s.engine_key === b).map((s) => [s.metric, s.value]));
      const shared: number[] = [];
      for (const [m, va] of metricsA) {
        const vb = metricsB.get(m);
        if (vb !== undefined) shared.push(100 - Math.abs(va - vb));
      }
      cells.push({ engine_a: a, engine_b: b, agreement: shared.length === 0 ? 100 : clamp(avg(shared)) });
    }
  }
  return cells;
}

export interface ConflictGraph {
  nodes: string[];
  edges: Array<{ a: string; b: string; weight: number; type: string }>;
}

export function buildConflictGraph(conflicts: EngineConflict[]): ConflictGraph {
  const nodes = Array.from(new Set(conflicts.flatMap((c) => [c.engine_a, c.engine_b])));
  const severityWeight: Record<EngineConflict["severity"], number> = {
    low: 25,
    medium: 50,
    high: 75,
    critical: 100,
  };
  const edges = conflicts.map((c) => ({
    a: c.engine_a,
    b: c.engine_b,
    weight: severityWeight[c.severity],
    type: c.conflict_type,
  }));
  return { nodes, edges };
}
