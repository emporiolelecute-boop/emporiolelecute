/**
 * Fase 15.2 — Fabric Observability.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ObservabilityLayer {
  layer: string;
  metrics: number;
  monitored: number;
}

export interface FabricObservability {
  coverage: number;
  depth: number;
  gaps: string[];
  blindspots: string[];
  hiddenDependencies: string[];
}

export function calculateFabricCoverage(layers: ObservabilityLayer[]): number {
  if (!layers.length) return 0;
  const ratios = layers.map((l) => (l.metrics === 0 ? 0 : l.monitored / l.metrics));
  return clamp((ratios.reduce((a, b) => a + b, 0) / layers.length) * 100);
}

export function calculateMonitoringDepth(layers: ObservabilityLayer[]): number {
  if (!layers.length) return 0;
  const totalMonitored = layers.reduce((a, l) => a + l.monitored, 0);
  return clamp(Math.min(100, totalMonitored * 2));
}

export function detectObservabilityGaps(layers: ObservabilityLayer[]): string[] {
  return layers
    .filter((l) => l.metrics > 0 && l.monitored / l.metrics < 0.5)
    .map((l) => `Cobertura fraca em ${l.layer}`);
}

export function detectTracingBlindspots(layers: ObservabilityLayer[]): string[] {
  return layers.filter((l) => l.monitored === 0 && l.metrics > 0).map((l) => `Sem tracing em ${l.layer}`);
}

export function detectHiddenDependencies(edges: Array<{ from: string; to: string }>): string[] {
  const counts: Record<string, number> = {};
  for (const e of edges) counts[e.to] = (counts[e.to] ?? 0) + 1;
  return Object.entries(counts)
    .filter(([, c]) => c >= 4)
    .map(([k, c]) => `${k} acumula ${c} dependências de entrada`);
}

export function buildFabricObservability(
  layers: ObservabilityLayer[],
  edges: Array<{ from: string; to: string }> = [],
): FabricObservability {
  return {
    coverage: calculateFabricCoverage(layers),
    depth: calculateMonitoringDepth(layers),
    gaps: detectObservabilityGaps(layers),
    blindspots: detectTracingBlindspots(layers),
    hiddenDependencies: detectHiddenDependencies(edges),
  };
}
