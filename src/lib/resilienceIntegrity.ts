/**
 * Phase 16.3 — Resilience Integrity (pure, read-only).
 */
export type ResilienceVerdict = "adaptive" | "resilient" | "stable" | "fragile" | "collapsing";

export interface ResilienceIntegrityInputs {
  adaptiveness: number;
  recovery: number;
  durability: number;
  weakness: number;
  instability: number;
  reserves: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function calculateResilienceIntegrity(i: ResilienceIntegrityInputs): number {
  return clamp(
    i.adaptiveness * 0.3 + i.durability * 0.25 + i.recovery * 0.2 + i.reserves * 0.15 +
    inv(i.weakness) * 0.05 + inv(i.instability) * 0.05
  );
}

export function detectResilienceWeakness(i: ResilienceIntegrityInputs): number {
  return clamp(i.weakness * 0.6 + inv(i.reserves) * 0.4);
}

export function estimateResiliencePersistence(i: ResilienceIntegrityInputs): number {
  return clamp(i.durability * 0.5 + i.reserves * 0.3 + inv(i.weakness) * 0.2);
}

export function detectRecoveryInstability(i: ResilienceIntegrityInputs): number {
  return clamp(i.instability * 0.6 + inv(i.recovery) * 0.4);
}

export function calculateAdaptiveIntegrity(i: ResilienceIntegrityInputs): number {
  return clamp(i.adaptiveness * 0.6 + i.reserves * 0.2 + inv(i.instability) * 0.2);
}

export function classifyResilienceIntegrity(score: number): ResilienceVerdict {
  if (score >= 88) return "adaptive";
  if (score >= 72) return "resilient";
  if (score >= 58) return "stable";
  if (score >= 42) return "fragile";
  return "collapsing";
}

export interface ResilienceIntegrityMap {
  axes: { name: string; value: number }[];
  weakest: string;
  strongest: string;
}

export function buildResilienceIntegrityMap(i: ResilienceIntegrityInputs): ResilienceIntegrityMap {
  const axes = [
    { name: "adaptiveness", value: i.adaptiveness },
    { name: "durability", value: i.durability },
    { name: "recovery", value: i.recovery },
    { name: "reserves", value: i.reserves },
    { name: "stability", value: inv(i.instability) },
    { name: "robustness", value: inv(i.weakness) },
  ];
  const sorted = [...axes].sort((a, b) => b.value - a.value);
  return { axes, strongest: sorted[0].name, weakest: sorted[sorted.length - 1].name };
}
