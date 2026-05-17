/**
 * Fase 15.1 — Governance Convergence.
 * Cross-policy alignment and fragmentation diagnostics.
 */
import type { TelemetrySnapshot } from "./seoTelemetry";

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));
const avg = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export function calculateGovernanceConvergence(t: Partial<TelemetrySnapshot>): number {
  const positives = [
    t.governance_score ?? 0,
    t.strategic_governability_score ?? 0,
    t.systemic_consistency_score ?? 0,
    t.operational_predictability_score ?? 0,
  ];
  const negatives = [
    t.governance_drift_score ?? 0,
    t.governance_entropy_score ?? 0,
    t.contradiction_pressure_score ?? 0,
    t.strategic_fragmentation_score ?? 0,
  ];
  const pos = avg(positives);
  const neg = avg(negatives);
  return clamp(pos - neg * 0.5 + 50 * 0.5);
}

export function detectGovernanceDrift(t: Partial<TelemetrySnapshot>): {
  drift: number;
  alerts: string[];
} {
  const alerts: string[] = [];
  const drift = t.governance_drift_score ?? 0;
  if (drift >= 60) alerts.push("Drift de governança crítico.");
  else if (drift >= 40) alerts.push("Drift de governança moderado.");
  if ((t.governance_entropy_score ?? 0) >= 55) alerts.push("Entropia de governança alta.");
  return { drift, alerts };
}

export function detectPolicyConflicts(t: Partial<TelemetrySnapshot>): string[] {
  const out: string[] = [];
  if ((t.governance_score ?? 0) > 70 && (t.contradiction_pressure_score ?? 0) > 55) {
    out.push("Governança alta + contradição alta.");
  }
  if ((t.strategic_governability_score ?? 0) > 70 && (t.strategic_fragmentation_score ?? 0) > 55) {
    out.push("Governabilidade alta + fragmentação alta.");
  }
  return out;
}

export function detectStrategicFragmentation(t: Partial<TelemetrySnapshot>): number {
  return clamp(
    avg([
      t.strategic_fragmentation_score ?? 0,
      t.fragmentation_pressure_score ?? 0,
      t.fragmentation_score ?? 0,
    ]),
  );
}

export function detectExecutionMisalignment(t: Partial<TelemetrySnapshot>): number {
  const align = t.strategic_alignment_score ?? 0;
  const noise = t.operational_noise_score ?? 0;
  return clamp(100 - align + noise * 0.4);
}

export interface GovernanceMap {
  convergence: number;
  drift: number;
  fragmentation: number;
  misalignment: number;
  alerts: string[];
}

export function buildGovernanceMap(t: Partial<TelemetrySnapshot>): GovernanceMap {
  const { drift, alerts } = detectGovernanceDrift(t);
  return {
    convergence: calculateGovernanceConvergence(t),
    drift,
    fragmentation: detectStrategicFragmentation(t),
    misalignment: detectExecutionMisalignment(t),
    alerts: [...alerts, ...detectPolicyConflicts(t)],
  };
}
