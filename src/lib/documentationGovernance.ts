/**
 * Documentation Governance — read-only diagnostics for living documentation.
 * Detects undocumented systems, opaque dependencies, and coverage gaps.
 */

export interface DocumentedSystem {
  id: string;
  hasReadme?: boolean;
  hasOwner?: boolean;
  hasUsageNotes?: boolean;
  dependencies?: string[];
  lastUpdatedAt?: string | null;
}

export interface DocCoverageReport {
  total: number;
  documented: number;
  partial: number;
  undocumented: number;
  coveragePct: number; // 0..100
}

export interface OpacityEntry {
  id: string;
  unknownDeps: number;
  reason: string;
}

export interface GovernanceChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export function detectUndocumentedSystems(systems: DocumentedSystem[] = []): DocumentedSystem[] {
  return systems.filter(
    (s) => !s.hasReadme && !s.hasUsageNotes,
  );
}

export function buildDocumentationCoverage(systems: DocumentedSystem[] = []): DocCoverageReport {
  const total = systems.length;
  if (total === 0)
    return { total: 0, documented: 0, partial: 0, undocumented: 0, coveragePct: 0 };
  let documented = 0, partial = 0, undocumented = 0;
  for (const s of systems) {
    const flags = [s.hasReadme, s.hasOwner, s.hasUsageNotes].filter(Boolean).length;
    if (flags >= 3) documented++;
    else if (flags >= 1) partial++;
    else undocumented++;
  }
  const coveragePct = Math.round(((documented + partial * 0.5) / total) * 100);
  return { total, documented, partial, undocumented, coveragePct };
}

export function detectDependencyOpacity(
  systems: DocumentedSystem[] = [],
  knownIds: Set<string> = new Set(systems.map((s) => s.id)),
): OpacityEntry[] {
  const out: OpacityEntry[] = [];
  for (const s of systems) {
    const deps = s.dependencies ?? [];
    const unknown = deps.filter((d) => !knownIds.has(d));
    if (unknown.length > 0) {
      out.push({
        id: s.id,
        unknownDeps: unknown.length,
        reason: `Unresolved dependencies: ${unknown.slice(0, 5).join(", ")}`,
      });
    }
  }
  return out;
}

export function calculateDocumentationHealth(systems: DocumentedSystem[] = []): number {
  const cov = buildDocumentationCoverage(systems).coveragePct;
  const opacity = detectDependencyOpacity(systems).length;
  const penalty = Math.min(30, opacity * 3);
  return Math.max(0, Math.min(100, cov - penalty));
}

export function buildGovernanceChecklist(systems: DocumentedSystem[] = []): GovernanceChecklistItem[] {
  const cov = buildDocumentationCoverage(systems);
  return [
    { id: "readme-coverage", label: "Every system has a README or usage notes", done: cov.undocumented === 0 },
    { id: "owners", label: "Every system has an assigned owner", done: systems.every((s) => s.hasOwner) },
    { id: "deps-transparent", label: "Dependencies are documented and resolvable", done: detectDependencyOpacity(systems).length === 0 },
    { id: "freshness", label: "Documentation updated within last 90 days", done: systems.every((s) => {
      if (!s.lastUpdatedAt) return false;
      const t = Date.parse(s.lastUpdatedAt);
      return !Number.isNaN(t) && Date.now() - t < 90 * 86400_000;
    })},
  ];
}
