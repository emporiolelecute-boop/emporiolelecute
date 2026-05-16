/**
 * Fase 14.4 — Executive Intelligence Grid.
 * Camada orquestradora read-only que correlaciona engines existentes.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const v = (n?: number) => (typeof n === "number" ? n : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type ExecutiveVerdict = "TRANSCENDENT" | "ELITE" | "STRONG" | "STABLE" | "FRAGILE" | "COLLAPSING";

export interface ExecutiveReport {
  state: number;
  harmony: number;
  clarity: number;
  coherence: number;
  sustainability: number;
  compounding: number;
  fragmentation: number;
  conflicts: number;
  drift: number;
  instability: number;
  resilience: number;
  durability: number;
  ecosystemIntegrity: number;
  verdict: ExecutiveVerdict;
  summary: string;
  strengths: string[];
  blockers: string[];
  contradictions: string[];
  inefficiencies: string[];
  strategic_priorities: string[];
  systemic_risks: string[];
  resilience_signals: string[];
}

export function calculateExecutiveState(t: TelemetrySnapshot): number {
  return clamp(
    v(t.system_health_score) * 0.25 +
    v(t.sustainability_score) * 0.2 +
    v(t.strategic_alignment_score) * 0.15 +
    v(t.resilience_score) * 0.15 +
    v(t.operational_score) * 0.15 +
    v(t.execution_efficiency) * 0.1
  );
}

export function calculateOperationalHarmony(t: TelemetrySnapshot): number {
  return clamp(
    v(t.execution_focus_score) * 0.3 +
    v(t.strategic_alignment_score) * 0.3 +
    (100 - v(t.execution_noise_score)) * 0.2 +
    (100 - v(t.operational_waste_score)) * 0.2
  );
}

export function calculateStrategicClarity(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_consistency_score) * 0.35 +
    v(t.strategic_alignment_score) * 0.25 +
    (100 - v(t.strategic_contradiction_score)) * 0.2 +
    (100 - v(t.volatility_score)) * 0.2
  );
}

export function calculateExecutionCoherence(t: TelemetrySnapshot): number {
  return clamp(
    v(t.execution_efficiency) * 0.3 +
    v(t.execution_focus_score) * 0.3 +
    (100 - v(t.fragmentation_score)) * 0.2 +
    (100 - v(t.bottleneck_score)) * 0.2
  );
}

export function calculateLongTermSustainability(t: TelemetrySnapshot): number {
  return clamp(
    v(t.sustainability_score) * 0.35 +
    v(t.sustainability_forecast) * 0.2 +
    v(t.authority_compounding_score) * 0.15 +
    v(t.cluster_longevity_score) * 0.15 +
    (100 - v(t.long_term_decay_risk)) * 0.15
  );
}

export function calculateCompoundingHealth(t: TelemetrySnapshot): number {
  return clamp(
    v(t.authority_compounding_score) * 0.4 +
    v(t.momentum_growth_score) * 0.2 +
    v(t.cluster_growth_score) * 0.2 +
    v(t.authority_growth_projection) * 0.2
  );
}

export function detectStrategicFragmentation(t: TelemetrySnapshot): number {
  return clamp(
    v(t.fragmentation_score) * 0.3 +
    v(t.fragmentation_pressure_score) * 0.3 +
    v(t.fragile_cluster_count) * 4 +
    v(t.orphan_cluster_count) * 4
  );
}

export function detectOperationalConflicts(t: TelemetrySnapshot): number {
  return clamp(
    v(t.strategic_contradiction_score) * 0.4 +
    v(t.operational_dissonance_score) * 0.3 +
    v(t.operational_waste_score) * 0.3
  );
}

export function detectSemanticDrift(t: TelemetrySnapshot): number {
  return clamp(
    v(t.semantic_aging_score) * 0.3 +
    v(t.meaning_dilution_score) * 0.3 +
    v(t.semantic_noise_score) * 0.2 +
    (100 - v(t.semantic_stability_score)) * 0.2
  );
}

export function detectAuthorityInstability(t: TelemetrySnapshot): number {
  return clamp(
    v(t.authority_entropy) * 0.35 +
    v(t.authority_dispersion_score) * 0.25 +
    v(t.authority_dependency_risk) * 0.2 +
    v(t.volatility_score) * 0.2
  );
}

export function estimateFutureResilience(t: TelemetrySnapshot): number {
  return clamp(
    v(t.resilience_score) * 0.3 +
    v(t.strategic_resilience_forecast) * 0.25 +
    v(t.recovery_capacity_score) * 0.2 +
    v(t.recovery_elasticity) * 0.15 +
    (100 - v(t.collapse_risk_score)) * 0.1
  );
}

export function estimateStrategicDurability(t: TelemetrySnapshot): number {
  return clamp(
    v(t.cluster_longevity_score) * 0.3 +
    v(t.semantic_stability_score) * 0.2 +
    v(t.authority_compounding_score) * 0.2 +
    (100 - v(t.long_term_decay_risk)) * 0.15 +
    (100 - v(t.semantic_aging_score)) * 0.15
  );
}

export function buildExecutiveVerdict(t: TelemetrySnapshot): ExecutiveReport {
  const state = calculateExecutiveState(t);
  const harmony = calculateOperationalHarmony(t);
  const clarity = calculateStrategicClarity(t);
  const coherence = calculateExecutionCoherence(t);
  const sustainability = calculateLongTermSustainability(t);
  const compounding = calculateCompoundingHealth(t);
  const fragmentation = detectStrategicFragmentation(t);
  const conflicts = detectOperationalConflicts(t);
  const drift = detectSemanticDrift(t);
  const instability = detectAuthorityInstability(t);
  const resilience = estimateFutureResilience(t);
  const durability = estimateStrategicDurability(t);
  const ecosystemIntegrity = clamp(
    (state * 0.3) + (sustainability * 0.25) + (resilience * 0.25) + (harmony * 0.2)
  );

  let verdict: ExecutiveVerdict = "STABLE";
  if (state >= 85 && resilience >= 80 && conflicts < 25) verdict = "TRANSCENDENT";
  else if (state >= 75) verdict = "ELITE";
  else if (state >= 65) verdict = "STRONG";
  else if (state >= 50) verdict = "STABLE";
  else if (state >= 35) verdict = "FRAGILE";
  else verdict = "COLLAPSING";

  const strengths: string[] = [];
  const blockers: string[] = [];
  const contradictions: string[] = [];
  const inefficiencies: string[] = [];
  const strategic_priorities: string[] = [];
  const systemic_risks: string[] = [];
  const resilience_signals: string[] = [];

  if (harmony >= 65) strengths.push("Harmonia operacional saudável");
  if (clarity >= 65) strengths.push("Clareza estratégica preservada");
  if (compounding >= 60) strengths.push("Capacidade de composição ativa");
  if (resilience >= 65) resilience_signals.push("Resiliência futura forte");
  if (durability >= 60) resilience_signals.push("Durabilidade semântica robusta");

  if (fragmentation > 55) blockers.push("Fragmentação estrutural elevada");
  if (conflicts > 50) contradictions.push("Conflitos estratégicos detectados");
  if (drift > 55) systemic_risks.push("Drift semântico em andamento");
  if (instability > 55) systemic_risks.push("Instabilidade de autoridade");
  if (v(t.operational_waste_score) > 45) inefficiencies.push("Desperdício operacional acima do ideal");
  if (v(t.execution_noise_score) > 45) inefficiencies.push("Ruído de execução alto");

  if (sustainability < 55) strategic_priorities.push("Reforçar sustentabilidade de longo prazo");
  if (clarity < 55) strategic_priorities.push("Reduzir contradições estratégicas");
  if (coherence < 55) strategic_priorities.push("Aumentar coerência de execução");
  if (compounding < 50) strategic_priorities.push("Reativar mecanismos de compounding");

  const summary = `Estado executivo ${verdict} (${state}/100). Harmonia ${harmony} · Clareza ${clarity} · Coerência ${coherence} · Sustentabilidade ${sustainability}.`;

  return {
    state, harmony, clarity, coherence, sustainability, compounding,
    fragmentation, conflicts, drift, instability, resilience, durability,
    ecosystemIntegrity, verdict, summary,
    strengths, blockers, contradictions, inefficiencies,
    strategic_priorities, systemic_risks, resilience_signals,
  };
}
