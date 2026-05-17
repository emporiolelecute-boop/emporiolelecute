/**
 * Phase 15.3 — Signal Compression. Pure helpers.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface SignalGroup {
  label: string;
  signals: number[]; // raw signal values 0..100
  noise?: number;    // 0..100
}

export interface CompressedSignal {
  label: string;
  compressed_value: number;
  redundancy: number;
  loss: number;
  overload: boolean;
}

function compress(g: SignalGroup): CompressedSignal {
  const xs = g.signals.filter((x) => Number.isFinite(x));
  if (xs.length === 0) {
    return { label: g.label, compressed_value: 0, redundancy: 0, loss: 0, overload: false };
  }
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const variance = xs.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / xs.length;
  const stdev = Math.sqrt(variance);
  const redundancy = clamp(100 - stdev * 2.5);
  const loss = clamp(stdev * 1.5 + (g.noise ?? 0) * 0.3);
  const overload = xs.length > 12;
  return {
    label: g.label,
    compressed_value: clamp(mean - (g.noise ?? 0) * 0.2),
    redundancy,
    loss,
    overload,
  };
}

export const compressStrategicSignals = (g: SignalGroup) => compress(g);
export const compressOperationalSignals = (g: SignalGroup) => compress(g);
export const compressSemanticSignals = (g: SignalGroup) => compress(g);
export const compressAuthoritySignals = (g: SignalGroup) => compress(g);

export function calculateCompressionEfficiency(items: CompressedSignal[]): number {
  if (items.length === 0) return 0;
  const r = items.reduce((s, x) => s + x.redundancy, 0) / items.length;
  const l = items.reduce((s, x) => s + x.loss, 0) / items.length;
  return clamp(r - l * 0.5);
}

export function detectCompressionLoss(items: CompressedSignal[]): number {
  if (items.length === 0) return 0;
  return clamp(items.reduce((s, x) => s + x.loss, 0) / items.length);
}

export function detectSignalOverload(items: CompressedSignal[]): string[] {
  return items.filter((x) => x.overload).map((x) => x.label);
}

export function detectSignalRedundancy(items: CompressedSignal[]): number {
  if (items.length === 0) return 0;
  return clamp(items.reduce((s, x) => s + x.redundancy, 0) / items.length);
}
