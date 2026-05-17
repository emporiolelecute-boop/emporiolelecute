/**
 * Final Phase — Operational Simplification.
 * Detects fatigue, abstraction excess, and decision fragmentation.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export function detectOperationalOverload(input: { dashboards: number; metrics: number; engines: number }): number {
  const score = (input.dashboards * 1.2) + (input.metrics * 0.15) + (input.engines * 1.5);
  return clamp(score);
}

export function detectDashboardFatigue(dashboards: number, baseline = 12): number {
  if (dashboards <= baseline) return 0;
  return clamp(((dashboards - baseline) / baseline) * 100);
}

export function detectExcessiveAbstraction(metaLayers: number, baseline = 4): number {
  if (metaLayers <= baseline) return 0;
  return clamp(((metaLayers - baseline) / baseline) * 100);
}

export function detectDecisionFragmentation(decisionSurfaces: number, baseline = 8): number {
  if (decisionSurfaces <= baseline) return 0;
  return clamp(((decisionSurfaces - baseline) / baseline) * 100);
}

export function calculateOperationalSimplicity(input: {
  overload: number; fatigue: number; abstraction: number; fragmentation: number;
}): number {
  const penalty = (input.overload + input.fatigue + input.abstraction + input.fragmentation) / 4;
  return clamp(100 - penalty);
}

export function buildSimplificationRoadmap(input: {
  overload: number; fatigue: number; abstraction: number; fragmentation: number;
}): string[] {
  const out: string[] = [];
  if (input.fatigue > 50) out.push("Consolidar dashboards redundantes.");
  if (input.abstraction > 50) out.push("Reduzir camadas meta-analíticas.");
  if (input.fragmentation > 50) out.push("Centralizar superfícies de decisão.");
  if (input.overload > 60) out.push("Reduzir métricas de baixo sinal.");
  if (!out.length) out.push("Sistema dentro de envelopes saudáveis.");
  return out;
}

// ---------------------------------------------------------------------------
// Final Phase — operational simplification extensions (additive, read-only)
// ---------------------------------------------------------------------------

export function detectOperationalRedundancy(items: Array<{ name: string; cluster: string }>): string[] {
  const clusters: Record<string, string[]> = {};
  for (const i of items) (clusters[i.cluster] ??= []).push(i.name);
  const out: string[] = [];
  for (const names of Object.values(clusters)) if (names.length > 1) out.push(...names);
  return out;
}

export function detectExcessiveGovernance(governanceLayers: number, baseline = 5): number {
  if (governanceLayers <= baseline) return 0;
  return clamp(((governanceLayers - baseline) / baseline) * 100);
}

export function calculateOperationalDrag(input: {
  overload: number; redundancy: number; governanceExcess: number;
}): number {
  return clamp((input.overload + input.redundancy + input.governanceExcess) / 3);
}

export function calculateStrategicFriction(input: {
  fragmentation: number; abstraction: number; drag: number;
}): number {
  return clamp((input.fragmentation + input.abstraction + input.drag) / 3);
}
