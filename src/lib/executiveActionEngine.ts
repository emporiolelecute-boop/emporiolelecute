/**
 * Phase 18 — Executive Action Engine (pure, read-only).
 */
import type { CoreMetricsCanon } from "./coreMetricsCanon";
import {
  buildStrategicExecutionQueue, buildCompoundingSequence, buildRecoverySequence,
  calculateExecutionSustainability, type ExecutionItem,
} from "./executionOrchestrator";
import {
  buildSustainableCadence, detectStrategicFatigue,
} from "./strategicPacing";
import {
  calculateExecutionLeverage, detectExecutionWaste,
  estimateLongTermStrategicValue,
} from "./executionLeverage";
import { calculateOperationalHarmony, buildFocusWindows } from "./operationalRhythm";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function buildTopExecutiveActions(canon: CoreMetricsCanon, limit = 8): ExecutionItem[] {
  return buildStrategicExecutionQueue(canon).ordered
    .filter((i) => i.classification === "EXECUTE_NOW" || i.classification === "HIGH_LEVERAGE")
    .slice(0, limit);
}

export function buildTopSuppressions(canon: CoreMetricsCanon, limit = 8): ExecutionItem[] {
  return buildStrategicExecutionQueue(canon).ordered
    .filter((i) => i.classification === "SUPPRESS" || i.classification === "IGNORE" || i.classification === "DEFER")
    .slice(0, limit);
}

export interface FocusMap { now: string[]; compounding: string[]; suppress: string[]; recover: string[] }

export function buildStrategicFocusMap(canon: CoreMetricsCanon): FocusMap {
  return {
    now: buildTopExecutiveActions(canon, 5).map((i) => i.metric),
    compounding: buildCompoundingSequence(canon).slice(0, 5).map((i) => i.metric),
    suppress: buildTopSuppressions(canon, 5).map((i) => i.metric),
    recover: buildRecoverySequence(canon).slice(0, 5).map((i) => i.metric),
  };
}

export function buildExecutionNarrative(canon: CoreMetricsCanon): string[] {
  const sustainability = calculateExecutionSustainability(canon);
  const fatigue = detectStrategicFatigue(canon);
  const harmony = calculateOperationalHarmony(canon);
  const value = estimateLongTermStrategicValue(canon);
  const cad = buildSustainableCadence(canon);
  return [
    `Sustainability ${sustainability}/100 with operational harmony ${harmony}/100.`,
    `Strategic fatigue ${fatigue}/100 — cadence label '${cad.cadence_label}'.`,
    `Long-term strategic value ${value}/100, leverage ${calculateExecutionLeverage(canon)}/100.`,
    `Recommended focus threads: ${cad.recommended_focus_threads}; recovery blocks: ${cad.recommended_recovery_blocks}.`,
  ];
}

export interface OperationalSummary {
  sustainability: number;
  harmony: number;
  leverage: number;
  fatigue: number;
  long_term_value: number;
  waste_count: number;
  active_threads: number;
}

export function buildOperationalSummary(canon: CoreMetricsCanon): OperationalSummary {
  const queue = buildStrategicExecutionQueue(canon);
  return {
    sustainability: calculateExecutionSustainability(canon),
    harmony: calculateOperationalHarmony(canon),
    leverage: calculateExecutionLeverage(canon),
    fatigue: detectStrategicFatigue(canon),
    long_term_value: estimateLongTermStrategicValue(canon),
    waste_count: detectExecutionWaste(canon).length,
    active_threads: queue.by_class.EXECUTE_NOW + queue.by_class.HIGH_LEVERAGE,
  };
}

export interface WeeklyExecutionMap {
  week: string;
  focus: string[];
  maintenance: string[];
  recovery_blocks: number;
  load: number;
}

export function buildWeeklyExecutionMap(canon: CoreMetricsCanon): WeeklyExecutionMap[] {
  const windows = buildFocusWindows(canon);
  const cad = buildSustainableCadence(canon);
  const queue = buildStrategicExecutionQueue(canon);
  const maintenance = queue.ordered.filter((i) => i.classification === "MAINTENANCE").slice(0, 3).map((i) => i.metric);
  return ["W1", "W2", "W3", "W4"].map((w, idx) => ({
    week: w,
    focus: windows[idx % windows.length]?.recommended_themes ?? [],
    maintenance,
    recovery_blocks: cad.recommended_recovery_blocks,
    load: clamp(cad.pace - idx * 3),
  }));
}
