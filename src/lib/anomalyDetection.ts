/**
 * Fase 15.1 — Anomaly Detection.
 * Lightweight outlier and spike helpers over telemetry vectors.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export type AnomalyRisk = "none" | "low" | "medium" | "high" | "critical";

export interface Anomaly {
  metric: string;
  value: number;
  baseline: number;
  delta: number;
  risk: AnomalyRisk;
  category: "spike" | "authority" | "semantic" | "operational" | "strategic";
}

const classify = (delta: number): AnomalyRisk => {
  if (delta >= 50) return "critical";
  if (delta >= 35) return "high";
  if (delta >= 20) return "medium";
  if (delta >= 10) return "low";
  return "none";
};

export function detectMetricSpikes(
  series: Record<string, number[]>,
): Anomaly[] {
  const out: Anomaly[] = [];
  for (const [metric, arr] of Object.entries(series)) {
    if (arr.length < 3) continue;
    const baseline = avg(arr.slice(0, -1));
    const last = arr[arr.length - 1];
    const delta = Math.abs(last - baseline);
    const risk = classify(delta);
    if (risk !== "none") {
      out.push({ metric, value: last, baseline, delta, risk, category: "spike" });
    }
  }
  return out;
}

const flag = (
  metric: string,
  value: number,
  threshold: number,
  category: Anomaly["category"],
): Anomaly | null => {
  const delta = value - threshold;
  if (delta <= 0) return null;
  return {
    metric,
    value,
    baseline: threshold,
    delta,
    risk: classify(delta),
    category,
  };
};

export function detectAuthorityAnomalies(t: Partial<TelemetrySnapshot>): Anomaly[] {
  return [
    flag("authority_entropy", t.authority_entropy ?? 0, 60, "authority"),
    flag("authority_dependency_risk", t.authority_dependency_risk ?? 0, 60, "authority"),
    flag("authority_distortion_score", t.authority_distortion_score ?? 0, 55, "authority"),
  ].filter(Boolean) as Anomaly[];
}

export function detectSemanticInstability(t: Partial<TelemetrySnapshot>): Anomaly[] {
  return [
    flag("semantic_drift_score", t.semantic_drift_score ?? 0, 55, "semantic"),
    flag("semantic_entropy_score", t.semantic_entropy_score ?? 0, 60, "semantic"),
    flag("semantic_instability_score", t.semantic_instability_score ?? 0, 55, "semantic"),
  ].filter(Boolean) as Anomaly[];
}

export function detectOperationalAnomalies(t: Partial<TelemetrySnapshot>): Anomaly[] {
  return [
    flag("operational_debt_score", t.operational_debt_score ?? 0, 60, "operational"),
    flag("bottleneck_score", t.bottleneck_score ?? 0, 55, "operational"),
    flag("operational_noise_score", t.operational_noise_score ?? 0, 55, "operational"),
  ].filter(Boolean) as Anomaly[];
}

export function detectStrategicOutliers(t: Partial<TelemetrySnapshot>): Anomaly[] {
  return [
    flag("strategic_fatigue_score", t.strategic_fatigue_score ?? 0, 60, "strategic"),
    flag("strategic_noise_score", t.strategic_noise_score ?? 0, 55, "strategic"),
    flag("strategic_fragmentation_score", t.strategic_fragmentation_score ?? 0, 55, "strategic"),
  ].filter(Boolean) as Anomaly[];
}

export function detectAnomalies(
  t: Partial<TelemetrySnapshot>,
  series: Record<string, number[]> = {},
): Anomaly[] {
  return [
    ...detectMetricSpikes(series),
    ...detectAuthorityAnomalies(t),
    ...detectSemanticInstability(t),
    ...detectOperationalAnomalies(t),
    ...detectStrategicOutliers(t),
  ];
}

export function classifyAnomalyRisk(anomalies: Anomaly[]): number {
  if (anomalies.length === 0) return 0;
  const weights: Record<AnomalyRisk, number> = {
    none: 0,
    low: 20,
    medium: 40,
    high: 70,
    critical: 100,
  };
  return clamp(avg(anomalies.map((a) => weights[a.risk])));
}
