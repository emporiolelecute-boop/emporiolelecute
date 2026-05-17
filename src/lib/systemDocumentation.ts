/**
 * Final Phase — System Documentation.
 * Builds a living registry of engines, metrics and dependencies.
 */
export interface EngineEntry { name: string; layer: string; purpose: string }
export interface TelemetryEntry { metric: string; layer: string; description: string }
export interface DependencyEntry { from: string; to: string; kind: string }
export interface GovernanceEntry { rule: string; scope: string; enforcement: string }

export function buildEngineRegistry(entries: EngineEntry[]): Record<string, EngineEntry> {
  const out: Record<string, EngineEntry> = {};
  for (const e of entries) out[e.name] = e;
  return out;
}

export function buildTelemetryRegistry(entries: TelemetryEntry[]): Record<string, TelemetryEntry> {
  const out: Record<string, TelemetryEntry> = {};
  for (const e of entries) out[e.metric] = e;
  return out;
}

export function buildDependencyRegistry(entries: DependencyEntry[]): DependencyEntry[] {
  return [...entries];
}

export function buildGovernanceMap(entries: GovernanceEntry[]): Record<string, GovernanceEntry[]> {
  const out: Record<string, GovernanceEntry[]> = {};
  for (const e of entries) (out[e.scope] ??= []).push(e);
  return out;
}

export function buildMetricLineageMap(entries: Array<{ metric: string; derivedFrom: string[] }>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const e of entries) out[e.metric] = e.derivedFrom;
  return out;
}

export function buildSystemTopology(engines: EngineEntry[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const e of engines) (out[e.layer] ??= []).push(e.name);
  return out;
}

export function buildOperationalGlossary(items: Array<{ term: string; definition: string }>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of items) out[i.term] = i.definition;
  return out;
}

// ---------------------------------------------------------------------------
// Final Phase — system map helpers (additive, read-only)
// ---------------------------------------------------------------------------

export function buildSystemMap(engines: EngineEntry[], deps: DependencyEntry[]): Record<string, { layer: string; outgoing: string[]; incoming: string[] }> {
  const out: Record<string, { layer: string; outgoing: string[]; incoming: string[] }> = {};
  for (const e of engines) out[e.name] = { layer: e.layer, outgoing: [], incoming: [] };
  for (const d of deps) {
    if (out[d.from]) out[d.from].outgoing.push(d.to);
    if (out[d.to]) out[d.to].incoming.push(d.from);
  }
  return out;
}

export function buildDependencyTree(deps: DependencyEntry[], root: string): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const d of deps) (adj[d.from] ??= []).push(d.to);
  const out: Record<string, string[]> = {};
  const stack = [root];
  const seen = new Set<string>();
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    out[n] = adj[n] ?? [];
    for (const c of out[n]) stack.push(c);
  }
  return out;
}

export function buildLayerRelationships(engines: EngineEntry[], deps: DependencyEntry[]): Array<{ from: string; to: string; count: number }> {
  const layerOf: Record<string, string> = {};
  for (const e of engines) layerOf[e.name] = e.layer;
  const counts: Record<string, number> = {};
  for (const d of deps) {
    const a = layerOf[d.from]; const b = layerOf[d.to];
    if (!a || !b || a === b) continue;
    const key = `${a}→${b}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts).map(([k, count]) => {
    const [from, to] = k.split("→");
    return { from, to, count };
  });
}
