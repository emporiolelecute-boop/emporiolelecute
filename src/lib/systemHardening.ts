/**
 * Final Phase — Architectural Hardening.
 * Read-only diagnostics for structural fragility.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface DependencyEdge { from: string; to: string }
export interface EngineUsage { engine: string; references: number; lastUsedDaysAgo: number }
export interface TelemetryUsage { metric: string; consumers: number }

export function detectCircularDependencies(edges: DependencyEdge[]): string[] {
  const graph: Record<string, string[]> = {};
  for (const e of edges) (graph[e.from] ??= []).push(e.to);
  const cycles: string[] = [];
  const visit = (node: string, stack: Set<string>) => {
    if (stack.has(node)) { cycles.push(`Ciclo em ${node}`); return; }
    stack.add(node);
    for (const next of graph[node] ?? []) visit(next, new Set(stack));
  };
  for (const n of Object.keys(graph)) visit(n, new Set());
  return Array.from(new Set(cycles));
}

export function detectCrossLayerLeaks(edges: DependencyEdge[], layers: Record<string, string>): string[] {
  return edges
    .filter((e) => layers[e.from] && layers[e.to] && layers[e.from] !== layers[e.to])
    .map((e) => `${e.from} (${layers[e.from]}) → ${e.to} (${layers[e.to]})`)
    .slice(0, 20);
}

export function detectArchitectureDrift(engineCount: number, baseline = 25): number {
  if (engineCount <= baseline) return 0;
  return clamp(((engineCount - baseline) / baseline) * 100);
}

export function detectRuntimeBloat(componentCount: number, baseline = 200): number {
  if (componentCount <= baseline) return 0;
  return clamp(((componentCount - baseline) / baseline) * 100);
}

export function detectUnusedEngines(engines: EngineUsage[]): string[] {
  return engines.filter((e) => e.references === 0 || e.lastUsedDaysAgo > 90).map((e) => e.engine);
}

export function detectDeadTelemetry(metrics: TelemetryUsage[]): string[] {
  return metrics.filter((m) => m.consumers === 0).map((m) => m.metric);
}

export function buildDependencyHealthMap(edges: DependencyEdge[]): Record<string, number> {
  const inDeg: Record<string, number> = {};
  for (const e of edges) inDeg[e.to] = (inDeg[e.to] ?? 0) + 1;
  const map: Record<string, number> = {};
  for (const [k, v] of Object.entries(inDeg)) map[k] = clamp(100 - v * 8);
  return map;
}

export function calculateMaintainabilityScore(input: {
  cycles: number; leaks: number; drift: number; bloat: number; unused: number; dead: number;
}): number {
  const penalty = input.cycles * 12 + input.leaks * 2 + input.drift * 0.3 +
    input.bloat * 0.2 + input.unused * 3 + input.dead * 1.5;
  return clamp(100 - penalty);
}

// ---------------------------------------------------------------------------
// Final Phase — extended diagnostic helpers (additive, read-only)
// ---------------------------------------------------------------------------

export function detectDeadLayers(layers: Array<{ name: string; consumers: number; lastUsedDaysAgo: number }>): string[] {
  return layers.filter((l) => l.consumers === 0 || l.lastUsedDaysAgo > 120).map((l) => l.name);
}

export function detectUnusedSignals(signals: Array<{ name: string; consumers: number }>): string[] {
  return signals.filter((s) => s.consumers === 0).map((s) => s.name);
}

export function detectMetricInflation(total: number, baseline = 90): number {
  if (total <= baseline) return 0;
  return clamp(((total - baseline) / baseline) * 100);
}

export function detectObservabilityBloat(dashboards: number, baseline = 14): number {
  if (dashboards <= baseline) return 0;
  return clamp(((dashboards - baseline) / baseline) * 100);
}

export function detectTelemetryNoise(metrics: Array<{ variance: number }>): number {
  if (!metrics.length) return 0;
  const lowVar = metrics.filter((m) => m.variance < 1).length;
  return clamp((lowVar / metrics.length) * 100);
}

export function calculateSystemMaintainability(input: {
  deadLayers: number; unusedSignals: number; inflation: number; bloat: number; noise: number;
}): number {
  const penalty = input.deadLayers * 5 + input.unusedSignals * 2 + input.inflation * 0.3 +
    input.bloat * 0.3 + input.noise * 0.4;
  return clamp(100 - penalty);
}

export function calculateOperationalSimplicity(input: {
  bloat: number; inflation: number; noise: number;
}): number {
  return clamp(100 - (input.bloat + input.inflation + input.noise) / 3);
}

export function calculateExecutiveClarity(input: {
  maintainability: number; simplicity: number; signalEfficiency: number;
}): number {
  return clamp((input.maintainability + input.simplicity + input.signalEfficiency) / 3);
}

export function buildHardeningRecommendations(input: {
  deadLayers: string[]; unusedSignals: string[]; bloat: number; noise: number;
}): string[] {
  const out: string[] = [];
  if (input.deadLayers.length) out.push(`Revisar ${input.deadLayers.length} camada(s) sem consumidores.`);
  if (input.unusedSignals.length) out.push(`Marcar ${input.unusedSignals.length} sinal(is) como PRUNABLE.`);
  if (input.bloat > 50) out.push("Consolidar dashboards executivos sobrepostos.");
  if (input.noise > 50) out.push("Filtrar métricas de baixa variância da camada executiva.");
  if (!out.length) out.push("Sistema dentro de envelopes saudáveis.");
  return out;
}
