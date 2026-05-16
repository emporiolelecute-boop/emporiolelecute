/**
 * Fase 14.1 — Strategic Digital Twin Engine.
 *
 * Builds a strategic representation of the SEO ecosystem
 * and runs read-only health, stress and recovery simulations.
 */

import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (v: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(v)));

export interface StrategicTwin {
  authority: number;
  semanticCoverage: number;
  connectivity: number;
  sustainability: number;
  resilience: number;
  velocity: number;
  debt: number;
  decay: number;
  fragmentation: number;
  centralization: number;
  intent: number;
}

export function buildStrategicTwin(t: TelemetrySnapshot): StrategicTwin {
  return {
    authority: t.averageAuthority || 0,
    semanticCoverage: t.semantic_coverage_avg || 0,
    connectivity: t.semantic_connectivity_score || 0,
    sustainability: t.sustainability_score || 0,
    resilience: t.resilience_score || 0,
    velocity: t.authority_velocity_score || 0,
    debt: t.operational_debt_score || 0,
    decay: t.content_decay_score || 0,
    fragmentation: t.fragmentation_score || 0,
    centralization: t.overcentralization_risk || 0,
    intent: t.business_intent_score || 0,
  };
}

export function calculateTwinHealth(twin: StrategicTwin): number {
  const positives = (twin.authority + twin.semanticCoverage + twin.connectivity + twin.sustainability + twin.resilience) / 5;
  const negatives = (twin.debt + twin.decay + twin.fragmentation + twin.centralization) / 4;
  return clamp(positives - negatives * 0.5);
}

export interface FragilitySignal {
  signal: string;
  score: number;
}

export function detectTwinFragility(twin: StrategicTwin): FragilitySignal[] {
  const out: FragilitySignal[] = [];
  if (twin.resilience < 50) out.push({ signal: "Baixa resiliência", score: 100 - twin.resilience });
  if (twin.fragmentation > 50) out.push({ signal: "Fragmentação alta", score: twin.fragmentation });
  if (twin.centralization > 60) out.push({ signal: "Centralização excessiva", score: twin.centralization });
  if (twin.decay > 50) out.push({ signal: "Decay acentuado", score: twin.decay });
  return out;
}

export interface OverloadSignal {
  signal: string;
  score: number;
}

export function detectTwinOverload(twin: StrategicTwin): OverloadSignal[] {
  const out: OverloadSignal[] = [];
  if (twin.debt > 60) out.push({ signal: "Debt operacional alto", score: twin.debt });
  if (twin.velocity < 30 && twin.debt > 40) out.push({ signal: "Velocidade insuficiente vs debt", score: clamp(twin.debt - twin.velocity) });
  if (twin.decay > 55) out.push({ signal: "Decay acima do recovery", score: twin.decay });
  return out;
}

export interface TwinStressResult {
  stressScore: number;
  surviving: boolean;
  weakestVector: string;
  projectedDamage: number;
}

export function simulateTwinStress(twin: StrategicTwin, intensity = 50): TwinStressResult {
  const i = Math.max(0, Math.min(100, intensity)) / 100;
  const damage = (twin.debt + twin.decay + twin.fragmentation) / 3 * i;
  const buffer = (twin.resilience + twin.sustainability) / 2;
  const stressScore = clamp(damage - buffer * 0.4);
  const weakest = [
    { k: "Resiliência", v: 100 - twin.resilience },
    { k: "Sustentabilidade", v: 100 - twin.sustainability },
    { k: "Conectividade", v: 100 - twin.connectivity },
    { k: "Autoridade", v: 100 - twin.authority },
  ].sort((a, b) => b.v - a.v)[0];
  return {
    stressScore,
    surviving: stressScore < 65,
    weakestVector: weakest.k,
    projectedDamage: clamp(damage),
  };
}

export interface TwinRecoveryEstimate {
  recoveryWeeks: number;
  recoveryScore: number;
  bottleneck: string;
}

export function estimateTwinRecovery(twin: StrategicTwin): TwinRecoveryEstimate {
  const debt = twin.debt;
  const velocity = Math.max(5, twin.velocity);
  const weeks = Math.round((debt / velocity) * 4);
  const bottleneck =
    twin.velocity < 30 ? "Velocidade operacional" :
    twin.debt > 60 ? "Debt acumulado" :
    twin.decay > 55 ? "Decay de conteúdo" :
    "Capacidade editorial";
  return {
    recoveryWeeks: Math.min(104, Math.max(1, weeks)),
    recoveryScore: clamp(100 - debt + velocity / 2),
    bottleneck,
  };
}

export interface TwinLongevity {
  longevityWeeks: number;
  longevityScore: number;
  outlook: "short" | "medium" | "long" | "perennial";
}

export function calculateTwinLongevity(twin: StrategicTwin): TwinLongevity {
  const score = clamp(
    twin.sustainability * 0.4 + twin.resilience * 0.3 + twin.semanticCoverage * 0.2 + (100 - twin.decay) * 0.1,
  );
  const weeks = Math.round(score * 1.5);
  let outlook: TwinLongevity["outlook"] = "short";
  if (score >= 80) outlook = "perennial";
  else if (score >= 60) outlook = "long";
  else if (score >= 40) outlook = "medium";
  return { longevityWeeks: weeks, longevityScore: score, outlook };
}
