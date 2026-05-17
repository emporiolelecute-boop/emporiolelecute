/**
 * Fase 14.6 — Meta Governance Core.
 * Camada máxima de governança estratégica do SEO OS.
 * Read-only. Safe Mode absoluto.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type GovernanceVerdict =
  | "SOVEREIGN"
  | "ASCENDANT"
  | "CONTROLLED"
  | "UNSTABLE"
  | "FRACTURED"
  | "COLLAPSING";

export function calculateStrategicGovernability(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_alignment_score ?? 0) * 0.3 +
    (t.strategic_consistency_score ?? 0) * 0.25 +
    (t.execution_focus_score ?? 0) * 0.2 +
    (100 - (t.strategic_fatigue_score ?? 0)) * 0.15 +
    (100 - (t.strategic_contradiction_score ?? 0)) * 0.1,
  );
}

export function calculateOperationalPredictability(t: TelemetrySnapshot): number {
  return clamp(
    (t.operational_score ?? 0) * 0.3 +
    (t.execution_efficiency ?? 0) * 0.25 +
    (100 - (t.execution_noise_score ?? 0)) * 0.2 +
    (100 - (t.operational_debt_score ?? 0)) * 0.15 +
    (100 - (t.bottleneck_score ?? 0)) * 0.1,
  );
}

export function calculateSystemicConsistency(t: TelemetrySnapshot): number {
  const op = t.operational_score ?? 0;
  const st = t.strategic_alignment_score ?? 0;
  const sem = t.semantic_stability_score ?? 0;
  const auth = t.authority_balance_score ?? t.ecosystem_integrity_score ?? 0;
  const avg = (op + st + sem + auth) / 4;
  const variance = (Math.abs(op - avg) + Math.abs(st - avg) + Math.abs(sem - avg) + Math.abs(auth - avg)) / 4;
  return clamp(avg - variance * 0.6);
}

export function calculateLongHorizonStability(t: TelemetrySnapshot): number {
  return clamp(
    (t.sustainability_score ?? 0) * 0.3 +
    (t.long_term_sustainability_score ?? 0) * 0.25 +
    (t.cluster_longevity_score ?? 0) * 0.2 +
    (t.authority_persistence_score ?? 0) * 0.15 +
    (100 - (t.collapse_probability_score ?? 0)) * 0.1,
  );
}

export function calculateContinuityStrength(t: TelemetrySnapshot): number {
  return clamp(
    (t.resilience_score ?? 0) * 0.25 +
    (t.recovery_capacity_score ?? 0) * 0.2 +
    (t.recovery_elasticity ?? 0) * 0.15 +
    (t.adaptive_capacity_score ?? 0) * 0.2 +
    (t.strategic_longevity_score ?? 0) * 0.2,
  );
}

export function calculateTrustworthiness(t: TelemetrySnapshot): number {
  return clamp(
    (t.systemic_synchronization_score ?? 0) * 0.25 +
    (100 - (t.systemic_noise_score ?? 0)) * 0.2 +
    (100 - (t.semantic_hallucination_score ?? 0)) * 0.15 +
    (100 - (t.false_growth_signal_score ?? 0)) * 0.15 +
    (t.execution_coherence_score ?? 0) * 0.25,
  );
}

export function calculateGovernanceScore(t: TelemetrySnapshot): number {
  return clamp(
    calculateStrategicGovernability(t) * 0.2 +
    calculateOperationalPredictability(t) * 0.18 +
    calculateSystemicConsistency(t) * 0.18 +
    calculateContinuityStrength(t) * 0.16 +
    calculateTrustworthiness(t) * 0.14 +
    calculateLongHorizonStability(t) * 0.14,
  );
}

export function detectGovernanceBreakdowns(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.strategic_contradiction_score ?? 0) > 50) out.push("Contradições estratégicas elevadas.");
  if ((t.execution_dilution_score ?? 0) > 50) out.push("Execução diluída em múltiplas frentes.");
  if ((t.strategic_scatter_score ?? 0) > 50) out.push("Dispersão estratégica acima do tolerável.");
  if ((t.fragmentation_risk_score ?? 0) > 55) out.push("Risco de fragmentação sistêmica.");
  return out;
}

export function detectStrategicContradictions(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  const g = (t.strategic_alignment_score ?? 0) - (t.strategic_consistency_score ?? 0);
  if (Math.abs(g) > 20) out.push("Alinhamento e consistência estratégica divergem.");
  if ((t.strategic_alignment_score ?? 0) > 70 && (t.execution_focus_score ?? 0) < 50)
    out.push("Estratégia clara, execução desfocada.");
  if ((t.operational_score ?? 0) > 70 && (t.strategic_alignment_score ?? 0) < 50)
    out.push("Operação eficiente sem direção estratégica clara.");
  return out;
}

export function detectSemanticInstability(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.semantic_drift_score ?? 0) > 45) out.push("Drift semântico acumulado.");
  if ((t.semantic_entropy_score ?? 0) > 50) out.push("Entropia semântica elevada.");
  if ((t.semantic_hallucination_score ?? 0) > 35) out.push("Sinais de alucinação semântica detectados.");
  return out;
}

export function detectAuthorityDistortions(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.authority_instability_score ?? 0) > 45) out.push("Autoridade instável entre clusters.");
  if ((t.overcentralization_risk ?? 0) > 55) out.push("Concentração excessiva de autoridade.");
  if ((t.authority_dispersion_score ?? 0) > 55) out.push("Autoridade dispersa em demasia.");
  return out;
}

export function detectOperationalNoise(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.systemic_noise_score ?? 0) > 45) out.push("Ruído sistêmico relevante.");
  if ((t.execution_noise_score ?? 0) > 45) out.push("Ruído na execução operacional.");
  if ((t.strategic_noise_score ?? 0) > 45) out.push("Ruído estratégico nas decisões.");
  return out;
}

export interface GovernanceReport {
  verdict: GovernanceVerdict;
  score: number;
  governability: number;
  predictability: number;
  consistency: number;
  cohesion: number;
  authorityBalance: number;
  ecosystemIntegrity: number;
  continuity: number;
  trustworthiness: number;
  longHorizon: number;
  contradictionPressure: number;
  fragmentation: number;
  operationalNoise: number;
  semanticInstability: number;
  authorityDistortion: number;
  existentialStability: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  contradictions: string[];
  systemic_conflicts: string[];
  continuity_risks: string[];
  governance_alerts: string[];
  strategic_dependencies: string[];
  resilience_vectors: string[];
}

export function buildGovernanceVerdict(t: TelemetrySnapshot): GovernanceReport {
  const score = calculateGovernanceScore(t);
  const governability = calculateStrategicGovernability(t);
  const predictability = calculateOperationalPredictability(t);
  const consistency = calculateSystemicConsistency(t);
  const continuity = calculateContinuityStrength(t);
  const trustworthiness = calculateTrustworthiness(t);
  const longHorizon = calculateLongHorizonStability(t);

  const cohesion = clamp(
    (t.semantic_balance_score ?? 0) * 0.4 +
    (t.semantic_connectivity_score ?? 0) * 0.3 +
    (100 - (t.semantic_drift_score ?? 0)) * 0.3,
  );
  const authorityBalance = clamp(
    (100 - (t.authority_instability_score ?? 0)) * 0.4 +
    (100 - (t.overcentralization_risk ?? 0)) * 0.3 +
    (100 - (t.authority_entropy ?? 0)) * 0.3,
  );
  const ecosystemIntegrity = clamp((t.ecosystem_integrity_score ?? 0) * 0.7 + consistency * 0.3);

  const contradictionPressure = clamp(
    ((t.strategic_contradiction_score ?? 0) + (t.execution_dilution_score ?? 0)) / 2,
  );
  const fragmentation = clamp(
    ((t.fragmentation_score ?? 0) + (t.fragmentation_risk_score ?? 0)) / 2,
  );
  const operationalNoise = clamp(
    ((t.systemic_noise_score ?? 0) + (t.execution_noise_score ?? 0) + (t.strategic_noise_score ?? 0)) / 3,
  );
  const semanticInstability = clamp(
    ((t.semantic_drift_score ?? 0) + (t.semantic_entropy_score ?? 0)) / 2,
  );
  const authorityDistortion = clamp(
    ((t.authority_instability_score ?? 0) + (t.overcentralization_risk ?? 0)) / 2,
  );
  const existentialStability = clamp(
    100 - (t.existential_risk_score ?? t.existential_exposure_score ?? 0) * 0.7 -
    (t.collapse_probability_score ?? 0) * 0.3,
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (governability >= 70) strengths.push("Forte governabilidade estratégica.");
  else if (governability < 50) weaknesses.push("Governabilidade estratégica frágil.");
  if (predictability >= 70) strengths.push("Operação previsível.");
  else if (predictability < 50) weaknesses.push("Operação imprevisível.");
  if (consistency >= 70) strengths.push("Consistência entre engines.");
  else if (consistency < 50) weaknesses.push("Inconsistências entre engines sistêmicas.");
  if (continuity >= 70) strengths.push("Continuidade resiliente.");
  else if (continuity < 50) weaknesses.push("Continuidade vulnerável.");
  if (trustworthiness >= 70) strengths.push("Sinais confiáveis e coerentes.");
  else if (trustworthiness < 50) weaknesses.push("Sinais sistêmicos pouco confiáveis.");
  if (longHorizon >= 70) strengths.push("Estabilidade de longo horizonte sólida.");
  else if (longHorizon < 50) weaknesses.push("Risco de instabilidade no longo prazo.");

  const contradictions = detectStrategicContradictions(t);
  const systemic_conflicts = detectGovernanceBreakdowns(t);
  const continuity_risks: string[] = [];
  if (continuity < 55) continuity_risks.push("Capacidade de continuidade abaixo do seguro.");
  if ((t.recovery_capacity_score ?? 0) < 50) continuity_risks.push("Recuperação operacional limitada.");
  if ((t.adaptive_capacity_score ?? 0) < 50) continuity_risks.push("Adaptabilidade reduzida.");

  const governance_alerts = [
    ...detectSemanticInstability(t),
    ...detectAuthorityDistortions(t),
    ...detectOperationalNoise(t),
  ];

  const strategic_dependencies: string[] = [];
  if ((t.cluster_dependency_score ?? 0) > 50) strategic_dependencies.push("Dependência elevada de clusters chave.");
  if ((t.authority_dependency_risk ?? 0) > 50) strategic_dependencies.push("Dependência de poucos hubs de autoridade.");
  if ((t.single_point_failure_score ?? 0) > 45) strategic_dependencies.push("Pontos únicos de falha identificados.");

  const resilience_vectors: string[] = [];
  if ((t.resilience_score ?? 0) >= 65) resilience_vectors.push("Resiliência sistêmica robusta.");
  if ((t.recovery_elasticity ?? 0) >= 60) resilience_vectors.push("Elasticidade de recuperação saudável.");
  if ((t.adaptive_capacity_score ?? 0) >= 60) resilience_vectors.push("Boa capacidade adaptativa.");

  let verdict: GovernanceVerdict;
  if (score >= 85 && contradictionPressure < 25) verdict = "SOVEREIGN";
  else if (score >= 75) verdict = "ASCENDANT";
  else if (score >= 60) verdict = "CONTROLLED";
  else if (score >= 45) verdict = "UNSTABLE";
  else if (score >= 30) verdict = "FRACTURED";
  else verdict = "COLLAPSING";

  const summary = `Governança ${verdict.toLowerCase()} (score ${score}). Consistência ${consistency}, governabilidade ${governability}, continuidade ${continuity}, confiabilidade ${trustworthiness}.`;

  return {
    verdict, score, governability, predictability, consistency,
    cohesion, authorityBalance, ecosystemIntegrity, continuity,
    trustworthiness, longHorizon, contradictionPressure, fragmentation,
    operationalNoise, semanticInstability, authorityDistortion, existentialStability,
    summary, strengths, weaknesses, contradictions,
    systemic_conflicts, continuity_risks, governance_alerts,
    strategic_dependencies, resilience_vectors,
  };
}
