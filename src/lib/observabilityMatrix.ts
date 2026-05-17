/**
 * Fase 15.1 — Observability Matrix.
 * Coverage, blindspots, fragmentation, and health heatmap helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export interface ObservabilityCell {
  domain: string;
  metric: string;
  covered: boolean;
  confidence: number;
}

export interface ObservabilityMatrix {
  cells: ObservabilityCell[];
  coverage_pct: number;
  blindspot_pct: number;
}

export function buildObservabilityMatrix(cells: ObservabilityCell[]): ObservabilityMatrix {
  if (cells.length === 0) return { cells, coverage_pct: 0, blindspot_pct: 0 };
  const covered = cells.filter((c) => c.covered).length;
  return {
    cells,
    coverage_pct: clamp((covered / cells.length) * 100),
    blindspot_pct: clamp(((cells.length - covered) / cells.length) * 100),
  };
}

export function calculateCoverageCompleteness(m: ObservabilityMatrix): number {
  return m.coverage_pct;
}

export function calculateBlindspotRisk(m: ObservabilityMatrix): number {
  const lowConf = m.cells.filter((c) => c.covered && c.confidence < 60).length;
  return clamp(m.blindspot_pct + (lowConf / Math.max(m.cells.length, 1)) * 30);
}

export function detectUnobservedAreas(m: ObservabilityMatrix): string[] {
  return m.cells.filter((c) => !c.covered).map((c) => `${c.domain}/${c.metric}`);
}

export function detectTelemetryFragmentation(cells: ObservabilityCell[]): number {
  const byDomain = new Map<string, number[]>();
  for (const c of cells) {
    const arr = byDomain.get(c.domain) ?? [];
    arr.push(c.covered ? c.confidence : 0);
    byDomain.set(c.domain, arr);
  }
  const variances: number[] = [];
  for (const arr of byDomain.values()) {
    const m = avg(arr);
    variances.push(avg(arr.map((v) => Math.abs(v - m))));
  }
  return clamp(avg(variances));
}

export function detectMonitoringWeakness(m: ObservabilityMatrix): number {
  const conf = avg(m.cells.filter((c) => c.covered).map((c) => c.confidence));
  return clamp(100 - conf);
}

export interface HeatmapCell {
  domain: string;
  health: number;
}

export function buildHealthHeatmap(cells: ObservabilityCell[]): HeatmapCell[] {
  const map = new Map<string, number[]>();
  for (const c of cells) {
    const arr = map.get(c.domain) ?? [];
    arr.push(c.covered ? c.confidence : 0);
    map.set(c.domain, arr);
  }
  return Array.from(map.entries()).map(([domain, xs]) => ({ domain, health: clamp(avg(xs)) }));
}
