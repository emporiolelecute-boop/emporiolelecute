// Sprint 2: helpers to compute production speed bucket and human labels.

export type ProductionSpeed = 'rapido' | 'normal' | 'longo';

export interface SpeedConfig {
  rapidoMax: number; // ≤ this is rápido
  normalMax: number; // ≤ this is normal, > is longo
}

export const DEFAULT_SPEED_CONFIG: SpeedConfig = {
  rapidoMax: 3,
  normalMax: 7,
};

export interface ProductSpeedInput {
  production_days?: number | null;
  production_speed?: ProductionSpeed | null;
}

/** Returns the effective speed bucket, with manual override winning over days-based. */
export function getProductionSpeed(
  p: ProductSpeedInput,
  cfg: SpeedConfig = DEFAULT_SPEED_CONFIG
): ProductionSpeed | null {
  if (p.production_speed) return p.production_speed;
  const d = p.production_days;
  if (d == null || d <= 0) return null;
  if (d <= cfg.rapidoMax) return 'rapido';
  if (d <= cfg.normalMax) return 'normal';
  return 'longo';
}

export function speedLabel(s: ProductionSpeed | null): string {
  switch (s) {
    case 'rapido': return 'Pronta entrega';
    case 'normal': return 'Prazo normal';
    case 'longo':  return 'Sob encomenda';
    default: return '';
  }
}

export function speedDaysLabel(days?: number | null): string {
  if (!days || days <= 0) return '';
  if (days === 1) return '1 dia útil';
  return `${days} dias úteis`;
}
