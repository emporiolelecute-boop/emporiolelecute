/**
 * Phase 17 — Executive Decision Engine (pure, read-only).
 */
import type { CanonMetric, CoreMetricsCanon } from "./coreMetricsCanon";

export type LeverageClass =
  | "COMPOUNDING"
  | "HIGH_LEVERAGE"
  | "MAINTENANCE"
  | "LOW_VALUE"
  | "WASTE"
  | "VANITY"
  | "STRATEGIC_RISK";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface DecisionItem {
  metric: string;
  classification: LeverageClass;
  leverage: number;        // 0..100
  compounding: number;     // 0..100
  rationale: string;
}

export function estimateStrategicLeverage(m: CanonMetric): number {
  return clamp(m.weight * 0.4 + m.executiveImpact * 0.4 + m.usage * 0.2 - m.redundancy * 0.25);
}

export function calculateCompoundingPotential(m: CanonMetric): number {
  if (m.category === "REDUNDANT" || m.category === "DEPRECATED") return 0;
  const domainDepth = m.domains.length;
  return clamp(m.weight * 0.35 + m.executiveImpact * 0.35 + domainDepth * 8 - m.redundancy * 0.2);
}

function classify(m: CanonMetric, leverage: number, compounding: number): LeverageClass {
  if (m.category === "DEPRECATED") return "WASTE";
  if (m.category === "REDUNDANT" && m.executiveImpact < 55) return "VANITY";
  if (compounding >= 75 && m.executiveImpact >= 70) return "COMPOUNDING";
  if (leverage >= 70) return "HIGH_LEVERAGE";
  if (m.weight < 55 && m.executiveImpact < 55 && m.usage < 35) return "LOW_VALUE";
  if (m.redundancy >= 70 && m.usage < 40) return "VANITY";
  if (m.category === "EXPERIMENTAL" && m.redundancy >= 60) return "STRATEGIC_RISK";
  return "MAINTENANCE";
}

export function detectVanitySeoPatterns(canon: CoreMetricsCanon): string[] {
  return canon.metrics
    .filter((m) => m.redundancy >= 60 && m.executiveImpact < 55)
    .map((m) => m.name);
}

export function detectLowLeverageWork(canon: CoreMetricsCanon): string[] {
  return canon.metrics
    .filter((m) => m.weight < 55 && m.usage < 35)
    .map((m) => m.name);
}

export function detectOperationalWasteChains(canon: CoreMetricsCanon): { chain: string[]; reason: string }[] {
  const chains: { chain: string[]; reason: string }[] = [];
  canon.metrics.forEach((m) => {
    if (m.dependencies.length >= 2 && m.executiveImpact < 55) {
      chains.push({ chain: [...m.dependencies, m.name], reason: "Multi-source derivation with low executive value" });
    }
  });
  return chains;
}

export interface ExecutivePriorityQueue {
  priority: DecisionItem[];
  suppression: DecisionItem[];
  by_class: Record<LeverageClass, number>;
  decision_confidence: number;
}

function buildItems(canon: CoreMetricsCanon): DecisionItem[] {
  return canon.metrics.map((m) => {
    const leverage = estimateStrategicLeverage(m);
    const compounding = calculateCompoundingPotential(m);
    const classification = classify(m, leverage, compounding);
    const rationale = `${classification} — weight ${m.weight}, impact ${m.executiveImpact}, redundancy ${m.redundancy}`;
    return { metric: m.name, classification, leverage, compounding, rationale };
  });
}

export function buildExecutivePriorityQueue(canon: CoreMetricsCanon): ExecutivePriorityQueue {
  const items = buildItems(canon);
  const priority = items
    .filter((i) => i.classification === "COMPOUNDING" || i.classification === "HIGH_LEVERAGE")
    .sort((a, b) => b.leverage - a.leverage);
  const suppression = items
    .filter((i) => i.classification === "VANITY" || i.classification === "WASTE" || i.classification === "LOW_VALUE")
    .sort((a, b) => a.leverage - b.leverage);
  const by_class = items.reduce((acc, i) => {
    acc[i.classification] = (acc[i.classification] ?? 0) + 1;
    return acc;
  }, {} as Record<LeverageClass, number>);
  (["COMPOUNDING","HIGH_LEVERAGE","MAINTENANCE","LOW_VALUE","WASTE","VANITY","STRATEGIC_RISK"] as LeverageClass[])
    .forEach((k) => { if (!(k in by_class)) by_class[k] = 0; });

  const total = items.length || 1;
  const decision_confidence = clamp(((by_class.COMPOUNDING + by_class.HIGH_LEVERAGE) / total) * 100);

  return { priority, suppression, by_class, decision_confidence };
}

export function buildSuppressionQueue(canon: CoreMetricsCanon): DecisionItem[] {
  return buildExecutivePriorityQueue(canon).suppression;
}
