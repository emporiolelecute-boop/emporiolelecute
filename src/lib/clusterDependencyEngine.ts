/**
 * Fase 14.5 — Cluster Dependency Engine.
 * Diagnóstico de dependências, fragilidade e single-point-failures.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type DependencyClass = "distributed" | "balanced" | "dependent" | "critical";

export function calculateClusterDependency(t: TelemetrySnapshot): number {
  return clamp(
    (t.cluster_dependency_score ?? 0) * 0.5 +
    (t.overcentralization_risk ?? 0) * 0.3 +
    (t.authority_dependency_risk ?? 0) * 0.2,
  );
}

export function detectClusterOverdependence(t: TelemetrySnapshot): number {
  return clamp((t.overcentralization_risk ?? 0) * 0.6 + (t.cluster_dependency_score ?? 0) * 0.4);
}

export function detectAuthorityConcentration(t: TelemetrySnapshot): number {
  return clamp((t.authority_dispersion_score ?? 0) * 0.4 + (t.authority_entropy ?? 0) * 0.3 + (t.authority_dependency_risk ?? 0) * 0.3);
}

export function detectClusterFragility(t: TelemetrySnapshot): number {
  return clamp(
    (t.fragile_cluster_count ?? 0) * 8 +
    (t.cluster_failure_probability ?? 0) * 0.4 +
    (100 - (t.cluster_resilience_score ?? 0)) * 0.3,
  );
}

export function detectSinglePointFailures(t: TelemetrySnapshot): number {
  return clamp(
    (t.fragile_cluster_count ?? 0) * 10 +
    (t.overcentralization_risk ?? 0) * 0.4 +
    (t.cascade_failure_risk ?? 0) * 0.2,
  );
}

export function estimateCascadeImpact(t: TelemetrySnapshot): number {
  return clamp((t.cascade_failure_risk ?? 0) * 0.5 + (t.cascade_collapse_risk ?? 0) * 0.3 + (t.cluster_failure_probability ?? 0) * 0.2);
}

export function estimateRecoveryComplexity(t: TelemetrySnapshot): number {
  return clamp(
    (t.recovery_difficulty_avg ?? 0) * 0.5 +
    (100 - (t.recovery_capacity_score ?? 0)) * 0.3 +
    (t.maintenance_pressure_score ?? 0) * 0.2,
  );
}

export interface ClusterDependencyReport {
  classification: DependencyClass;
  dependency: number;
  overdependence: number;
  authorityConcentration: number;
  fragility: number;
  singlePointFailures: number;
  cascadeImpact: number;
  recoveryComplexity: number;
  warnings: string[];
}

export function buildClusterDependencyReport(t: TelemetrySnapshot): ClusterDependencyReport {
  const dependency = calculateClusterDependency(t);
  const overdependence = detectClusterOverdependence(t);
  const authorityConcentration = detectAuthorityConcentration(t);
  const fragility = detectClusterFragility(t);
  const singlePointFailures = detectSinglePointFailures(t);
  const cascadeImpact = estimateCascadeImpact(t);
  const recoveryComplexity = estimateRecoveryComplexity(t);

  let classification: DependencyClass = "balanced";
  if (dependency >= 70 || singlePointFailures >= 70) classification = "critical";
  else if (dependency >= 50) classification = "dependent";
  else if (dependency >= 30) classification = "balanced";
  else classification = "distributed";

  const warnings: string[] = [];
  if (overdependence >= 60) warnings.push("Sobre-dependência operacional detectada");
  if (authorityConcentration >= 60) warnings.push("Autoridade altamente concentrada");
  if (fragility >= 60) warnings.push("Clusters frágeis identificados");
  if (cascadeImpact >= 60) warnings.push("Risco de impacto em cascata elevado");
  if (recoveryComplexity >= 60) warnings.push("Complexidade de recuperação alta");

  return {
    classification, dependency, overdependence, authorityConcentration,
    fragility, singlePointFailures, cascadeImpact, recoveryComplexity, warnings,
  };
}
