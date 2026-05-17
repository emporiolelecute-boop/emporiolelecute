/**
 * Phase 16.1 — Nexus Signal Integrity (pure, read-only).
 * Distinct from prior signalIntegrity.ts (Phase 15.8) to avoid collisions.
 */
export type SignalConfidence = "pristine" | "reliable" | "noisy" | "degraded" | "corrupted";

export interface NexusSignalInputs {
  clarity: number;
  reliability: number;
  noise: number;
  dilution: number;
  contradictions: number;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inv = (n: number) => clamp(100 - n);

export function evaluateSignalIntegrity(i: NexusSignalInputs): number {
  return clamp(i.clarity * 0.4 + i.reliability * 0.4 - i.noise * 0.2 - i.contradictions * 0.1);
}

export function detectNoiseAmplification(i: NexusSignalInputs): number {
  return clamp(i.noise * 0.7 + i.dilution * 0.3);
}

export function detectSignalDilution(i: NexusSignalInputs): number {
  return clamp(i.dilution);
}

export function calculateSignalReliability(i: NexusSignalInputs): number {
  return clamp(i.reliability * 0.7 + inv(i.contradictions) * 0.3);
}

export function classifySignalConfidence(i: NexusSignalInputs): SignalConfidence {
  const s = evaluateSignalIntegrity(i);
  if (s >= 85) return "pristine";
  if (s >= 70) return "reliable";
  if (s >= 55) return "noisy";
  if (s >= 40) return "degraded";
  return "corrupted";
}

export function detectContradictorySignals(i: NexusSignalInputs): number {
  return clamp(i.contradictions);
}
