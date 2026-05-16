/**
 * Fase 14.4 — Future Resilience engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const v = (n?: number) => (typeof n === "number" ? n : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type ResilienceScenario = "dominant" | "resilient" | "vulnerable" | "fragile" | "collapsing";

export interface ResilienceForecast {
  recovery: number;
  collapseResistance: number;
  semanticLongevity: number;
  operationalDurability: number;
  strategicElasticity: number;
  authorityPersistence: number;
  clusterSurvival: number;
  scenario: ResilienceScenario;
}

export function estimateRecoveryCapacity(t: TelemetrySnapshot): number {
  return clamp(
    v(t.recovery_capacity_score) * 0.4 +
    v(t.recovery_elasticity) * 0.3 +
    v(t.adaptive_recovery_score) * 0.3
  );
}
export function estimateCollapseResistance(t: TelemetrySnapshot): number {
  return clamp(
    (100 - v(t.collapse_risk_score)) * 0.4 +
    (100 - v(t.cascade_failure_risk)) * 0.3 +
    v(t.resilience_score) * 0.3
  );
}
export function estimateSemanticLongevity(t: TelemetrySnapshot): number {
  return clamp(
    v(t.semantic_stability_score) * 0.35 +
    v(t.cluster_longevity_score) * 0.3 +
    (100 - v(t.semantic_aging_score)) * 0.2 +
    (100 - v(t.long_term_decay_risk)) * 0.15
  );
}
export function estimateOperationalDurability(t: TelemetrySnapshot): number {
  return clamp(
    v(t.operational_score) * 0.4 +
    v(t.execution_efficiency) * 0.3 +
    (100 - v(t.maintenance_pressure_score)) * 0.3
  );
}
export function estimateStrategicElasticity(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_elasticity_score) * 0.5 +
    v(t.adaptive_capacity_score) * 0.3 +
    (100 - v(t.strategic_rigidity_score)) * 0.2
  );
}
export function estimateAuthorityPersistence(t: TelemetrySnapshot): number {
  return clamp(
    v(t.authority_compounding_score) * 0.35 +
    (100 - v(t.authority_entropy)) * 0.3 +
    v(t.authority_growth_projection) * 0.2 +
    (100 - v(t.authority_dispersion_score)) * 0.15
  );
}
export function estimateClusterSurvivalProbability(t: TelemetrySnapshot): number {
  return clamp(
    v(t.cluster_longevity_score) * 0.4 +
    (100 - v(t.cluster_failure_probability)) * 0.3 +
    (100 - v(t.fragile_cluster_count) * 5) * 0.3
  );
}

export function buildFutureResilience(t: TelemetrySnapshot): ResilienceForecast {
  const recovery = estimateRecoveryCapacity(t);
  const collapseResistance = estimateCollapseResistance(t);
  const semanticLongevity = estimateSemanticLongevity(t);
  const operationalDurability = estimateOperationalDurability(t);
  const strategicElasticity = estimateStrategicElasticity(t);
  const authorityPersistence = estimateAuthorityPersistence(t);
  const clusterSurvival = estimateClusterSurvivalProbability(t);
  const composite = clamp(
    recovery * 0.15 + collapseResistance * 0.2 + semanticLongevity * 0.15 +
    operationalDurability * 0.15 + strategicElasticity * 0.1 +
    authorityPersistence * 0.15 + clusterSurvival * 0.1
  );
  let scenario: ResilienceScenario = "resilient";
  if (composite >= 80) scenario = "dominant";
  else if (composite >= 65) scenario = "resilient";
  else if (composite >= 50) scenario = "vulnerable";
  else if (composite >= 35) scenario = "fragile";
  else scenario = "collapsing";
  return {
    recovery, collapseResistance, semanticLongevity, operationalDurability,
    strategicElasticity, authorityPersistence, clusterSurvival, scenario,
  };
}
