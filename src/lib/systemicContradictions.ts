/**
 * Phase 15.4 — Systemic Contradictions.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface LayerValue {
  layer: string;
  value: number;
}

export interface Contradiction {
  layer_a: string;
  layer_b: string;
  divergence: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

function severity(d: number): Contradiction["severity"] {
  if (d >= 60) return "critical";
  if (d >= 40) return "high";
  if (d >= 20) return "medium";
  return "low";
}

function diff(a: LayerValue, b: LayerValue, kind: string): Contradiction {
  const divergence = clamp(Math.abs(a.value - b.value));
  return {
    layer_a: a.layer,
    layer_b: b.layer,
    divergence,
    severity: severity(divergence),
    description: `${kind} divergence between ${a.layer} (${a.value}) and ${b.layer} (${b.value})`,
  };
}

function pairwise(layers: LayerValue[], kind: string, threshold = 15): Contradiction[] {
  const out: Contradiction[] = [];
  for (let i = 0; i < layers.length; i++) {
    for (let j = i + 1; j < layers.length; j++) {
      const c = diff(layers[i], layers[j], kind);
      if (c.divergence >= threshold) out.push(c);
    }
  }
  return out;
}

export const detectStrategicContradictions = (l: LayerValue[]) => pairwise(l, "strategic");
export const detectSemanticContradictions = (l: LayerValue[]) => pairwise(l, "semantic");
export const detectAuthorityContradictions = (l: LayerValue[]) => pairwise(l, "authority");
export const detectGovernanceContradictions = (l: LayerValue[]) => pairwise(l, "governance");
export const detectForecastContradictions = (l: LayerValue[]) => pairwise(l, "forecast");

export function calculateContradictionDepth(cs: Contradiction[]): number {
  if (cs.length === 0) return 0;
  const sum = cs.reduce((a, c) => a + c.divergence, 0);
  return clamp(sum / cs.length);
}

export function estimateContradictionImpact(cs: Contradiction[]): number {
  const w = { low: 1, medium: 2, high: 4, critical: 7 } as const;
  const total = cs.reduce((a, c) => a + w[c.severity], 0);
  return clamp(total * 5);
}
