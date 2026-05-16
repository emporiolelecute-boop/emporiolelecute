/**
 * Fase 14.2 — Adaptive Strategy Engine.
 * Read-only. No public SEO side effects.
 */
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export interface AdaptiveStrategyInputs {
  executionLoad: number;
  pressure: number;
  capacity: number;
  rigidity: number;
  elasticity: number;
  recoverySpeed: number;
}

export interface AdaptiveStrategy {
  pressure: number;
  capacity: number;
  rigidity: number;
  elasticity: number;
  recoveryWindowDays: number;
  executionPlan: string[];
}

export function calculateAdaptivePressure(i: { executionLoad: number; risk: number; backlog: number }): number {
  return Math.round(clamp(i.executionLoad * 0.4 + i.risk * 0.35 + Math.min(100, i.backlog) * 0.25));
}

export function estimateAdaptiveCapacity(i: { resources: number; velocity: number; stability: number }): number {
  return Math.round(clamp(i.resources * 0.35 + i.velocity * 0.4 + i.stability * 0.25));
}

export function detectStrategicRigidity(i: { changeRate: number; dependencies: number; coupling: number }): number {
  const flex = 100 - i.changeRate;
  return Math.round(clamp(flex * 0.4 + i.dependencies * 0.3 + i.coupling * 0.3));
}

export function estimateStrategicElasticity(rigidity: number, capacity: number): number {
  return Math.round(clamp(((100 - rigidity) + capacity) / 2));
}

export function simulateAdaptiveRecovery(damage: number, capacity: number, elasticity: number): number {
  const speed = (capacity + elasticity) / 2;
  return Math.max(1, Math.round((damage / Math.max(1, speed)) * 30));
}

export function buildAdaptiveExecutionModel(i: AdaptiveStrategyInputs): string[] {
  const plan: string[] = [];
  if (i.pressure > 70) plan.push("Reduzir backlog editorial antes de novas expansões.");
  if (i.rigidity > 65) plan.push("Quebrar dependências entre clusters dominantes.");
  if (i.elasticity < 45) plan.push("Investir em redundância semântica para aumentar elasticidade.");
  if (i.capacity < 50) plan.push("Aumentar capacidade operacional ou priorizar recuperação.");
  if (i.recoverySpeed < 40) plan.push("Acelerar ciclos de revisão semanal de entidades críticas.");
  if (plan.length === 0) plan.push("Sistema adaptativo dentro de parâmetros saudáveis.");
  return plan;
}

export function buildAdaptiveStrategy(i: AdaptiveStrategyInputs): AdaptiveStrategy {
  const pressure = i.pressure;
  const capacity = i.capacity;
  const rigidity = i.rigidity;
  const elasticity = i.elasticity || estimateStrategicElasticity(rigidity, capacity);
  const recoveryWindowDays = simulateAdaptiveRecovery(pressure, capacity, elasticity);
  return {
    pressure,
    capacity,
    rigidity,
    elasticity,
    recoveryWindowDays,
    executionPlan: buildAdaptiveExecutionModel({ ...i, elasticity }),
  };
}
