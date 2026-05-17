/**
 * Operational Usage Analytics — read-only diagnostics that identify
 * which dashboards, metrics and engines actually deliver operational value.
 * Pure functions. No side-effects. No mutations.
 */

export interface DashboardUsageRecord {
  route: string;
  label: string;
  visits30d?: number;
  lastVisitAt?: string | null;
  actionsTaken?: number;
}

export interface MetricUsageRecord {
  key: string;
  label?: string;
  referencedIn?: number; // number of dashboards/components consuming it
  lastSampledAt?: string | null;
  derivedFrom?: string[];
}

export interface EngineUsageRecord {
  name: string;
  invocations30d?: number;
  lastInvokedAt?: string | null;
  downstreamConsumers?: number;
}

export interface UnusedItem {
  id: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface OperationalPriorityEntry {
  id: string;
  kind: "dashboard" | "metric" | "engine";
  valueScore: number; // 0..100
  rationale: string;
}

const isStale = (iso?: string | null, days = 60): boolean => {
  if (!iso) return true;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return true;
  return Date.now() - t > days * 24 * 3600 * 1000;
};

export function detectUnusedDashboards(records: DashboardUsageRecord[] = []): UnusedItem[] {
  return records
    .filter((r) => (r.visits30d ?? 0) < 2 || isStale(r.lastVisitAt, 45))
    .map((r) => ({
      id: r.route,
      reason: `Dashboard "${r.label}" has ${r.visits30d ?? 0} visits in 30d`,
      severity: (r.visits30d ?? 0) === 0 ? "high" : "medium",
    }));
}

export function detectUnusedMetrics(records: MetricUsageRecord[] = []): UnusedItem[] {
  return records
    .filter((m) => (m.referencedIn ?? 0) === 0 || isStale(m.lastSampledAt, 90))
    .map((m) => ({
      id: m.key,
      reason: `Metric "${m.key}" referenced in ${m.referencedIn ?? 0} surfaces`,
      severity: (m.referencedIn ?? 0) === 0 ? "high" : "low",
    }));
}

export function detectUnusedEngines(records: EngineUsageRecord[] = []): UnusedItem[] {
  return records
    .filter((e) => (e.invocations30d ?? 0) === 0 || isStale(e.lastInvokedAt, 60))
    .map((e) => ({
      id: e.name,
      reason: `Engine "${e.name}" had ${e.invocations30d ?? 0} invocations in 30d`,
      severity: (e.downstreamConsumers ?? 0) === 0 ? "high" : "medium",
    }));
}

export function calculateDashboardEngagement(records: DashboardUsageRecord[] = []): number {
  if (records.length === 0) return 0;
  const total = records.reduce((s, r) => s + (r.visits30d ?? 0), 0);
  const avg = total / records.length;
  return Math.max(0, Math.min(100, Math.round(Math.min(avg, 50) * 2)));
}

export function calculateOperationalValue(
  dashboards: DashboardUsageRecord[] = [],
  metrics: MetricUsageRecord[] = [],
  engines: EngineUsageRecord[] = [],
): number {
  const dEng = calculateDashboardEngagement(dashboards);
  const mShare =
    metrics.length === 0
      ? 0
      : (metrics.filter((m) => (m.referencedIn ?? 0) > 0).length / metrics.length) * 100;
  const eShare =
    engines.length === 0
      ? 0
      : (engines.filter((e) => (e.invocations30d ?? 0) > 0).length / engines.length) * 100;
  return Math.round(dEng * 0.4 + mShare * 0.3 + eShare * 0.3);
}

export function detectVanitySystems(
  dashboards: DashboardUsageRecord[] = [],
  engines: EngineUsageRecord[] = [],
): UnusedItem[] {
  const dash = dashboards
    .filter((d) => (d.visits30d ?? 0) >= 1 && (d.actionsTaken ?? 0) === 0)
    .map((d) => ({
      id: d.route,
      reason: `Dashboard "${d.label}" is viewed but yields no actions`,
      severity: "medium" as const,
    }));
  const eng = engines
    .filter((e) => (e.invocations30d ?? 0) > 0 && (e.downstreamConsumers ?? 0) === 0)
    .map((e) => ({
      id: e.name,
      reason: `Engine "${e.name}" runs but has no downstream consumers`,
      severity: "medium" as const,
    }));
  return [...dash, ...eng];
}

export function buildOperationalPriorityMap(
  dashboards: DashboardUsageRecord[] = [],
  metrics: MetricUsageRecord[] = [],
  engines: EngineUsageRecord[] = [],
): OperationalPriorityEntry[] {
  const d = dashboards.map<OperationalPriorityEntry>((r) => ({
    id: r.route,
    kind: "dashboard",
    valueScore: Math.min(100, Math.round(((r.visits30d ?? 0) + (r.actionsTaken ?? 0) * 3) * 2)),
    rationale: `${r.visits30d ?? 0} visits / ${r.actionsTaken ?? 0} actions`,
  }));
  const m = metrics.map<OperationalPriorityEntry>((r) => ({
    id: r.key,
    kind: "metric",
    valueScore: Math.min(100, (r.referencedIn ?? 0) * 20),
    rationale: `Referenced in ${r.referencedIn ?? 0} surfaces`,
  }));
  const e = engines.map<OperationalPriorityEntry>((r) => ({
    id: r.name,
    kind: "engine",
    valueScore: Math.min(100, ((r.invocations30d ?? 0) + (r.downstreamConsumers ?? 0) * 5)),
    rationale: `${r.invocations30d ?? 0} runs / ${r.downstreamConsumers ?? 0} consumers`,
  }));
  return [...d, ...m, ...e].sort((a, b) => b.valueScore - a.valueScore);
}
