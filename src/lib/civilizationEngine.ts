/**
 * Fase 14.7 — Civilization Engine.
 * Read-only. SAFE MODE.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type CivilizationVerdict =
  | "IMMORTAL"
  | "TRANSCENDENT"
  | "DOMINANT"
  | "STABLE"
  | "DECLINING"
  | "COLLAPSING";

export function calculateEcosystemSurvivability(t: TelemetrySnapshot): number {
  return clamp(
    (t.survival_confidence_score ?? 0) * 0.35 +
    (t.long_term_viability_score ?? 0) * 0.25 +
    (t.resilience_continuity_score ?? 0) * 0.2 +
    (100 - (t.collapse_probability_score ?? 0)) * 0.2,
  );
}

export function calculateSemanticContinuity(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_stability_score ?? 0) * 0.35 +
    (t.semantic_cohesion_score ?? 0) * 0.25 +
    (100 - (t.semantic_drift_score ?? 0)) * 0.2 +
    (100 - (t.semantic_entropy_score ?? 0)) * 0.2,
  );
}

export function calculateAuthorityLegacy(t: TelemetrySnapshot): number {
  return clamp(
    (t.authority_persistence_score ?? 0) * 0.4 +
    (t.authority_balance_score ?? 0) * 0.3 +
    (100 - (t.authority_instability_score ?? 0)) * 0.3,
  );
}

export function calculateStrategicLongevity(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_longevity_score ?? 0) * 0.4 +
    (t.long_horizon_survivability_score ?? 0) * 0.3 +
    (t.strategic_consistency_score ?? 0) * 0.3,
  );
}

export function calculateOperationalDurability(t: TelemetrySnapshot): number {
  return clamp(
    (t.operational_durability_score ?? 0) * 0.4 +
    (t.execution_efficiency ?? 0) * 0.3 +
    (100 - (t.execution_fatigue_score ?? 0)) * 0.3,
  );
}

export function calculateLongTermCompounding(t: TelemetrySnapshot): number {
  return clamp(
    (t.compounding_score ?? 0) * 0.4 +
    (t.authority_growth_velocity ?? 0) * 0.3 +
    (t.sustainability_continuity_score ?? 0) * 0.3,
  );
}

export function calculateCivilizationIntegrity(t: TelemetrySnapshot): number {
  return clamp(
    (t.ecosystem_integrity_score ?? 0) * 0.3 +
    (t.systemic_consistency_score ?? 0) * 0.25 +
    (t.governance_score ?? 0) * 0.25 +
    (t.structural_integrity_score ?? 0) * 0.2,
  );
}

export function calculateCivilizationScore(t: TelemetrySnapshot): number {
  return clamp(
    calculateEcosystemSurvivability(t) * 0.2 +
    calculateSemanticContinuity(t) * 0.15 +
    calculateAuthorityLegacy(t) * 0.15 +
    calculateStrategicLongevity(t) * 0.15 +
    calculateOperationalDurability(t) * 0.1 +
    calculateLongTermCompounding(t) * 0.1 +
    calculateCivilizationIntegrity(t) * 0.15,
  );
}

export function detectCivilizationWeaknesses(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if (calculateEcosystemSurvivability(t) < 55) out.push("Sobrevivência do ecossistema comprometida.");
  if (calculateAuthorityLegacy(t) < 55) out.push("Legado de autoridade vulnerável.");
  if (calculateOperationalDurability(t) < 55) out.push("Durabilidade operacional insuficiente.");
  if (calculateCivilizationIntegrity(t) < 60) out.push("Integridade civilizacional erodida.");
  return out;
}

export function detectLegacyBreaks(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.authority_persistence_score ?? 100) < 50) out.push("Quebra de persistência de autoridade.");
  if ((t.strategic_memory_strength_score ?? 100) < 50) out.push("Memória estratégica desvanecendo.");
  if ((t.continuity_depth_score ?? 100) < 50) out.push("Profundidade de continuidade insuficiente.");
  return out;
}

export function detectStrategicDecay(t: TelemetrySnapshot): string[] {
  const out: string[] = [];
  if ((t.strategic_fatigue_score ?? 0) > 50) out.push("Decadência estratégica em curso.");
  if ((t.governance_drift_score ?? 0) > 45) out.push("Drift de governança acelerando declínio.");
  if ((t.civilization_decay_score ?? 0) > 40) out.push("Decadência civilizacional perceptível.");
  return out;
}

export interface CivilizationReport {
  verdict: CivilizationVerdict;
  score: number;
  summary: string;
  survivability: number;
  semanticContinuity: number;
  authorityLegacy: number;
  strategicLongevity: number;
  operationalDurability: number;
  compounding: number;
  integrity: number;
  strengths: string[];
  weaknesses: string[];
  continuity_vectors: string[];
  resilience_vectors: string[];
  civilization_risks: string[];
  strategic_fragilities: string[];
  existential_dependencies: string[];
  long_term_priorities: string[];
}

export function buildCivilizationVerdict(t: TelemetrySnapshot): CivilizationReport {
  const score = calculateCivilizationScore(t);
  const survivability = calculateEcosystemSurvivability(t);
  const semanticContinuity = calculateSemanticContinuity(t);
  const authorityLegacy = calculateAuthorityLegacy(t);
  const strategicLongevity = calculateStrategicLongevity(t);
  const operationalDurability = calculateOperationalDurability(t);
  const compounding = calculateLongTermCompounding(t);
  const integrity = calculateCivilizationIntegrity(t);

  let verdict: CivilizationVerdict = "STABLE";
  if (score >= 92) verdict = "IMMORTAL";
  else if (score >= 84) verdict = "TRANSCENDENT";
  else if (score >= 75) verdict = "DOMINANT";
  else if (score >= 60) verdict = "STABLE";
  else if (score >= 45) verdict = "DECLINING";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  if (survivability >= 75) strengths.push("Alta sobrevivência ecossistêmica.");
  if (authorityLegacy >= 75) strengths.push("Legado de autoridade sólido.");
  if (compounding >= 70) strengths.push("Compounding de longo prazo positivo.");
  if (integrity >= 75) strengths.push("Integridade civilizacional preservada.");

  const weaknesses = detectCivilizationWeaknesses(t);
  const fragilities = detectLegacyBreaks(t);
  const decay = detectStrategicDecay(t);

  const continuity_vectors: string[] = [];
  if (semanticContinuity >= 70) continuity_vectors.push("Continuidade semântica estável.");
  if ((t.execution_continuity_score ?? 0) >= 70) continuity_vectors.push("Continuidade de execução estável.");
  if ((t.recovery_continuity_score ?? 0) >= 70) continuity_vectors.push("Continuidade de recuperação estável.");

  const resilience_vectors: string[] = [];
  if ((t.resilience_continuity_score ?? 0) >= 70) resilience_vectors.push("Resiliência contínua robusta.");
  if ((t.entropy_resistance_score ?? 0) >= 65) resilience_vectors.push("Resistência à entropia adequada.");
  if ((t.collapse_resistance_score ?? 0) >= 65) resilience_vectors.push("Resistência ao colapso operante.");

  const civilization_risks = [...weaknesses, ...decay];
  const existential_dependencies: string[] = [];
  if ((t.single_point_failure_score ?? 0) > 50) existential_dependencies.push("Pontos únicos de falha existenciais.");
  if ((t.cluster_fragility_score ?? 0) > 50) existential_dependencies.push("Fragilidade de clusters críticos.");

  const long_term_priorities: string[] = [];
  if (compounding < 60) long_term_priorities.push("Reforçar mecanismos de compounding.");
  if (integrity < 65) long_term_priorities.push("Restaurar integridade sistêmica.");
  if (authorityLegacy < 65) long_term_priorities.push("Diversificar e perpetuar autoridade.");
  if (semanticContinuity < 65) long_term_priorities.push("Estabilizar continuidade semântica.");

  const summary = `Civilização ${verdict.toLowerCase()} (${score}). Sobrevivência ${survivability}, legado ${authorityLegacy}, longevidade ${strategicLongevity}.`;

  return {
    verdict, score, summary,
    survivability, semanticContinuity, authorityLegacy, strategicLongevity,
    operationalDurability, compounding, integrity,
    strengths, weaknesses,
    continuity_vectors, resilience_vectors,
    civilization_risks,
    strategic_fragilities: fragilities,
    existential_dependencies,
    long_term_priorities,
  };
}
