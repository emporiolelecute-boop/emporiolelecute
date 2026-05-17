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
