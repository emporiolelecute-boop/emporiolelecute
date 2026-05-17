/**
 * Fase 15 — Engine Orchestrator.
 * Builds dependency graph for engines, detects overlap & consolidation opportunities.
 */
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface EngineDescriptor {
  engine_key: string;
  domain: string;
  inputs: string[];
  outputs: string[];
  complexity?: number;
  deprecated?: boolean;
}

export interface EngineGraph {
  nodes: EngineDescriptor[];
  edges: Array<{ from: string; to: string; shared: string[] }>;
}

export function buildEngineDependencyGraph(engines: EngineDescriptor[]): EngineGraph {
  const edges: EngineGraph["edges"] = [];
  for (let i = 0; i < engines.length; i++) {
    for (let j = 0; j < engines.length; j++) {
      if (i === j) continue;
      const shared = engines[i].outputs.filter((o) => engines[j].inputs.includes(o));
      if (shared.length > 0) edges.push({ from: engines[i].engine_key, to: engines[j].engine_key, shared });
    }
  }
  return { nodes: engines, edges };
}

export function detectEngineOverlap(engines: EngineDescriptor[]): Array<{ a: string; b: string; sharedOutputs: string[] }> {
  const out: Array<{ a: string; b: string; sharedOutputs: string[] }> = [];
  for (let i = 0; i < engines.length; i++) {
    for (let j = i + 1; j < engines.length; j++) {
      const shared = engines[i].outputs.filter((o) => engines[j].outputs.includes(o));
      if (shared.length > 0) out.push({ a: engines[i].engine_key, b: engines[j].engine_key, sharedOutputs: shared });
    }
  }
  return out;
}

export function detectEngineConflicts(engines: EngineDescriptor[]): string[] {
  const overlaps = detectEngineOverlap(engines);
  return overlaps
    .filter((o) => o.sharedOutputs.length >= 3)
    .map((o) => `${o.a} ⇄ ${o.b} compartilham ${o.sharedOutputs.length} outputs.`);
}

export function detectDuplicateDomains(engines: EngineDescriptor[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const e of engines) {
    if (!map[e.domain]) map[e.domain] = [];
    map[e.domain].push(e.engine_key);
  }
  const dup: Record<string, string[]> = {};
  for (const [d, list] of Object.entries(map)) if (list.length > 1) dup[d] = list;
  return dup;
}

export function estimateMaintenanceLoad(engines: EngineDescriptor[]): number {
  if (engines.length === 0) return 0;
  const avgComplexity = engines.reduce((a, e) => a + (e.complexity ?? 50), 0) / engines.length;
  const overlap = detectEngineOverlap(engines).length;
  return clamp(avgComplexity * 0.6 + Math.min(40, overlap * 4));
}

export function calculateOrchestrationEfficiency(engines: EngineDescriptor[]): number {
  if (engines.length === 0) return 100;
  const overlap = detectEngineOverlap(engines).length;
  const dup = Object.keys(detectDuplicateDomains(engines)).length;
  const penalty = Math.min(60, overlap * 3) + Math.min(30, dup * 5);
  return clamp(100 - penalty);
}

export function suggestEngineConsolidation(engines: EngineDescriptor[]): string[] {
  const out: string[] = [];
  const dup = detectDuplicateDomains(engines);
  for (const [domain, list] of Object.entries(dup)) {
    out.push(`Consolidar domínio "${domain}": ${list.join(", ")}.`);
  }
  for (const o of detectEngineOverlap(engines)) {
    if (o.sharedOutputs.length >= 4) {
      out.push(`Fundir ${o.a} + ${o.b} (${o.sharedOutputs.length} outputs comuns).`);
    }
  }
  return out;
}
