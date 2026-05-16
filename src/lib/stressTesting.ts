/**
 * Fase 14 — Stress Testing Engine.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

export type StressLevel = "stable" | "pressured" | "fragile" | "unstable" | "critical";

export interface StressResult {
  scenario: string;
  level: StressLevel;
  impactScore: number;     // 0..100 (quanto a saúde geral cai)
  resilienceLoss: number;  // 0..100
  recoveryWeeks: number;
  notes: string[];
}

const v = (x?: number) => (typeof x === "number" ? x : 0);
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

function classify(impact: number): StressLevel {
  if (impact < 20) return "stable";
  if (impact < 40) return "pressured";
  if (impact < 60) return "fragile";
  if (impact < 80) return "unstable";
  return "critical";
}

function build(scenario: string, impact: number, resilienceLoss: number, weeks: number, notes: string[]): StressResult {
  const i = clamp(impact);
  return {
    scenario,
    level: classify(i),
    impactScore: i,
    resilienceLoss: clamp(resilienceLoss),
    recoveryWeeks: Math.max(1, Math.round(weeks)),
    notes,
  };
}

export function simulateClusterFailure(t: TelemetrySnapshot): StressResult {
  const impact = v(t.fragile_cluster_count) * 10 + v(t.cluster_dependency_score) * 0.4;
  return build(
    "Falha de cluster crítico",
    impact,
    impact * 0.6,
    impact * 0.15 + 4,
    ["Hub dependente sobrecarregado", "Perda parcial de cobertura semântica"],
  );
}

export function simulateAuthorityLoss(t: TelemetrySnapshot, lossPct = 30): StressResult {
  const dependency = v(t.authority_dependency_risk);
  const impact = lossPct * (0.5 + dependency / 200);
  return build(
    `Perda de ${lossPct}% de autoridade`,
    impact,
    impact * 0.8,
    impact * 0.2 + 5,
    ["Queda de ranking em entidades centrais", "Redistribuição emergencial necessária"],
  );
}

export function simulateEditorialDrop(t: TelemetrySnapshot): StressResult {
  const impact = (100 - v(t.editorial_velocity_score)) * 0.5 + v(t.editorial_maturity_avg) * 0.1;
  return build(
    "Queda de produção editorial",
    impact,
    impact * 0.4,
    impact * 0.1 + 3,
    ["Backlog editorial acumula", "Topical coverage estagna"],
  );
}

export function simulateLinkBreakdown(t: TelemetrySnapshot): StressResult {
  const impact = v(t.orphan_entities) * 1.5 + (100 - v(t.semantic_connectivity_score)) * 0.5;
  return build(
    "Quebra de linking interno",
    impact,
    impact * 0.5,
    impact * 0.12 + 2,
    ["Aumento de entidades órfãs", "Authority flow comprometido"],
  );
}

export function simulateContentDecayAcceleration(t: TelemetrySnapshot): StressResult {
  const impact = v(t.content_decay_score) * 1.2 + (100 - v(t.editorial_maturity_avg)) * 0.3;
  return build(
    "Aceleração de decaimento de conteúdo",
    impact,
    impact * 0.6,
    impact * 0.18 + 4,
    ["Conteúdos antigos perdem relevância", "Refresh editorial urgente"],
  );
}

export function simulateOperationalOverload(t: TelemetrySnapshot): StressResult {
  const impact = v(t.maintenance_pressure_score) * 0.8 + v(t.bottleneck_score) * 0.4;
  return build(
    "Sobrecarga operacional",
    impact,
    impact * 0.5,
    impact * 0.15 + 3,
    ["Capacidade de execução saturada", "Risco de burnout editorial"],
  );
}

export function runStressTest(t: TelemetrySnapshot): StressResult[] {
  return [
    simulateClusterFailure(t),
    simulateAuthorityLoss(t),
    simulateEditorialDrop(t),
    simulateLinkBreakdown(t),
    simulateContentDecayAcceleration(t),
    simulateOperationalOverload(t),
  ];
}
