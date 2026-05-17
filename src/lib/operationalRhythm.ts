/**
 * Phase 18 — Operational Rhythm Engine (pure, read-only).
 */
import type { CoreMetricsCanon } from "./coreMetricsCanon";
import {
  buildOperationalCadence, buildStrategicExecutionQueue,
  detectStrategicThrashing, estimateOperationalDrag,
} from "./executionOrchestrator";
import { detectStrategicFatigue } from "./strategicPacing";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface RhythmPoint { label: string; load: number; recovery: number }

export function buildExecutionRhythm(canon: CoreMetricsCanon): RhythmPoint[] {
  const cad = buildOperationalCadence(canon);
  const drag = estimateOperationalDrag(canon);
  const base = cad.pace;
  return [
    { label: "W1", load: clamp(base - drag * 0.1), recovery: clamp(100 - drag) },
    { label: "W2", load: clamp(base - drag * 0.15), recovery: clamp(100 - drag * 0.9) },
    { label: "W3", load: clamp(base - drag * 0.2), recovery: clamp(100 - drag * 0.8) },
    { label: "W4", load: clamp(base - drag * 0.1), recovery: clamp(100 - drag * 0.7) },
  ];
}

export function detectRhythmInstability(canon: CoreMetricsCanon): number {
  const points = buildExecutionRhythm(canon);
  const loads = points.map((p) => p.load);
  const max = Math.max(...loads), min = Math.min(...loads);
  return clamp((max - min) * 2);
}

export function detectStrategicChaos(canon: CoreMetricsCanon): number {
  const thrash = detectStrategicThrashing(canon);
  const instability = detectRhythmInstability(canon);
  return clamp(thrash * 0.6 + instability * 0.4);
}

export function calculateOperationalHarmony(canon: CoreMetricsCanon): number {
  const chaos = detectStrategicChaos(canon);
  const fatigue = detectStrategicFatigue(canon);
  return clamp(100 - (chaos * 0.6 + fatigue * 0.4));
}

export function estimateRecoveryIntervals(canon: CoreMetricsCanon): { interval_days: number; blocks_per_month: number } {
  const fatigue = detectStrategicFatigue(canon);
  if (fatigue >= 70) return { interval_days: 5, blocks_per_month: 4 };
  if (fatigue >= 45) return { interval_days: 10, blocks_per_month: 3 };
  return { interval_days: 14, blocks_per_month: 2 };
}

export interface FocusWindow { label: string; focus_score: number; recommended_themes: string[] }

export function buildFocusWindows(canon: CoreMetricsCanon): FocusWindow[] {
  const queue = buildStrategicExecutionQueue(canon);
  const top = queue.ordered.slice(0, 12);
  const themes = (kind: string) => top.filter((t) => t.classification === kind).map((t) => t.metric).slice(0, 3);
  const cad = buildOperationalCadence(canon);
  const base = cad.pace;
  return [
    { label: "Focus block A", focus_score: clamp(base), recommended_themes: themes("EXECUTE_NOW") },
    { label: "Focus block B", focus_score: clamp(base - 5), recommended_themes: themes("HIGH_LEVERAGE") },
    { label: "Compounding window", focus_score: clamp(base - 8), recommended_themes: themes("COMPOUNDING") },
  ];
}
