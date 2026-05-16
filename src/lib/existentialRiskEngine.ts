/**
 * Fase 14.3 — Existential Risk Engine.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export interface ExistentialThreat { key: string; severity: "low" | "medium" | "high"; note: string; }

export function detectExistentialThreats(t: TelemetrySnapshot): ExistentialThreat[] {
  const out: ExistentialThreat[] = [];
  if (t.collapse_risk_score > 70) out.push({ key: "collapse", severity: "high", note: "Risco crítico de colapso operacional" });
  if (t.cascade_failure_risk > 60) out.push({ key: "cascade", severity: "high", note: "Risco de falha em cascata" });
  if (t.authority_dependency_risk > 70) out.push({ key: "dependency", severity: "high", note: "Dependência excessiva de poucos clusters" });
  if (t.long_term_decay_risk > 60) out.push({ key: "decay", severity: "medium", note: "Decaimento de longo prazo elevado" });
  if (t.maintenance_explosion_risk > 70) out.push({ key: "maintenance", severity: "high", note: "Explosão de manutenção iminente" });
  if (t.semantic_aging_score > 70) out.push({ key: "aging", severity: "medium", note: "Envelhecimento semântico avançado" });
  return out;
}

export function detectSystemicCollapseVectors(t: TelemetrySnapshot): number {
  return clamp((t.cascade_failure_risk * 0.35) + (t.collapse_risk_score * 0.35) + (t.fragmentation_score * 0.15) + (t.cluster_failure_probability * 0.15));
}

export function estimateExistentialRisk(t: TelemetrySnapshot): number {
  const vec = detectSystemicCollapseVectors(t);
  return clamp((vec * 0.5) + (t.long_term_decay_risk * 0.25) + (t.maintenance_explosion_risk * 0.25));
}

export function detectSemanticIdentityLoss(t: TelemetrySnapshot): number {
  return clamp((t.meaning_dilution_score * 0.4) + (t.semantic_noise_score * 0.3) + (t.semantic_entropy_score * 0.3));
}

export function estimateRecoveryProbability(t: TelemetrySnapshot): number {
  const risk = estimateExistentialRisk(t);
  const capacity = (t.recovery_capacity_score + t.adaptive_capacity_score + t.resilience_score) / 3;
  return clamp(capacity - risk * 0.5);
}

export function calculateSystemSurvivalScore(t: TelemetrySnapshot): number {
  const risk = estimateExistentialRisk(t);
  const identity = 100 - detectSemanticIdentityLoss(t);
  const recovery = estimateRecoveryProbability(t);
  return clamp((100 - risk) * 0.4 + identity * 0.3 + recovery * 0.3);
}

export interface ExistentialMitigationItem { priority: "low" | "medium" | "high"; action: string; rationale: string; }

export function buildExistentialMitigationPlan(t: TelemetrySnapshot): ExistentialMitigationItem[] {
  const plan: ExistentialMitigationItem[] = [];
  const threats = detectExistentialThreats(t);
  for (const th of threats) {
    if (th.key === "collapse") plan.push({ priority: "high", action: "Reforçar pilares estratégicos críticos", rationale: th.note });
    if (th.key === "cascade") plan.push({ priority: "high", action: "Reduzir acoplamento entre clusters", rationale: th.note });
    if (th.key === "dependency") plan.push({ priority: "high", action: "Diversificar fontes de autoridade", rationale: th.note });
    if (th.key === "decay") plan.push({ priority: "medium", action: "Refresh editorial em conteúdo legado", rationale: th.note });
    if (th.key === "maintenance") plan.push({ priority: "high", action: "Reduzir backlog de manutenção", rationale: th.note });
    if (th.key === "aging") plan.push({ priority: "medium", action: "Atualização semântica programada", rationale: th.note });
  }
  return plan;
}
