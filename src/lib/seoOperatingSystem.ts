/**
 * Fase 13.2 — SEO Operating System (heurístico, leitura/diagnóstico).
 * Safe Mode absoluto: nenhum side-effect, nenhuma escrita pública.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type OperationalVerdict = "Elite" | "Strong" | "Stable" | "Fragile" | "Critical";

export interface OperationalReport {
  score: number;
  verdict: OperationalVerdict;
  executionCapacity: number;
  editorialVelocity: number;
  semanticVelocity: number;
  authorityVelocity: number;
  recoveryCapacity: number;
  riskPressure: number;
  fragmentationScore: number;
  operationalDebt: number;
  executionLoad: number;
  recoveryComplexity: number;
  blockers: string[];
  strengths: string[];
  recommendations: string[];
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const safe = (n?: number) => (typeof n === "number" && isFinite(n) ? n : 0);

export function calculateExecutionCapacity(t: TelemetrySnapshot): number {
  const base = 100 - safe(t.regression_risk_score) * 0.4 - safe(t.fragile_cluster_count) * 2;
  const boost = safe(t.execution_efficiency) * 0.4 + safe(t.quick_win_score) * 0.2;
  return clamp(Math.round(base * 0.6 + boost));
}

export function calculateRecoveryCapacity(t: TelemetrySnapshot): number {
  const r = 100 - safe(t.recovery_difficulty_avg) - safe(t.content_decay_score) * 0.5;
  const boost = safe(t.orphan_recovery_rate) * 0.3 + safe(t.cluster_growth_score) * 0.2;
  return clamp(Math.round(r * 0.7 + boost));
}

export function calculateOperationalDebt(t: TelemetrySnapshot): number {
  const debt =
    safe(t.thinContent) * 1.5 +
    safe(t.orphan_entities) * 1.2 +
    safe(t.content_gap_count) * 1.1 +
    safe(t.blocked) * 0.6 +
    safe(t.overlinked_pages) * 0.4;
  return clamp(Math.round(debt));
}

export function calculateSemanticVelocity(t: TelemetrySnapshot): number {
  return clamp(
    Math.round(
      safe(t.cluster_growth_score) * 0.4 +
        safe(t.semantic_connectivity_score) * 0.3 +
        safe(t.semantic_balance_score) * 0.3,
    ),
  );
}

export function calculateAuthorityVelocity(t: TelemetrySnapshot): number {
  return clamp(
    Math.round(
      safe(t.authority_growth_projection) * 0.5 +
        safe(t.authority_flow_score) * 0.3 +
        safe(t.averageAuthority) * 0.2,
    ),
  );
}

export function calculateEditorialVelocity(t: TelemetrySnapshot): number {
  return clamp(
    Math.round(
      safe(t.editorial_maturity_avg) * 0.4 +
        safe(t.thematic_depth_avg) * 0.3 +
        safe(t.semantic_coverage_avg) * 0.3,
    ),
  );
}

export function calculateFragmentationScore(t: TelemetrySnapshot): number {
  return clamp(
    Math.round(
      safe(t.semantic_loop_count) * 2 +
        safe(t.fragile_cluster_count) * 3 +
        (100 - safe(t.authority_distribution_score)) * 0.4,
    ),
  );
}

export function calculateRiskPressure(t: TelemetrySnapshot): number {
  return clamp(
    Math.round(
      safe(t.regression_risk_score) * 0.4 +
        safe(t.authority_dependency_risk) * 0.3 +
        safe(t.overcentralization_risk) * 0.2 +
        safe(t.volatility_score) * 0.1,
    ),
  );
}

export function calculateOperationalScore(t: TelemetrySnapshot): number {
  const ec = calculateExecutionCapacity(t);
  const ev = calculateEditorialVelocity(t);
  const sv = calculateSemanticVelocity(t);
  const av = calculateAuthorityVelocity(t);
  const rc = calculateRecoveryCapacity(t);
  const debt = calculateOperationalDebt(t);
  const risk = calculateRiskPressure(t);
  const frag = calculateFragmentationScore(t);

  const positive = ec * 0.2 + ev * 0.15 + sv * 0.15 + av * 0.2 + rc * 0.15;
  const negative = debt * 0.1 + risk * 0.15 + frag * 0.1;
  return clamp(Math.round(positive - negative + 25));
}

export function buildOperationalVerdict(score: number): OperationalVerdict {
  if (score >= 85) return "Elite";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Stable";
  if (score >= 35) return "Fragile";
  return "Critical";
}

export function buildOperationalReport(t: TelemetrySnapshot): OperationalReport {
  const executionCapacity = calculateExecutionCapacity(t);
  const editorialVelocity = calculateEditorialVelocity(t);
  const semanticVelocity = calculateSemanticVelocity(t);
  const authorityVelocity = calculateAuthorityVelocity(t);
  const recoveryCapacity = calculateRecoveryCapacity(t);
  const riskPressure = calculateRiskPressure(t);
  const fragmentationScore = calculateFragmentationScore(t);
  const operationalDebt = calculateOperationalDebt(t);
  const score = calculateOperationalScore(t);
  const verdict = buildOperationalVerdict(score);

  const blockers: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  if (operationalDebt > 60) blockers.push("Débito operacional alto");
  if (riskPressure > 55) blockers.push("Pressão de risco elevada");
  if (fragmentationScore > 60) blockers.push("Fragmentação semântica");
  if (safe(t.thinContent) > 5) blockers.push(`${t.thinContent} entidades thin content`);
  if (safe(t.orphan_entities) > 5) blockers.push(`${t.orphan_entities} órfãs sem linkagem`);

  if (executionCapacity >= 70) strengths.push("Capacidade de execução saudável");
  if (authorityVelocity >= 60) strengths.push("Autoridade em crescimento");
  if (editorialVelocity >= 60) strengths.push("Maturidade editorial sólida");
  if (recoveryCapacity >= 65) strengths.push("Bom potencial de recuperação");

  if (operationalDebt > 40) recommendations.push("Priorizar redução de débito (thin + órfãs)");
  if (fragmentationScore > 50) recommendations.push("Consolidar clusters frágeis");
  if (editorialVelocity < 50) recommendations.push("Aumentar profundidade editorial");
  if (recoveryCapacity < 50) recommendations.push("Plano de recuperação assistida");
  if (!recommendations.length) recommendations.push("Manter cadência atual e capturar snapshots");

  const executionLoad = clamp(Math.round(operationalDebt * 0.6 + safe(t.content_gap_count) * 0.4));
  const recoveryComplexity = clamp(Math.round(safe(t.recovery_difficulty_avg) * 0.7 + fragmentationScore * 0.3));

  return {
    score, verdict, executionCapacity, editorialVelocity, semanticVelocity,
    authorityVelocity, recoveryCapacity, riskPressure, fragmentationScore,
    operationalDebt, executionLoad, recoveryComplexity,
    blockers, strengths, recommendations,
  };
}

// Fase 13.3 — extensões sistêmicas
import type { TelemetrySnapshot as _T } from "./seoTelemetry";

const _v = (x?: number) => (typeof x === "number" && isFinite(x) ? x : 0);
const _c = (n: number) => Math.max(0, Math.min(100, n));

export function calculateSystemSustainability(t: _T): number {
  return _c(Math.round(
    _v(t.strategic_consistency_score) * 0.3 +
    _v(t.semantic_balance_score) * 0.2 +
    _v(t.cluster_growth_score) * 0.2 +
    (100 - _v(t.content_decay_score)) * 0.15 +
    (100 - _v(t.regression_risk_score)) * 0.15
  ));
}

export function estimateOperationalCollapseRisk(t: _T): number {
  return _c(Math.round(
    _v(t.regression_risk_score) * 0.35 +
    _v(t.authority_dependency_risk) * 0.25 +
    _v(t.fragile_cluster_count) * 4 +
    _v(t.volatility_score) * 0.2
  ));
}

export function estimateMaintenanceExplosionRisk(t: _T): number {
  return _c(Math.round(
    _v(t.content_decay_score) * 0.4 +
    _v(t.thinContent) * 1.5 +
    _v(t.orphan_entities) * 0.8 +
    _v(t.overlinked_pages) * 0.6
  ));
}

export function estimateExecutionDrift(t: _T): number {
  return _c(Math.round(
    (100 - _v(t.strategic_consistency_score)) * 0.5 +
    _v(t.volatility_score) * 0.3 +
    _v(t.fragile_cluster_count) * 4
  ));
}

export function estimateSemanticFatigue(t: _T): number {
  return _c(Math.round(
    _v(t.topic_exhaustion_score) * 0.4 +
    _v(t.saturation_score) * 0.3 +
    (100 - _v(t.cluster_growth_score)) * 0.3
  ));
}
