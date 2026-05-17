/**
 * Phase 15.4 — Strategic Self-Awareness.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (...xs: number[]) => {
  const v = xs.filter((x) => Number.isFinite(x));
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
};

export interface SelfAwarenessInputs {
  observability: number;
  explainability: number;
  consensus: number;
  decisionConfidence: number;
  contradictionPressure: number;
  conflictDensity: number;
  blindspots: number; // 0..100
  monitoringGaps: number; // 0..100
}

export function calculateSelfAwareness(i: SelfAwarenessInputs): number {
  return clamp(
    i.observability * 0.35 + i.explainability * 0.35 + i.consensus * 0.3 -
      i.blindspots * 0.3 - i.monitoringGaps * 0.2,
  );
}

export function detectBlindStrategicZones(i: SelfAwarenessInputs): string[] {
  const out: string[] = [];
  if (i.observability < 50) out.push("observability");
  if (i.explainability < 50) out.push("explainability");
  if (i.consensus < 50) out.push("consensus");
  if (i.blindspots >= 50) out.push("monitoring blindspots");
  return out;
}

export function detectOverconfidencePatterns(i: SelfAwarenessInputs): number {
  return clamp(Math.max(0, i.decisionConfidence - avg(i.observability, i.explainability)));
}

export function detectFalseConfidence(i: SelfAwarenessInputs): number {
  return clamp(
    Math.max(0, i.decisionConfidence - i.consensus) * 0.6 +
      i.contradictionPressure * 0.4,
  );
}

export function detectSelfConflict(i: SelfAwarenessInputs): number {
  return clamp(i.conflictDensity * 0.6 + i.contradictionPressure * 0.4);
}

export function calculateStrategicReflectionDepth(i: SelfAwarenessInputs): number {
  return clamp(i.observability * 0.5 + i.explainability * 0.5);
}

export function calculateStrategicHumility(i: SelfAwarenessInputs): number {
  return clamp(100 - detectOverconfidencePatterns(i));
}
