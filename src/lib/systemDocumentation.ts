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
