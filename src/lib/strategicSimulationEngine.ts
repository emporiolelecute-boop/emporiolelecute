/**
 * Fase 14.1 — Strategic Simulation Engine.
 *
 * Pure, side-effect-free simulation primitives used by the
 * Strategic Simulation admin dashboard. No public SEO impact.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type SimulationVerdict =
  | "Dominant"
  | "Strong"
  | "Stable"
  | "Fragile"
  | "Critical"
  | "Unsustainable";

const clamp = (v: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, Math.round(v)));

const safeAvg = (vals: number[]): number => {
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

export interface AuthorityExpansionResult {
  projectedAuthority: number;
  semanticGrowth: number;
  connectivityGain: number;
  compoundFactor: number;
  thematicExpansion: number;
}

export function simulateAuthorityExpansion(
  t: TelemetrySnapshot,
  horizonWeeks = 12,
): AuthorityExpansionResult {
  const baseline = t.averageAuthority || 0;
  const velocity = (t.authority_velocity_score || 0) / 100;
  const compound = 1 + velocity * (horizonWeeks / 12) * 0.35;
  return {
    projectedAuthority: clamp(baseline * compound),
    semanticGrowth: clamp((t.semantic_coverage_avg || 0) * (1 + velocity * 0.5)),
    connectivityGain: clamp((t.semantic_connectivity_score || 0) + velocity * 25),
    compoundFactor: Math.round(compound * 100) / 100,
    thematicExpansion: clamp((t.cluster_growth_score || 0) + velocity * 20),
  };
}

export interface SemanticCollapseResult {
  coverageLoss: number;
  thinExplosion: number;
  decayPressure: number;
  cannibalizationRisk: number;
  fragmentation: number;
  collapseScore: number;
}

export function simulateSemanticCollapse(t: TelemetrySnapshot): SemanticCollapseResult {
  const decay = t.content_decay_score || 0;
  const fragmentation = t.fragmentation_score || 0;
  const thin = t.total > 0 ? (t.thinContent / t.total) * 100 : 0;
  const cannibal = t.total > 0 ? (t.cannibalized / t.total) * 100 : 0;
  const collapse = (decay * 0.35) + (fragmentation * 0.25) + (thin * 0.2) + (cannibal * 0.2);
  return {
    coverageLoss: clamp((t.semantic_coverage_avg || 0) * (decay / 200)),
    thinExplosion: clamp(thin * 1.4),
    decayPressure: clamp(decay),
    cannibalizationRisk: clamp(cannibal),
    fragmentation: clamp(fragmentation),
    collapseScore: clamp(collapse),
  };
}

export interface ExecutionOverloadResult {
  saturation: number;
  bottleneckPressure: number;
  debtExplosion: number;
  maintenanceExplosion: number;
  overloadScore: number;
}

export function simulateExecutionOverload(t: TelemetrySnapshot): ExecutionOverloadResult {
  const sat = t.saturation_score || 0;
  const bottleneck = t.bottleneck_score || 0;
  const debt = t.operational_debt_score || 0;
  const maintenance = t.maintenance_pressure_score || 0;
  const overload = safeAvg([sat, bottleneck, debt, maintenance]);
  return {
    saturation: clamp(sat),
    bottleneckPressure: clamp(bottleneck),
    debtExplosion: clamp(debt * 1.15),
    maintenanceExplosion: clamp(Math.max(maintenance, t.maintenance_explosion_risk || 0)),
    overloadScore: clamp(overload),
  };
}

export interface CommercialExpansionResult {
  intentLift: number;
  conversionPotential: number;
  hubReinforcement: number;
  commercialMomentum: number;
}

export function simulateCommercialExpansion(t: TelemetrySnapshot): CommercialExpansionResult {
  const intent = t.business_intent_score || 0;
  const diversity = t.commercial_diversity_score || 0;
  const momentum = t.momentum_growth_score || 0;
  return {
    intentLift: clamp(intent * (1 + momentum / 200)),
    conversionPotential: clamp((intent * 0.6) + (diversity * 0.4)),
    hubReinforcement: clamp((t.authority_flow_score || 0) + momentum / 4),
    commercialMomentum: clamp(momentum),
  };
}

export interface AuthorityCompoundingResult {
  compoundAuthority: number;
  semanticReinforcement: number;
  longTermVelocity: number;
  compoundingFactor: number;
}

export function simulateAuthorityCompounding(
  t: TelemetrySnapshot,
  horizonWeeks = 26,
): AuthorityCompoundingResult {
  const v = (t.authority_velocity_score || 0) / 100;
  const base = t.averageAuthority || 0;
  const factor = Math.pow(1 + v * 0.05, horizonWeeks / 4);
  return {
    compoundAuthority: clamp(base * factor),
    semanticReinforcement: clamp((t.semantic_connectivity_score || 0) * factor / 1.5),
    longTermVelocity: clamp(v * 100 * 1.2),
    compoundingFactor: Math.round(factor * 100) / 100,
  };
}

export interface ClusterDominanceResult {
  concentration: number;
  centralizationRisk: number;
  systemicFragility: number;
  dominanceScore: number;
}

export function simulateClusterDominance(t: TelemetrySnapshot): ClusterDominanceResult {
  const concentration = t.cluster_dependency_score || 0;
  const overc = t.overcentralization_risk || 0;
  const fragility = t.fragile_cluster_count || 0;
  return {
    concentration: clamp(concentration),
    centralizationRisk: clamp(overc),
    systemicFragility: clamp(Math.min(100, fragility * 10)),
    dominanceScore: clamp((concentration + overc) / 2),
  };
}

export interface SimulationVerdictBundle {
  verdict: SimulationVerdict;
  score: number;
  blockers: string[];
  strengths: string[];
  growthVectors: string[];
  decayVectors: string[];
  operationalWarnings: string[];
  semanticRisks: string[];
}

export function buildSimulationVerdict(t: TelemetrySnapshot): SimulationVerdictBundle {
  const expansion = simulateAuthorityExpansion(t);
  const collapse = simulateSemanticCollapse(t);
  const overload = simulateExecutionOverload(t);
  const dominance = simulateClusterDominance(t);

  const score = clamp(
    (expansion.projectedAuthority * 0.3) +
    ((100 - collapse.collapseScore) * 0.25) +
    ((100 - overload.overloadScore) * 0.2) +
    ((100 - dominance.dominanceScore) * 0.15) +
    ((t.sustainability_score || 0) * 0.1)
  );

  let verdict: SimulationVerdict;
  if (score >= 85) verdict = "Dominant";
  else if (score >= 70) verdict = "Strong";
  else if (score >= 55) verdict = "Stable";
  else if (score >= 40) verdict = "Fragile";
  else if (score >= 25) verdict = "Critical";
  else verdict = "Unsustainable";

  const blockers: string[] = [];
  const strengths: string[] = [];
  const growthVectors: string[] = [];
  const decayVectors: string[] = [];
  const operationalWarnings: string[] = [];
  const semanticRisks: string[] = [];

  if (collapse.collapseScore > 60) blockers.push("Pressão de colapso semântico elevada");
  if (overload.overloadScore > 65) blockers.push("Sobrecarga operacional iminente");
  if (dominance.dominanceScore > 70) blockers.push("Centralização excessiva de autoridade");

  if (expansion.projectedAuthority > 70) strengths.push("Autoridade projetada robusta");
  if ((t.sustainability_score || 0) > 70) strengths.push("Sustentabilidade sólida");
  if ((t.resilience_score || 0) > 70) strengths.push("Resiliência sistêmica");

  if (expansion.compoundFactor > 1.1) growthVectors.push("Compounding semântico ativo");
  if ((t.cluster_growth_score || 0) > 50) growthVectors.push("Expansão de clusters em curso");
  if ((t.momentum_growth_score || 0) > 50) growthVectors.push("Momentum comercial positivo");

  if (collapse.decayPressure > 50) decayVectors.push("Decay de conteúdo acentuado");
  if (collapse.fragmentation > 50) decayVectors.push("Fragmentação semântica");
  if (collapse.thinExplosion > 40) decayVectors.push("Thin content em expansão");

  if (overload.bottleneckPressure > 55) operationalWarnings.push("Gargalos editoriais");
  if (overload.debtExplosion > 55) operationalWarnings.push("Debt operacional crescente");
  if (overload.maintenanceExplosion > 55) operationalWarnings.push("Explosão de manutenção projetada");

  if ((t.cannibalized || 0) > 0) semanticRisks.push("Canibalização ativa");
  if ((t.orphan_entities || 0) > 0) semanticRisks.push("Entidades órfãs sem links");
  if ((t.cluster_dependency_score || 0) > 60) semanticRisks.push("Dependência excessiva de clusters");

  return {
    verdict,
    score,
    blockers,
    strengths,
    growthVectors,
    decayVectors,
    operationalWarnings,
    semanticRisks,
  };
}
