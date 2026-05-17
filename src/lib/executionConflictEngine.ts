/**
 * Phase 18 — Execution Conflict Engine (pure, read-only).
 */
import type { CoreMetricsCanon } from "./coreMetricsCanon";
import { buildStrategicExecutionQueue, type ExecutionItem } from "./executionOrchestrator";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface PriorityConflict { a: string; b: string; reason: string }

export function detectPriorityConflicts(canon: CoreMetricsCanon): PriorityConflict[] {
  const queue = buildStrategicExecutionQueue(canon);
  const top = queue.ordered.filter((i) => i.classification === "EXECUTE_NOW" || i.classification === "HIGH_LEVERAGE");
  const out: PriorityConflict[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      if (top[i].origin === top[j].origin) {
        out.push({ a: top[i].metric, b: top[j].metric, reason: `Both target engine '${top[i].origin}'` });
      }
    }
  }
  return out.slice(0, 30);
}

export interface ResourceConflict { origin: string; load: number; items: string[] }

export function detectResourceConflicts(canon: CoreMetricsCanon): ResourceConflict[] {
  const queue = buildStrategicExecutionQueue(canon);
  const map = new Map<string, ExecutionItem[]>();
  queue.ordered
    .filter((i) => i.classification === "EXECUTE_NOW" || i.classification === "HIGH_LEVERAGE" || i.classification === "COMPOUNDING")
    .forEach((i) => {
      const arr = map.get(i.origin) ?? [];
      arr.push(i);
      map.set(i.origin, arr);
    });
  return [...map.entries()]
    .filter(([, arr]) => arr.length >= 2)
    .map(([origin, arr]) => ({ origin, load: clamp(arr.length * 25), items: arr.map((x) => x.metric) }))
    .sort((a, b) => b.load - a.load);
}

export function detectStrategicCollision(canon: CoreMetricsCanon): number {
  const conflicts = detectPriorityConflicts(canon).length;
  return clamp(conflicts * 6);
}

export function detectQueueCannibalization(canon: CoreMetricsCanon): number {
  const queue = buildStrategicExecutionQueue(canon);
  const active = queue.by_class.EXECUTE_NOW + queue.by_class.HIGH_LEVERAGE;
  const compounding = queue.by_class.COMPOUNDING;
  if (compounding === 0) return clamp(active * 6);
  const ratio = active / compounding;
  return clamp(Math.max(0, ratio - 2) * 25);
}

export interface ConflictResolution { conflict: string; suggestion: string }

export function buildConflictResolutionSuggestions(canon: CoreMetricsCanon): ConflictResolution[] {
  const out: ConflictResolution[] = [];
  detectPriorityConflicts(canon).forEach((c) => {
    out.push({ conflict: `${c.a} ↔ ${c.b}`, suggestion: `Sequence (not parallelize). Promote one to active, defer the other one cycle.` });
  });
  detectResourceConflicts(canon).forEach((r) => {
    if (r.load >= 50) {
      out.push({ conflict: `Engine ${r.origin} overloaded (${r.items.length} items)`, suggestion: `Cap concurrent work on '${r.origin}' to 1–2 items.` });
    }
  });
  return out.slice(0, 30);
}
