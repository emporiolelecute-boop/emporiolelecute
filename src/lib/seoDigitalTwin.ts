/**
 * Fase 14 — SEO Digital Twin.
 *
 * Constrói uma representação simulável do ecossistema SEO baseada na telemetria
 * já calculada. Todas as funções são puras, read-only e sem efeitos colaterais.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type ScenarioType =
  | "conservative"
  | "balanced"
  | "aggressive"
  | "unstable"
  | "recovery"
  | "collapse";

export interface DigitalTwin {
  authority: number;
  semanticCoverage: number;
  resilience: number;
  operationalLoad: number;
  executionCost: number;
  growthVelocity: number;
  decayRisk: number;
  collapseRisk: number;
  saturation: number;
  roi: number;
  clusterHealth: number;
  recoveryTime: number;
  confidence: number;
}

export interface SimulationProjection extends DigitalTwin {
  scenario: ScenarioType;
  risks: string[];
  bottlenecks: string[];
  sustainability: number;
  estimatedWeeks: number;
  notes: string;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const v = (x?: number) => (typeof x === "number" ? x : 0);

const SCENARIO_FACTORS: Record<ScenarioType, {
  authority: number; coverage: number; cost: number; risk: number; growth: number;
}> = {
  conservative: { authority: 1.05, coverage: 1.04, cost: 0.9,  risk: 0.85, growth: 1.02 },
  balanced:     { authority: 1.12, coverage: 1.10, cost: 1.0,  risk: 1.0,  growth: 1.10 },
  aggressive:   { authority: 1.25, coverage: 1.22, cost: 1.35, risk: 1.25, growth: 1.30 },
  unstable:     { authority: 0.95, coverage: 0.92, cost: 1.4,  risk: 1.6,  growth: 0.85 },
  recovery:     { authority: 1.08, coverage: 1.06, cost: 1.15, risk: 0.7,  growth: 1.05 },
  collapse:     { authority: 0.7,  coverage: 0.65, cost: 1.5,  risk: 2.0,  growth: 0.5 },
};

export function buildDigitalTwin(t: TelemetrySnapshot): DigitalTwin {
  return {
    authority: v(t.averageAuthority),
    semanticCoverage: v(t.semantic_coverage_avg),
    resilience: v(t.resilience_score),
    operationalLoad: clamp(v(t.maintenance_pressure_score) + v(t.bottleneck_score) * 0.5),
    executionCost: clamp(v(t.operational_debt_score) * 0.6 + v(t.fragmentation_score) * 0.4),
    growthVelocity: v(t.momentum_growth_score),
    decayRisk: v(t.content_decay_score),
    collapseRisk: v(t.collapse_risk_score),
    saturation: v(t.saturation_score),
    roi: v(t.semantic_roi_avg),
    clusterHealth: clamp(100 - v(t.fragile_cluster_count) * 8),
    recoveryTime: Math.max(1, Math.round(v(t.recovery_difficulty_avg) * 0.1) + 2),
    confidence: 70,
  };
}

function applyScenario(twin: DigitalTwin, scenario: ScenarioType, horizonWeeks: number): SimulationProjection {
  const f = SCENARIO_FACTORS[scenario];
  const factor = Math.min(2, 1 + (horizonWeeks / 52) * 0.5);
  const proj: DigitalTwin = {
    authority: clamp(twin.authority * f.authority * factor / Math.max(1, factor * 0.9)),
    semanticCoverage: clamp(twin.semanticCoverage * f.coverage),
    resilience: clamp(twin.resilience * (2 - f.risk)),
    operationalLoad: clamp(twin.operationalLoad * f.cost),
    executionCost: clamp(twin.executionCost * f.cost),
    growthVelocity: clamp(twin.growthVelocity * f.growth),
    decayRisk: clamp(twin.decayRisk * f.risk),
    collapseRisk: clamp(twin.collapseRisk * f.risk),
    saturation: clamp(twin.saturation * (1 + (f.growth - 1) * 0.5)),
    roi: clamp(twin.roi * f.growth),
    clusterHealth: clamp(twin.clusterHealth * (2 - f.risk)),
    recoveryTime: Math.max(1, Math.round(twin.recoveryTime * f.risk)),
    confidence: clamp(twin.confidence - Math.abs(1 - f.risk) * 20),
  };

  const risks: string[] = [];
  if (proj.collapseRisk > 60) risks.push("Risco alto de colapso");
  if (proj.decayRisk > 60) risks.push("Decaimento de conteúdo acelerado");
  if (proj.saturation > 75) risks.push("Saturação temática");
  if (proj.operationalLoad > 75) risks.push("Sobrecarga operacional");

  const bottlenecks: string[] = [];
  if (proj.executionCost > 70) bottlenecks.push("Custo de execução elevado");
  if (proj.clusterHealth < 50) bottlenecks.push("Clusters frágeis");
  if (proj.growthVelocity < 30) bottlenecks.push("Velocidade de crescimento baixa");

  const sustainability = clamp(Math.round(
    proj.resilience * 0.4 + (100 - proj.decayRisk) * 0.3 + proj.clusterHealth * 0.3
  ));

  return {
    ...proj,
    scenario,
    risks,
    bottlenecks,
    sustainability,
    estimatedWeeks: horizonWeeks,
    notes: `Cenário ${scenario} projetado em ${horizonWeeks} semanas.`,
  };
}

export function simulateGrowthScenario(t: TelemetrySnapshot, scenario: ScenarioType = "balanced", weeks = 12): SimulationProjection {
  return applyScenario(buildDigitalTwin(t), scenario, weeks);
}

export function simulateDecayScenario(t: TelemetrySnapshot, weeks = 12): SimulationProjection {
  return applyScenario(buildDigitalTwin(t), "unstable", weeks);
}

export function simulateRecoveryScenario(t: TelemetrySnapshot, weeks = 16): SimulationProjection {
  return applyScenario(buildDigitalTwin(t), "recovery", weeks);
}

export function simulateCollapseScenario(t: TelemetrySnapshot, weeks = 8): SimulationProjection {
  return applyScenario(buildDigitalTwin(t), "collapse", weeks);
}

export function simulateExpansionScenario(t: TelemetrySnapshot, weeks = 24): SimulationProjection {
  return applyScenario(buildDigitalTwin(t), "aggressive", weeks);
}

export function simulateAuthorityRedistribution(t: TelemetrySnapshot): {
  rebalancedAuthority: number;
  entropyDelta: number;
  riskReduction: number;
} {
  const auth = v(t.averageAuthority);
  const entropy = v(t.authority_entropy);
  const dependency = v(t.authority_dependency_risk);
  return {
    rebalancedAuthority: clamp(auth + 5),
    entropyDelta: clamp(100 - entropy) - entropy,
    riskReduction: clamp(dependency * 0.4),
  };
}

export function simulateClusterEvolution(t: TelemetrySnapshot, weeks = 12): {
  expectedGrowth: number;
  collapseProbability: number;
  consolidationGain: number;
} {
  return {
    expectedGrowth: clamp(v(t.cluster_growth_score) + weeks * 0.5),
    collapseProbability: clamp(v(t.fragile_cluster_count) * 6),
    consolidationGain: clamp(v(t.semantic_balance_score) * 0.5 + 10),
  };
}

export function simulateOperationalStress(t: TelemetrySnapshot, intensity = 1): {
  operationalScore: number;
  burnoutRisk: number;
  recoveryWeeks: number;
} {
  const load = v(t.maintenance_pressure_score) * intensity;
  return {
    operationalScore: clamp(100 - load),
    burnoutRisk: clamp(load * 1.2),
    recoveryWeeks: Math.max(2, Math.round(load * 0.1)),
  };
}
