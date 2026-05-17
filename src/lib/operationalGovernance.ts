/**
 * Operational Governance — playbooks and cycles for human-led operation.
 * Read-only generators. No automation.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface Playbook { id: string; name: string; cadence: "weekly" | "monthly" | "quarterly"; steps: string[] }
export interface GovernanceGap { area: string; severity: "low" | "medium" | "high"; description: string }

export function buildOperationalPlaybooks(): Playbook[] {
  return [
    {
      id: "pb-content-health",
      name: "Content Health Review",
      cadence: "weekly",
      steps: [
        "Check Content Health dashboard for new alerts",
        "Review top 10 underperforming URLs",
        "Triage editorial backlog",
      ],
    },
    {
      id: "pb-authority-pulse",
      name: "Authority Pulse",
      cadence: "weekly",
      steps: ["Inspect authority drift", "Identify orphan high-authority pages", "Plan internal linking refresh"],
    },
    {
      id: "pb-governance-audit",
      name: "Governance Audit",
      cadence: "monthly",
      steps: [
        "Capture Final Governance Snapshot",
        "Compare against last month",
        "Document operational decisions",
      ],
    },
    {
      id: "pb-architecture-audit",
      name: "Architecture Audit",
      cadence: "quarterly",
      steps: [
        "Review simplification backlog",
        "Prune unused dashboards",
        "Validate documentation coverage",
      ],
    },
  ];
}

export function buildWeeklyOpsCycle(): string[] {
  return ["Monday: review alerts", "Wednesday: editorial triage", "Friday: capture snapshot"];
}
export function buildMonthlyGovernanceCycle(): string[] {
  return ["Week 1: snapshot", "Week 2: review priorities", "Week 3: governance audit", "Week 4: documentation refresh"];
}
export function buildQuarterlyAuditCycle(): string[] {
  return ["Architecture audit", "Telemetry pruning", "Commercial correlation review", "Documentation hardening"];
}

export function detectGovernanceGaps(input: {
  hasWeeklyOps?: boolean; hasMonthlyAudit?: boolean; hasQuarterlyReview?: boolean;
  hasDocumentationOwner?: boolean; hasSnapshotCadence?: boolean;
}): GovernanceGap[] {
  const out: GovernanceGap[] = [];
  if (!input.hasWeeklyOps) out.push({ area: "Weekly Ops", severity: "medium", description: "No weekly cadence defined." });
  if (!input.hasMonthlyAudit) out.push({ area: "Monthly Audit", severity: "high", description: "No monthly governance audit." });
  if (!input.hasQuarterlyReview) out.push({ area: "Quarterly Review", severity: "medium", description: "No quarterly architecture review." });
  if (!input.hasDocumentationOwner) out.push({ area: "Docs Owner", severity: "high", description: "No documentation ownership." });
  if (!input.hasSnapshotCadence) out.push({ area: "Snapshots", severity: "low", description: "Snapshot cadence not formalized." });
  return out;
}

export function calculateGovernanceMaturity(input: {
  playbooks: number; gaps: GovernanceGap[]; snapshotsLast90d: number;
}): number {
  const playbookScore = Math.min(40, input.playbooks * 10);
  const gapPenalty = input.gaps.reduce((s, g) => s + (g.severity === "high" ? 15 : g.severity === "medium" ? 8 : 3), 0);
  const cadenceScore = Math.min(40, input.snapshotsLast90d * 5);
  return clamp(20 + playbookScore + cadenceScore - gapPenalty);
}

// ============================================================
// Executive Consolidation extensions (additive, read-only)
// ============================================================

export interface ComplexityPressure {
  area: string;
  level: "low" | "medium" | "high";
  detail: string;
}

export function detectExcessiveComplexity(input: {
  dashboardCount: number;
  routeCount: number;
  kpiCount: number;
}): ComplexityPressure[] {
  const out: ComplexityPressure[] = [];
  if (input.dashboardCount > 30)
    out.push({ area: "dashboards", level: "high", detail: `${input.dashboardCount} dashboards` });
  if (input.routeCount > 70)
    out.push({ area: "routes", level: "high", detail: `${input.routeCount} routes` });
  if (input.kpiCount > 250)
    out.push({ area: "kpis", level: "medium", detail: `${input.kpiCount} KPIs in surface` });
  return out;
}

export function calculateAdminCognitiveLoadScore(input: {
  dashboardCount: number;
  routeCount: number;
  kpiCount: number;
}): number {
  return clamp(
    input.dashboardCount * 1.2 +
      input.routeCount * 0.6 +
      input.kpiCount * 0.1,
  );
}

export function calculateGovernancePressureScore(input: {
  pressures: ComplexityPressure[];
  maturity: number;
}): number {
  const severity = input.pressures.reduce(
    (s, p) => s + (p.level === "high" ? 25 : p.level === "medium" ? 12 : 4),
    0,
  );
  return clamp(severity + (100 - input.maturity) * 0.4);
}

export function calculateOperationalClarityScore(input: {
  redundancyScore: number;
  cognitiveLoad: number;
  pressure: number;
}): number {
  return clamp(
    100 - (input.redundancyScore * 0.3 + input.cognitiveLoad * 0.4 + input.pressure * 0.3),
  );
}

export function detectAdminSprawl(routeCount: number, dashboardCount: number): string[] {
  const out: string[] = [];
  if (routeCount > 80) out.push("Excessive admin routes");
  if (dashboardCount > 35) out.push("Dashboard inflation");
  return out;
}

export function detectEntropyDrift(input: {
  newDashboardsLast30d: number;
  newRoutesLast30d: number;
}): "low" | "medium" | "high" {
  const delta = input.newDashboardsLast30d * 2 + input.newRoutesLast30d;
  if (delta >= 15) return "high";
  if (delta >= 6) return "medium";
  return "low";
}

export function buildSimplificationRoadmap(input: {
  mergeCandidates: number;
  thinDashboards: number;
  lowUsageDashboards: number;
  inflatedKPIs: number;
}): Array<{ step: number; action: string; impact: "low" | "medium" | "high" }> {
  const steps: Array<{ step: number; action: string; impact: "low" | "medium" | "high" }> = [];
  let i = 1;
  if (input.mergeCandidates > 0)
    steps.push({ step: i++, action: `Review ${input.mergeCandidates} merge candidates`, impact: "high" });
  if (input.thinDashboards > 0)
    steps.push({ step: i++, action: `Convert ${input.thinDashboards} thin dashboards into widgets`, impact: "medium" });
  if (input.lowUsageDashboards > 0)
    steps.push({ step: i++, action: `Move ${input.lowUsageDashboards} low-usage dashboards into Labs`, impact: "medium" });
  if (input.inflatedKPIs > 0)
    steps.push({ step: i++, action: `Split ${input.inflatedKPIs} KPI-inflated dashboards into tabs`, impact: "low" });
  steps.push({ step: i++, action: "Validate executive navigation with operator", impact: "high" });
  steps.push({ step: i++, action: "Document Labs/Advanced boundary", impact: "low" });
  return steps;
}
