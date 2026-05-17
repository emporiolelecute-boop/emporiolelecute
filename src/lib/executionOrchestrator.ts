/**
 * Phase 18 — Execution Orchestration Engine (pure, read-only).
 * Turns canon + decision outputs into queues, cadence and sustainability metrics.
 */
import type { CanonMetric, CoreMetricsCanon } from "./coreMetricsCanon";
import { buildExecutivePriorityQueue, calculateCompoundingPotential, estimateStrategicLeverage } from "./executiveDecisionEngine";

export type ExecutionClass =
  | "EXECUTE_NOW"
  | "HIGH_LEVERAGE"
  | "COMPOUNDING"
  | "MAINTENANCE"
  | "RECOVERY"
  | "DEFER"
  | "SUPPRESS"
  | "IGNORE";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface ExecutionItem {
  metric: string;
  origin: string;
  classification: ExecutionClass;
  leverage: number;
  compounding: number;
  pressure: number;     // urgency/maintenance load
  rationale: string;
}

function pressureFor(m: CanonMetric): number {
  return clamp(m.redundancy * 0.4 + (100 - m.usage) * 0.3 + (100 - m.executiveImpact) * 0.3);
}

function classify(m: CanonMetric, leverage: number, compounding: number, pressure: number): ExecutionClass {
  if (m.category === "DEPRECATED") return "IGNORE";
  if (m.category === "REDUNDANT" && m.executiveImpact < 55) return "SUPPRESS";
  if (compounding >= 78 && m.executiveImpact >= 72) return "COMPOUNDING";
  if (leverage >= 78 && pressure <= 45) return "EXECUTE_NOW";
  if (leverage >= 65) return "HIGH_LEVERAGE";
  if (pressure >= 70) return "RECOVERY";
  if (m.weight < 55 && m.executiveImpact < 55) return "DEFER";
  return "MAINTENANCE";
}

function items(canon: CoreMetricsCanon): ExecutionItem[] {
  return canon.metrics.map((m) => {
    const leverage = estimateStrategicLeverage(m);
    const compounding = calculateCompoundingPotential(m);
    const pressure = pressureFor(m);
    const classification = classify(m, leverage, compounding, pressure);
    return {
      metric: m.name, origin: m.origin, classification, leverage, compounding, pressure,
      rationale: `${classification} — lev ${leverage}, comp ${compounding}, press ${pressure}`,
    };
  });
}

export interface ExecutionCycle { label: string; items: ExecutionItem[] }
export function buildExecutionCycles(canon: CoreMetricsCanon): ExecutionCycle[] {
  const all = items(canon);
  return [
    { label: "Now (0–7d)", items: all.filter((i) => i.classification === "EXECUTE_NOW" || i.classification === "HIGH_LEVERAGE") },
    { label: "Next (7–30d)", items: all.filter((i) => i.classification === "COMPOUNDING") },
    { label: "Sustain (continuous)", items: all.filter((i) => i.classification === "MAINTENANCE") },
    { label: "Recover", items: all.filter((i) => i.classification === "RECOVERY") },
    { label: "Defer / Suppress", items: all.filter((i) => i.classification === "DEFER" || i.classification === "SUPPRESS" || i.classification === "IGNORE") },
  ];
}

export interface StrategicExecutionQueue { ordered: ExecutionItem[]; by_class: Record<ExecutionClass, number> }
export function buildStrategicExecutionQueue(canon: CoreMetricsCanon): StrategicExecutionQueue {
  const all = items(canon);
  const order: Record<ExecutionClass, number> = {
    EXECUTE_NOW: 0, HIGH_LEVERAGE: 1, COMPOUNDING: 2, MAINTENANCE: 3,
    RECOVERY: 4, DEFER: 5, SUPPRESS: 6, IGNORE: 7,
  };
  const ordered = [...all].sort((a, b) => order[a.classification] - order[b.classification] || b.leverage - a.leverage);
  const by_class = all.reduce((acc, i) => {
    acc[i.classification] = (acc[i.classification] ?? 0) + 1;
    return acc;
  }, {} as Record<ExecutionClass, number>);
  (Object.keys(order) as ExecutionClass[]).forEach((k) => { if (!(k in by_class)) by_class[k] = 0; });
  return { ordered, by_class };
}

export interface OperationalCadence {
  pace: number;          // 0..100 sustainable pace score
  active_threads: number;
  max_recommended: number;
  cadence_label: "BALANCED" | "STRETCHED" | "OVERLOADED" | "UNDERUTILIZED";
}

export function buildOperationalCadence(canon: CoreMetricsCanon): OperationalCadence {
  const queue = buildStrategicExecutionQueue(canon);
  const active = queue.by_class.EXECUTE_NOW + queue.by_class.HIGH_LEVERAGE;
  const max_recommended = 6;
  let label: OperationalCadence["cadence_label"] = "BALANCED";
  if (active > max_recommended * 1.5) label = "OVERLOADED";
  else if (active > max_recommended) label = "STRETCHED";
  else if (active < Math.ceil(max_recommended / 3)) label = "UNDERUTILIZED";
  const pace = clamp(100 - Math.max(0, active - max_recommended) * 12);
  return { pace, active_threads: active, max_recommended, cadence_label: label };
}

export function buildRecoverySequence(canon: CoreMetricsCanon): ExecutionItem[] {
  return items(canon).filter((i) => i.classification === "RECOVERY").sort((a, b) => b.pressure - a.pressure);
}

export function buildCompoundingSequence(canon: CoreMetricsCanon): ExecutionItem[] {
  return items(canon).filter((i) => i.classification === "COMPOUNDING").sort((a, b) => b.compounding - a.compounding);
}

export function detectExecutionOverload(canon: CoreMetricsCanon): { score: number; overloaded: boolean } {
  const cadence = buildOperationalCadence(canon);
  const ratio = cadence.active_threads / Math.max(cadence.max_recommended, 1);
  const score = clamp(Math.max(0, ratio - 1) * 80);
  return { score, overloaded: cadence.cadence_label === "OVERLOADED" || cadence.cadence_label === "STRETCHED" };
}

export function detectStrategicThrashing(canon: CoreMetricsCanon): number {
  // Thrashing rises when many low-leverage items sit in active queues.
  const all = items(canon);
  const active = all.filter((i) => i.classification === "EXECUTE_NOW" || i.classification === "HIGH_LEVERAGE");
  if (!active.length) return 0;
  const lowLev = active.filter((i) => i.leverage < 60).length;
  return clamp((lowLev / active.length) * 100);
}

export function estimateOperationalDrag(canon: CoreMetricsCanon): number {
  const all = items(canon);
  const drag = all.filter((i) => i.classification === "RECOVERY" || i.classification === "MAINTENANCE").length;
  return clamp((drag / Math.max(all.length, 1)) * 100);
}

export function calculateExecutionSustainability(canon: CoreMetricsCanon): number {
  const overload = detectExecutionOverload(canon).score;
  const thrash = detectStrategicThrashing(canon);
  const drag = estimateOperationalDrag(canon);
  const queue = buildExecutivePriorityQueue(canon);
  return clamp(queue.decision_confidence * 0.5 + (100 - overload) * 0.2 + (100 - thrash) * 0.2 + (100 - drag) * 0.1);
}
