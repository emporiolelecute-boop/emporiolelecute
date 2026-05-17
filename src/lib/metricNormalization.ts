/**
 * Fase 15 — Metric Normalization.
 * Read-only normalization utilities.
 */
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface MetricDescriptor {
  key: string;
  scale_min: number;
  scale_max: number;
  confidence_weight: number;
  redundancy_group?: string;
  is_normalized?: boolean;
}

export function normalizeMetric(value: number, d: MetricDescriptor): number {
  if (d.is_normalized) return clamp(value);
  const range = d.scale_max - d.scale_min;
  if (range <= 0) return 0;
  return clamp(((value - d.scale_min) / range) * 100);
}

export function normalizeMetricGroup(
  values: Record<string, number>,
  descriptors: Record<string, MetricDescriptor>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of Object.keys(values)) {
    const d = descriptors[key];
    if (!d) continue;
    out[key] = normalizeMetric(values[key], d);
  }
  return out;
}

export function detectScaleConflicts(descriptors: MetricDescriptor[]): string[] {
  const out: string[] = [];
  for (const d of descriptors) {
    if (d.scale_min >= d.scale_max) out.push(`Escala inválida em ${d.key}.`);
    if (!d.is_normalized && (d.scale_min !== 0 || d.scale_max !== 100)) {
      out.push(`${d.key} usa escala não-canônica (${d.scale_min}-${d.scale_max}).`);
    }
  }
  return out;
}

export function detectConfidenceDistortion(descriptors: MetricDescriptor[]): string[] {
  const out: string[] = [];
  for (const d of descriptors) {
    if (d.confidence_weight < 0 || d.confidence_weight > 1.5) {
      out.push(`Peso de confiança fora do intervalo razoável em ${d.key}.`);
    }
  }
  return out;
}

export function detectMetricInflation(descriptors: MetricDescriptor[]): {
  total: number; perGroup: Record<string, number>; inflated: string[];
} {
  const perGroup: Record<string, number> = {};
  for (const d of descriptors) {
    if (!d.redundancy_group) continue;
    perGroup[d.redundancy_group] = (perGroup[d.redundancy_group] ?? 0) + 1;
  }
  const inflated = Object.entries(perGroup).filter(([, n]) => n > 3).map(([g, n]) => `${g} (${n} métricas)`);
  return { total: descriptors.length, perGroup, inflated };
}

export function calculateNormalizationHealth(descriptors: MetricDescriptor[]): number {
  if (descriptors.length === 0) return 100;
  const conflicts = detectScaleConflicts(descriptors).length;
  const distortions = detectConfidenceDistortion(descriptors).length;
  const inflation = detectMetricInflation(descriptors).inflated.length;
  const penalty = (conflicts + distortions + inflation) * 5;
  return clamp(100 - penalty);
}

export function buildNormalizedTelemetry(
  values: Record<string, number>,
  descriptors: Record<string, MetricDescriptor>,
) {
  const normalized = normalizeMetricGroup(values, descriptors);
  const list = Object.values(descriptors);
  return {
    normalized,
    health: calculateNormalizationHealth(list),
    conflicts: detectScaleConflicts(list),
    distortions: detectConfidenceDistortion(list),
    inflation: detectMetricInflation(list),
  };
}
