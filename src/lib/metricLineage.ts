/**
 * Fase 15 — Metric Lineage.
 * Tracks dependencies and origin of derived metrics.
 */
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface LineageNode {
  metric_key: string;
  depends_on: string[];
  derived_from_engines: string[];
}

export interface LineageGraph {
  nodes: Record<string, LineageNode>;
}

export function buildMetricLineage(nodes: LineageNode[]): LineageGraph {
  const g: LineageGraph = { nodes: {} };
  for (const n of nodes) g.nodes[n.metric_key] = n;
  return g;
}

export function calculateLineageDepth(graph: LineageGraph, key: string, seen: Set<string> = new Set()): number {
  if (seen.has(key)) return 0;
  seen.add(key);
  const node = graph.nodes[key];
  if (!node || node.depends_on.length === 0) return 1;
  return 1 + Math.max(...node.depends_on.map((d) => calculateLineageDepth(graph, d, seen)));
}

export function detectCircularDependencies(graph: LineageGraph): string[] {
  const out: string[] = [];
  const visit = (key: string, stack: Set<string>): boolean => {
    if (stack.has(key)) {
      out.push(`Ciclo detectado em ${key}.`);
      return true;
    }
    const node = graph.nodes[key];
    if (!node) return false;
    stack.add(key);
    for (const d of node.depends_on) if (visit(d, stack)) return true;
    stack.delete(key);
    return false;
  };
  for (const k of Object.keys(graph.nodes)) visit(k, new Set());
  return Array.from(new Set(out));
}

export function detectOrphanMetrics(graph: LineageGraph): string[] {
  const out: string[] = [];
  for (const n of Object.values(graph.nodes)) {
    if (n.depends_on.length === 0 && n.derived_from_engines.length === 0) {
      out.push(n.metric_key);
    }
  }
  return out;
}

export function detectUntraceableMetrics(graph: LineageGraph): string[] {
  const out: string[] = [];
  for (const n of Object.values(graph.nodes)) {
    if (n.derived_from_engines.length === 0) out.push(n.metric_key);
  }
  return out;
}

export function calculateLineageIntegrity(graph: LineageGraph): number {
  const total = Object.keys(graph.nodes).length;
  if (total === 0) return 100;
  const cycles = detectCircularDependencies(graph).length;
  const orphans = detectOrphanMetrics(graph).length;
  const untraceable = detectUntraceableMetrics(graph).length;
  const penalty = (cycles * 15) + (orphans / total) * 30 + (untraceable / total) * 25;
  return clamp(100 - penalty);
}
