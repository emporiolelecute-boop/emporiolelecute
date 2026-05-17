/**
 * Fase 15.6 — Systemic Integrity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface IntegrityInputs {
  structuralCohesion: number;
  semanticIntegrity: number;
  authorityBalance: number;
  executionAlignment: number;
  fragmentation: number;
  drift: number;
  conflicts: number;
}

export interface IntegrityBreach { area: string; severity: number; reason: string }

export function calculateStructuralIntegrity(i: IntegrityInputs): number {
  return avg([i.structuralCohesion, inv(i.fragmentation), inv(i.conflicts)]);
}
export function calculateSemanticIntegrity(i: IntegrityInputs): number {
  return avg([i.semanticIntegrity, inv(i.drift)]);
}
export function calculateExecutionIntegrity(i: IntegrityInputs): number {
  return avg([i.executionAlignment, inv(i.fragmentation), inv(i.drift)]);
}
export function calculateAuthorityIntegrity(i: IntegrityInputs): number {
  return avg([i.authorityBalance, inv(i.conflicts)]);
}
export function detectIntegrityBreaches(i: IntegrityInputs): IntegrityBreach[] {
  const r: IntegrityBreach[] = [];
  if (i.fragmentation > 45) r.push({ area: "structural", severity: clamp(i.fragmentation), reason: "fragmentacao_alta" });
  if (i.drift > 45) r.push({ area: "semantic", severity: clamp(i.drift), reason: "drift_alto" });
  if (i.conflicts > 40) r.push({ area: "authority", severity: clamp(i.conflicts), reason: "conflitos_persistentes" });
  return r;
}
export function estimateIntegrityRecoveryDifficulty(b: IntegrityBreach[]): number {
  if (!b.length) return 0;
  return clamp(b.reduce((s, x) => s + x.severity, 0) / b.length);
}
