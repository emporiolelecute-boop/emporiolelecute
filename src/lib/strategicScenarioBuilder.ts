/**
 * Fase 14.1 — Strategic Scenario Builder.
 *
 * Produces strategic scenarios (gains, losses, effort, risks, ROI).
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type ScenarioName =
  | "aggressive_growth"
  | "lean"
  | "recovery"
  | "authority_defense"
  | "semantic_expansion"
  | "commercial_acceleration"
  | "minimal_maintenance";

export interface StrategicScenario {
  name: ScenarioName;
  label: string;
  projectedGains: number;
  projectedLosses: number;
  requiredEffort: number;
  maintenancePressure: number;
  semanticRisks: number;
  authorityImpact: number;
  operationalDebt: number;
  estimatedROI: number;
  sustainability: number;
  resilience: number;
  confidence: number;
}

const clamp = (v: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(v)));

function base(t: TelemetrySnapshot) {
  return {
    auth: t.averageAuthority || 0,
    cov: t.semantic_coverage_avg || 0,
    debt: t.operational_debt_score || 0,
    decay: t.content_decay_score || 0,
    intent: t.business_intent_score || 0,
    sust: t.sustainability_score || 0,
    res: t.resilience_score || 0,
    stab: t.semantic_stability_score || 0,
  };
}

export function buildAggressiveGrowthScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "aggressive_growth",
    label: "Crescimento Agressivo",
    projectedGains: clamp(b.auth + 25),
    projectedLosses: clamp(b.debt + 20),
    requiredEffort: 85,
    maintenancePressure: clamp(b.debt + 25),
    semanticRisks: clamp(b.decay + 15),
    authorityImpact: clamp(b.auth + 20),
    operationalDebt: clamp(b.debt + 22),
    estimatedROI: clamp(b.intent + 30),
    sustainability: clamp(b.sust - 10),
    resilience: clamp(b.res - 5),
    confidence: clamp(b.stab),
  };
}

export function buildLeanScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "lean",
    label: "Lean",
    projectedGains: clamp(b.auth + 10),
    projectedLosses: clamp(b.debt + 5),
    requiredEffort: 35,
    maintenancePressure: clamp(b.debt),
    semanticRisks: clamp(b.decay + 5),
    authorityImpact: clamp(b.auth + 8),
    operationalDebt: clamp(b.debt + 3),
    estimatedROI: clamp(b.intent + 12),
    sustainability: clamp(b.sust + 5),
    resilience: clamp(b.res),
    confidence: clamp(b.stab + 5),
  };
}

export function buildRecoveryScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "recovery",
    label: "Recuperação",
    projectedGains: clamp(b.auth + 12),
    projectedLosses: clamp(b.debt - 15),
    requiredEffort: 70,
    maintenancePressure: clamp(b.debt - 10),
    semanticRisks: clamp(b.decay - 15),
    authorityImpact: clamp(b.auth + 10),
    operationalDebt: clamp(b.debt - 20),
    estimatedROI: clamp(b.intent + 8),
    sustainability: clamp(b.sust + 15),
    resilience: clamp(b.res + 18),
    confidence: clamp(b.stab + 10),
  };
}

export function buildAuthorityDefenseScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "authority_defense",
    label: "Defesa de Autoridade",
    projectedGains: clamp(b.auth + 5),
    projectedLosses: clamp(b.debt - 5),
    requiredEffort: 55,
    maintenancePressure: clamp(b.debt + 5),
    semanticRisks: clamp(b.decay - 10),
    authorityImpact: clamp(b.auth + 15),
    operationalDebt: clamp(b.debt),
    estimatedROI: clamp(b.intent + 5),
    sustainability: clamp(b.sust + 12),
    resilience: clamp(b.res + 15),
    confidence: clamp(b.stab + 8),
  };
}

export function buildSemanticExpansionScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "semantic_expansion",
    label: "Expansão Semântica",
    projectedGains: clamp(b.cov + 22),
    projectedLosses: clamp(b.debt + 12),
    requiredEffort: 75,
    maintenancePressure: clamp(b.debt + 15),
    semanticRisks: clamp(b.decay + 8),
    authorityImpact: clamp(b.auth + 15),
    operationalDebt: clamp(b.debt + 14),
    estimatedROI: clamp(b.intent + 18),
    sustainability: clamp(b.sust + 3),
    resilience: clamp(b.res + 5),
    confidence: clamp(b.stab),
  };
}

export function buildCommercialAccelerationScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "commercial_acceleration",
    label: "Aceleração Comercial",
    projectedGains: clamp(b.intent + 30),
    projectedLosses: clamp(b.debt + 18),
    requiredEffort: 80,
    maintenancePressure: clamp(b.debt + 18),
    semanticRisks: clamp(b.decay + 10),
    authorityImpact: clamp(b.auth + 12),
    operationalDebt: clamp(b.debt + 20),
    estimatedROI: clamp(b.intent + 35),
    sustainability: clamp(b.sust - 5),
    resilience: clamp(b.res),
    confidence: clamp(b.stab - 5),
  };
}

export function buildMinimalMaintenanceScenario(t: TelemetrySnapshot): StrategicScenario {
  const b = base(t);
  return {
    name: "minimal_maintenance",
    label: "Manutenção Mínima",
    projectedGains: clamp(b.auth + 3),
    projectedLosses: clamp(b.decay + 8),
    requiredEffort: 20,
    maintenancePressure: clamp(b.debt - 3),
    semanticRisks: clamp(b.decay + 12),
    authorityImpact: clamp(b.auth - 2),
    operationalDebt: clamp(b.debt - 5),
    estimatedROI: clamp(b.intent + 3),
    sustainability: clamp(b.sust - 8),
    resilience: clamp(b.res - 10),
    confidence: clamp(b.stab),
  };
}

export function buildAllScenarios(t: TelemetrySnapshot): StrategicScenario[] {
  return [
    buildAggressiveGrowthScenario(t),
    buildLeanScenario(t),
    buildRecoveryScenario(t),
    buildAuthorityDefenseScenario(t),
    buildSemanticExpansionScenario(t),
    buildCommercialAccelerationScenario(t),
    buildMinimalMaintenanceScenario(t),
  ];
}
