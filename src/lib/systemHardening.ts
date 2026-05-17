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
