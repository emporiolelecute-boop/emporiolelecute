/**
 * Fase 13.2 — Strategic Pressure Map (heurístico).
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type PressureSeverity = "low" | "medium" | "high" | "critical";

export interface PressureReport {
  area: "competitive" | "semantic" | "operational" | "editorial" | "authority";
  score: number;
  severity: PressureSeverity;
  affectedAreas: string[];
  mitigation: string[];
}

const v = (x?: number) => (typeof x === "number" ? x : 0);
const clamp = (n: number) => Math.max(0, Math.min(100, n));
const sev = (n: number): PressureSeverity => (n >= 80 ? "critical" : n >= 60 ? "high" : n >= 35 ? "medium" : "low");

export function calculateCompetitivePressure(t: TelemetrySnapshot): number {
  return clamp(Math.round((100 - v(t.averageAuthority)) * 0.5 + v(t.under_monetized_score) * 0.5));
}
export function calculateSemanticPressure(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.fragile_cluster_count) * 3 + v(t.semantic_loop_count) * 2 + (100 - v(t.semantic_balance_score)) * 0.3));
}
export function calculateOperationalPressure(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.regression_risk_score) * 0.5 + v(t.authority_dependency_risk) * 0.3 + v(t.volatility_score) * 0.2));
}
export function calculateEditorialPressure(t: TelemetrySnapshot): number {
  return clamp(Math.round((100 - v(t.editorial_maturity_avg)) * 0.5 + v(t.content_gap_count) * 1.2 + v(t.thinContent) * 1.2));
}
export function calculateAuthorityPressure(t: TelemetrySnapshot): number {
  return clamp(Math.round(v(t.overcentralization_risk) * 0.5 + v(t.authority_dependency_risk) * 0.3 + (100 - v(t.authority_distribution_score)) * 0.2));
}

export function buildPressureMap(t: TelemetrySnapshot): PressureReport[] {
  const items: { area: PressureReport["area"]; score: number }[] = [
    { area: "competitive", score: calculateCompetitivePressure(t) },
    { area: "semantic", score: calculateSemanticPressure(t) },
    { area: "operational", score: calculateOperationalPressure(t) },
    { area: "editorial", score: calculateEditorialPressure(t) },
    { area: "authority", score: calculateAuthorityPressure(t) },
  ];
  return items.map(({ area, score }) => ({
    area,
    score,
    severity: sev(score),
    affectedAreas: areaImpact(area),
    mitigation: mitigationFor(area),
  }));
}

function areaImpact(area: PressureReport["area"]): string[] {
  switch (area) {
    case "competitive": return ["SERP", "Tráfego orgânico"];
    case "semantic": return ["Clusters", "Linking interno"];
    case "operational": return ["Cadência", "Recuperação"];
    case "editorial": return ["Conteúdo", "Profundidade"];
    case "authority": return ["Hubs", "Topical authority"];
  }
}
function mitigationFor(area: PressureReport["area"]): string[] {
  switch (area) {
    case "competitive": return ["Reforçar páginas de alta intenção", "Capturar oportunidades comerciais"];
    case "semantic": return ["Consolidar clusters frágeis", "Quebrar loops semânticos"];
    case "operational": return ["Reduzir débito operacional", "Capturar snapshots regulares"];
    case "editorial": return ["Expandir conteúdo raso", "Cobrir lacunas temáticas"];
    case "authority": return ["Diversificar autoridade", "Reforçar hubs secundários"];
  }
}

// Fase 13.3 — pressões adicionais
const _v2 = (x?: number) => (typeof x === "number" ? x : 0);
const _c2 = (n: number) => Math.max(0, Math.min(100, n));

export function calculateRecoveryPressure(t: TelemetrySnapshot): number {
  return _c2(Math.round(_v2(t.recovery_difficulty_avg) * 0.5 + _v2(t.orphan_entities) * 0.4 + _v2(t.content_decay_score) * 0.3));
}
export function calculateExecutionPressure(t: TelemetrySnapshot): number {
  return _c2(Math.round(_v2(t.fragile_cluster_count) * 5 + _v2(t.regression_risk_score) * 0.3 + (100 - _v2(t.execution_efficiency)) * 0.3));
}
export function calculateMaintenancePressure(t: TelemetrySnapshot): number {
  return _c2(Math.round(_v2(t.content_decay_score) * 0.5 + _v2(t.overlinked_pages) * 0.6 + _v2(t.thinContent) * 0.8));
}
export function calculateEntropyPressure(t: TelemetrySnapshot): number {
  return _c2(Math.round(_v2(t.authority_entropy) * 0.6 + _v2(t.semantic_loop_count) * 4 + (100 - _v2(t.semantic_balance_score)) * 0.3));
}
export function calculateStrategicFatigue(t: TelemetrySnapshot): number {
  return _c2(Math.round(_v2(t.topic_exhaustion_score) * 0.4 + _v2(t.volatility_score) * 0.3 + (100 - _v2(t.strategic_consistency_score)) * 0.3));
}
