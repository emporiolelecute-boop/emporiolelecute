/**
 * Phase 18 — Strategic Pacing Engine (pure, read-only).
 */
import type { CoreMetricsCanon } from "./coreMetricsCanon";
import {
  buildOperationalCadence, buildStrategicExecutionQueue,
  detectExecutionOverload, estimateOperationalDrag,
} from "./executionOrchestrator";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function calculateExecutionPace(canon: CoreMetricsCanon): number {
  return buildOperationalCadence(canon).pace;
}

export function detectOverextension(canon: CoreMetricsCanon): { score: number; overextended: boolean; active_threads: number } {
  const c = buildOperationalCadence(canon);
  const ratio = c.active_threads / Math.max(c.max_recommended, 1);
  const score = clamp(Math.max(0, ratio - 1) * 100);
  return { score, overextended: ratio > 1, active_threads: c.active_threads };
}

export function detectStrategicFatigue(canon: CoreMetricsCanon): number {
  const overload = detectExecutionOverload(canon).score;
  const drag = estimateOperationalDrag(canon);
  return clamp(overload * 0.6 + drag * 0.4);
}

export function calculateOperationalBreathingRoom(canon: CoreMetricsCanon): number {
  const c = buildOperationalCadence(canon);
  const room = c.max_recommended - c.active_threads;
  return clamp(50 + room * 10);
}

export function estimateExecutionCapacityWindow(canon: CoreMetricsCanon): { window_days: number; safe_capacity: number } {
  const breathing = calculateOperationalBreathingRoom(canon);
  const fatigue = detectStrategicFatigue(canon);
  const window_days = Math.max(3, Math.round(breathing / 8));
  const safe_capacity = clamp(100 - fatigue);
  return { window_days, safe_capacity };
}

export function detectMaintenanceDebtAcceleration(canon: CoreMetricsCanon): number {
  const queue = buildStrategicExecutionQueue(canon);
  const m = queue.by_class.MAINTENANCE + queue.by_class.RECOVERY;
  const total = canon.metrics.length || 1;
  return clamp((m / total) * 100);
}

export interface SustainableCadence {
  pace: number;
  fatigue: number;
  breathing_room: number;
  recommended_focus_threads: number;
  recommended_recovery_blocks: number;
  cadence_label: string;
}

export function buildSustainableCadence(canon: CoreMetricsCanon): SustainableCadence {
  const cad = buildOperationalCadence(canon);
  const fatigue = detectStrategicFatigue(canon);
  const breathing = calculateOperationalBreathingRoom(canon);
  return {
    pace: cad.pace,
    fatigue,
    breathing_room: breathing,
    recommended_focus_threads: Math.max(2, Math.min(cad.max_recommended, cad.active_threads || cad.max_recommended)),
    recommended_recovery_blocks: fatigue >= 60 ? 2 : fatigue >= 35 ? 1 : 0,
    cadence_label: cad.cadence_label,
  };
}
