/**
 * Fase 15.9 — Authority Continuity (pure helpers).
 */
const clamp = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
const avg = (xs: number[]): number =>
  xs.length === 0 ? 0 : clamp(xs.reduce((a, b) => a + b, 0) / xs.length);
const inv = (n: number): number => clamp(100 - n);

export interface AuthorityContinuityInputs {
  authority: number;
  longevity: number;
  persistence: number;
  decay: number;
  fragmentation: number;
  instability: number;
}

export function calculateAuthorityContinuity(i: AuthorityContinuityInputs): number {
  return avg([i.authority, i.persistence, i.longevity, inv(i.decay), inv(i.fragmentation)]);
}
export function detectAuthorityDecay(i: AuthorityContinuityInputs): string[] {
  const out: string[] = [];
  if (i.decay > 50) out.push("Decaimento de autoridade detectado");
  if (i.fragmentation > 50) out.push("Fragmentação de autoridade ativa");
  return out;
}
export function estimateAuthorityLongevity(i: AuthorityContinuityInputs): number {
  return avg([i.longevity, i.authority, inv(i.decay)]);
}
export function estimateAuthorityPersistence(i: AuthorityContinuityInputs): number {
  return avg([i.persistence, i.authority, inv(i.instability)]);
}
export function detectAuthorityInstability(i: AuthorityContinuityInputs): string[] {
  const out: string[] = [];
  if (i.instability > 45) out.push("Instabilidade de autoridade recorrente");
  if (i.fragmentation > 45 && i.authority < 60) out.push("Erosão da base de autoridade");
  return out;
}
