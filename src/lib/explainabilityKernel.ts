/**
 * Fase 15.1 — Explainability Kernel.
 * Decision/trace explanations and lineage maps.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface MetricOrigin {
  metric: string;
  engine: string;
  inputs: string[];
  formula?: string;
}

export interface DecisionTraceNode {
  step: string;
  inputs: string[];
  output: string;
  rationale: string;
}

export function explainMetricOrigin(o: MetricOrigin): string {
  return `Métrica ${o.metric} produzida por ${o.engine} a partir de ${o.inputs.join(", ") || "—"}${
    o.formula ? ` (fórmula: ${o.formula})` : ""
  }.`;
}

export function explainDecisionChain(steps: DecisionTraceNode[]): string {
  if (steps.length === 0) return "Sem cadeia rastreável.";
  return steps.map((s, i) => `${i + 1}. ${s.step}: ${s.rationale}`).join(" → ");
}

export function explainAuthorityCalculation(score: number, drivers: string[]): string {
  return `Autoridade=${clamp(score)}. Drivers: ${drivers.slice(0, 5).join("; ") || "—"}.`;
}
export function explainReadinessCalculation(score: number, drivers: string[]): string {
  return `Readiness=${clamp(score)}. Drivers: ${drivers.slice(0, 5).join("; ") || "—"}.`;
}
export function explainRiskCalculation(score: number, drivers: string[]): string {
  return `Risco=${clamp(score)}. Drivers: ${drivers.slice(0, 5).join("; ") || "—"}.`;
}
export function explainEntropyCalculation(score: number, drivers: string[]): string {
  return `Entropia=${clamp(score)}. Drivers: ${drivers.slice(0, 5).join("; ") || "—"}.`;
}

export interface TraceabilityNode {
  key: string;
  children: TraceabilityNode[];
}

export function buildTraceabilityTree(
  root: string,
  edges: Array<{ from: string; to: string }>,
  seen: Set<string> = new Set(),
): TraceabilityNode {
  if (seen.has(root)) return { key: root, children: [] };
  seen.add(root);
  const children = edges
    .filter((e) => e.from === root)
    .map((e) => buildTraceabilityTree(e.to, edges, seen));
  return { key: root, children };
}

export function buildMetricLineageMap(
  origins: MetricOrigin[],
): Record<string, { engine: string; inputs: string[] }> {
  const map: Record<string, { engine: string; inputs: string[] }> = {};
  for (const o of origins) map[o.metric] = { engine: o.engine, inputs: o.inputs };
  return map;
}

export function detectOpaqueCalculations(origins: MetricOrigin[]): string[] {
  return origins.filter((o) => o.inputs.length === 0 && !o.formula).map((o) => o.metric);
}
