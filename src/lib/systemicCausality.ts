/**
 * Fase 15.2 — Systemic Causality.
 * Graph + propagation tracing helpers (pure).
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface CausalEdge {
  from: string;
  to: string;
  strength?: number;
}

export interface CausalityGraph {
  nodes: string[];
  edges: CausalEdge[];
}

export function buildSystemicCausalityGraph(edges: CausalEdge[]): CausalityGraph {
  const nodes = Array.from(new Set(edges.flatMap((e) => [e.from, e.to])));
  return { nodes, edges };
}

function bfsDepth(g: CausalityGraph, origin: string): number {
  if (!g.nodes.includes(origin)) return 0;
  const visited = new Set<string>([origin]);
  let frontier = [origin];
  let depth = 0;
  while (frontier.length) {
    const next: string[] = [];
    for (const n of frontier) {
      for (const e of g.edges) {
        if (e.from === n && !visited.has(e.to)) {
          visited.add(e.to);
          next.push(e.to);
        }
      }
    }
    if (next.length === 0) break;
    depth += 1;
    frontier = next;
    if (depth > 32) break;
  }
  return depth;
}

export function calculatePropagationDepth(g: CausalityGraph, origin: string): number {
  return bfsDepth(g, origin);
}

export function calculatePropagationRisk(
  g: CausalityGraph,
  origin: string,
  baseStrength = 50,
): number {
  const depth = bfsDepth(g, origin);
  const fanout = g.edges.filter((e) => e.from === origin).length;
  return clamp(baseStrength * 0.4 + depth * 8 + fanout * 5);
}

export function traceDecisionPropagation(g: CausalityGraph, origin: string): string[] {
  return g.edges.filter((e) => e.from === origin).map((e) => e.to);
}
export function traceAuthorityPropagation(g: CausalityGraph, origin: string): string[] {
  return traceDecisionPropagation(g, origin);
}
export function traceSemanticPropagation(g: CausalityGraph, origin: string): string[] {
  return traceDecisionPropagation(g, origin);
}
export function traceOperationalPropagation(g: CausalityGraph, origin: string): string[] {
  return traceDecisionPropagation(g, origin);
}

export function detectCascadeOrigins(g: CausalityGraph): string[] {
  const counts: Record<string, number> = {};
  for (const e of g.edges) counts[e.from] = (counts[e.from] ?? 0) + 1;
  return Object.entries(counts)
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}

export function detectSystemicShockPoints(g: CausalityGraph): string[] {
  const degree: Record<string, number> = {};
  for (const e of g.edges) {
    degree[e.from] = (degree[e.from] ?? 0) + 1;
    degree[e.to] = (degree[e.to] ?? 0) + 1;
  }
  return Object.entries(degree)
    .filter(([, d]) => d >= 5)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}
