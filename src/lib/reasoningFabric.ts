/**
 * Phase 15.3 — Reasoning Fabric. Trace paths across engines.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ReasoningEdge {
  from: string;
  to: string;
  weight: number; // 0..100
  opaque?: boolean;
}

export interface ReasoningPath {
  nodes: string[];
  depth: number;
  averageWeight: number;
}

export function traceReasoningPaths(
  edges: ReasoningEdge[],
  origin: string,
  maxDepth = 6,
): ReasoningPath[] {
  const paths: ReasoningPath[] = [];
  const dfs = (node: string, trail: string[], weights: number[]) => {
    if (trail.length > maxDepth) return;
    const out = edges.filter((e) => e.from === node && !trail.includes(e.to));
    if (out.length === 0 && trail.length > 1) {
      const avgW = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 0;
      paths.push({ nodes: trail, depth: trail.length - 1, averageWeight: clamp(avgW) });
      return;
    }
    for (const e of out) dfs(e.to, [...trail, e.to], [...weights, e.weight]);
  };
  dfs(origin, [origin], []);
  return paths;
}

export function traceCrossEngineReasoning(edges: ReasoningEdge[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const e of edges) {
    if (!map[e.from]) map[e.from] = [];
    map[e.from].push(e.to);
  }
  return map;
}

export function calculateReasoningDepth(paths: ReasoningPath[]): number {
  if (paths.length === 0) return 0;
  return clamp((paths.reduce((s, p) => s + p.depth, 0) / paths.length) * 15);
}

export function calculateReasoningComplexity(edges: ReasoningEdge[]): number {
  if (edges.length === 0) return 0;
  const nodes = new Set<string>();
  edges.forEach((e) => { nodes.add(e.from); nodes.add(e.to); });
  return clamp((edges.length / Math.max(1, nodes.size)) * 25);
}

export function detectReasoningLoops(edges: ReasoningEdge[]): string[][] {
  const loops: string[][] = [];
  const adj = traceCrossEngineReasoning(edges);
  const visit = (node: string, trail: string[]) => {
    if (trail.includes(node)) {
      loops.push([...trail.slice(trail.indexOf(node)), node]);
      return;
    }
    if (trail.length > 8) return;
    for (const next of adj[node] || []) visit(next, [...trail, node]);
  };
  for (const start of Object.keys(adj)) visit(start, []);
  // Dedup
  const seen = new Set<string>();
  return loops.filter((l) => {
    const key = [...l].sort().join("→");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function detectOpaqueReasoning(edges: ReasoningEdge[]): ReasoningEdge[] {
  return edges.filter((e) => e.opaque);
}

export function detectReasoningBreakpoints(
  edges: ReasoningEdge[],
  threshold = 25,
): ReasoningEdge[] {
  return edges.filter((e) => e.weight < threshold);
}

export interface ReasoningFabric {
  paths: ReasoningPath[];
  depth_score: number;
  complexity_score: number;
  loops: string[][];
  opaque_count: number;
  breakpoints: ReasoningEdge[];
  fragmentation_score: number;
}

export function buildReasoningFabric(
  edges: ReasoningEdge[],
  origin: string,
): ReasoningFabric {
  const paths = traceReasoningPaths(edges, origin);
  const loops = detectReasoningLoops(edges);
  const opaque = detectOpaqueReasoning(edges);
  const breakpoints = detectReasoningBreakpoints(edges);
  const fragmentation = clamp(
    (breakpoints.length * 10) + (loops.length * 8) + (opaque.length * 5),
  );
  return {
    paths,
    depth_score: calculateReasoningDepth(paths),
    complexity_score: calculateReasoningComplexity(edges),
    loops,
    opaque_count: opaque.length,
    breakpoints,
    fragmentation_score: fragmentation,
  };
}
