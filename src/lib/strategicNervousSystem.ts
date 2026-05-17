/**
 * Fase 14.5 — Strategic Nervous System.
 * Consolida todas as engines existentes em uma camada de "sistema nervoso" estratégico.
 * Read-only. Safe Mode absoluto.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export type NervousSystemVerdict =
  | "ASCENDED"
  | "EVOLVED"
  | "STABLE"
  | "STRAINED"
  | "FRAGILE"
  | "CRITICAL";

export function calculateOperationalPulse(t: TelemetrySnapshot): number {
  return clamp(
    (t.operational_score ?? 0) * 0.35 +
    (t.execution_efficiency ?? 0) * 0.25 +
    (t.execution_capacity_score ?? 0) * 0.2 +
    (100 - (t.operational_debt_score ?? 0)) * 0.2,
  );
}

export function calculateStrategicPulse(t: TelemetrySnapshot): number {
  return clamp(
    (t.strategic_alignment_score ?? 0) * 0.3 +
    (t.strategic_consistency_score ?? 0) * 0.25 +
    (t.execution_focus_score ?? 0) * 0.2 +
    (100 - (t.strategic_fatigue_score ?? 0)) * 0.25,
  );
}

export function calculateSemanticPulse(t: TelemetrySnapshot): number {
  return clamp(
    (t.semantic_stability_score ?? 0) * 0.3 +
    (t.semantic_balance_score ?? 0) * 0.25 +
    (t.semantic_connectivity_score ?? 0) * 0.2 +
    (100 - (t.semantic_entropy_score ?? 0)) * 0.25,
  );
}

export function calculateSystemicSynchronization(t: TelemetrySnapshot): number {
  const op = calculateOperationalPulse(t);
  const st = calculateStrategicPulse(t);
  const sem = calculateSemanticPulse(t);
  const avg = (op + st + sem) / 3;
  const variance = (Math.abs(op - avg) + Math.abs(st - avg) + Math.abs(sem - avg)) / 3;
  return clamp(avg - variance * 0.5);
}

export function calculateAdaptiveCapacity(t: TelemetrySnapshot): number {
  return clamp(
    (t.adaptive_capacity_score ?? 0) * 0.4 +
    (t.recovery_capacity_score ?? 0) * 0.3 +
    (t.recovery_elasticity ?? 0) * 0.3,
  );
}

export function calculateRecoveryIntelligence(t: TelemetrySnapshot): number {
  return clamp(
    (t.recovery_capacity_score ?? 0) * 0.4 +
    (t.adaptive_recovery_score ?? 0) * 0.3 +
    (t.resilience_score ?? 0) * 0.3,
  );
}

export function calculateStructuralIntegrity(t: TelemetrySnapshot): number {
  return clamp(
    (t.resilience_score ?? 0) * 0.3 +
    (100 - (t.fragmentation_score ?? 0)) * 0.25 +
    (t.ecosystem_integrity_score ?? 0) * 0.25 +
    (100 - (t.collapse_risk_score ?? 0)) * 0.2,
  );
}

export function calculateLongTermViability(t: TelemetrySnapshot): number {
  return clamp(
    (t.sustainability_score ?? 0) * 0.3 +
    (t.sustainability_forecast ?? 0) * 0.25 +
    (t.long_term_sustainability_score ?? 0) * 0.25 +
    (t.authority_compounding_score ?? 0) * 0.2,
  );
}

export function calculateNervousSystemState(t: TelemetrySnapshot): number {
  return clamp(
    calculateSystemicSynchronization(t) * 0.3 +
    calculateStructuralIntegrity(t) * 0.25 +
    calculateAdaptiveCapacity(t) * 0.2 +
    calculateRecoveryIntelligence(t) * 0.15 +
    calculateLongTermViability(t) * 0.1,
  );
}

export interface NervousSystemReport {
  verdict: NervousSystemVerdict;
  score: number;
  pulses: { operational: number; strategic: number; semantic: number };
  synchronization: number;
  structuralIntegrity: number;
  adaptiveCapacity: number;
  recoveryIntelligence: number;
  longTermViability: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  contradictions: string[];
  dependencies: string[];
  systemic_alerts: string[];
  resilience_factors: string[];
  survival_signals: string[];
  intervention_priorities: string[];
}

export function buildNervousSystemVerdict(t: TelemetrySnapshot): NervousSystemReport {
  const score = calculateNervousSystemState(t);
  const op = calculateOperationalPulse(t);
  const st = calculateStrategicPulse(t);
  const sem = calculateSemanticPulse(t);
  const sync = calculateSystemicSynchronization(t);
  const integ = calculateStructuralIntegrity(t);
  const ad = calculateAdaptiveCapacity(t);
  const rec = calculateRecoveryIntelligence(t);
  const via = calculateLongTermViability(t);

  let verdict: NervousSystemVerdict = "STABLE";
  if (score >= 85) verdict = "ASCENDED";
  else if (score >= 72) verdict = "EVOLVED";
  else if (score >= 58) verdict = "STABLE";
  else if (score >= 42) verdict = "STRAINED";
  else if (score >= 28) verdict = "FRAGILE";
  else verdict = "CRITICAL";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const contradictions: string[] = [];
  const dependencies: string[] = [];
  const systemic_alerts: string[] = [];
  const resilience_factors: string[] = [];
  const survival_signals: string[] = [];
  const intervention_priorities: string[] = [];

  if (integ >= 70) strengths.push("Integridade estrutural sólida");
  if (sync >= 70) strengths.push("Pulsos sistêmicos sincronizados");
  if (via >= 65) strengths.push("Viabilidade de longo prazo preservada");
  if (rec >= 65) resilience_factors.push("Capacidade de recuperação ativa");
  if (ad >= 65) resilience_factors.push("Elasticidade adaptativa elevada");

  if (op < 55) weaknesses.push("Pulso operacional baixo");
  if (st < 55) weaknesses.push("Pulso estratégico enfraquecido");
  if (sem < 55) weaknesses.push("Pulso semântico em queda");
  if ((t.collapse_risk_score ?? 0) > 40) systemic_alerts.push("Risco de colapso elevado");
  if ((t.cascade_failure_risk ?? 0) > 40) systemic_alerts.push("Risco de cascata sistêmica");
  if ((t.authority_dependency_risk ?? 0) > 50) dependencies.push("Dependência excessiva de autoridade central");
  if ((t.cluster_dependency_score ?? 0) > 50) dependencies.push("Concentração crítica em poucos clusters");
  if ((t.overcentralization_risk ?? 0) > 50) dependencies.push("Sobre-centralização operacional");

  if (op >= 65 && (t.execution_noise_score ?? 0) > 40) contradictions.push("Pulso operacional forte com ruído de execução alto");
  if (st >= 65 && (t.strategic_contradiction_score ?? 0) > 30) contradictions.push("Estratégia forte com contradições internas");
  if (sem >= 65 && (t.semantic_entropy_score ?? 0) > 40) contradictions.push("Semântica forte com entropia crescente");

  if (score >= 60) survival_signals.push("Sistema nervoso operando com margem");
  if (via >= 60) survival_signals.push("Trajetória sustentável projetada");
  if (rec >= 60) survival_signals.push("Janela de recuperação ainda viável");

  if (verdict === "CRITICAL" || verdict === "FRAGILE") {
    intervention_priorities.push("Reduzir débito operacional e estabilizar pulsos");
    intervention_priorities.push("Mitigar dependências críticas de cluster/autoridade");
  }
  if ((t.strategic_fatigue_score ?? 0) > 50) intervention_priorities.push("Aliviar fadiga estratégica acumulada");
  if ((t.maintenance_pressure_score ?? 0) > 50) intervention_priorities.push("Reduzir pressão de manutenção");

  const summary = `Nervous System ${verdict} (${score}). Pulsos op/strat/sem: ${op}/${st}/${sem}. Sincronização: ${sync}. Integridade: ${integ}. Viabilidade: ${via}.`;

  return {
    verdict, score,
    pulses: { operational: op, strategic: st, semantic: sem },
    synchronization: sync,
    structuralIntegrity: integ,
    adaptiveCapacity: ad,
    recoveryIntelligence: rec,
    longTermViability: via,
    summary,
    strengths, weaknesses, contradictions, dependencies,
    systemic_alerts, resilience_factors, survival_signals, intervention_priorities,
  };
}
