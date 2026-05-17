/**
 * Documentation Hardening — read-only diagnostics for documentation reliability.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface ModuleDoc { module: string; hasReadme?: boolean; hasInlineDocs?: boolean; owner?: string }
export interface DependencyEdge { from: string; to: string; documented?: boolean }

export function detectCriticalDocumentationGaps(modules: ModuleDoc[]): ModuleDoc[] {
  return modules.filter((m) => !m.hasReadme && !m.hasInlineDocs);
}

export function buildSystemOwnershipMap(modules: ModuleDoc[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const m of modules) map[m.module] = m.owner ?? "unassigned";
  return map;
}

export function buildOperationalDependencyDocs(edges: DependencyEdge[]): Array<{ edge: string; documented: boolean }> {
  return edges.map((e) => ({ edge: `${e.from} → ${e.to}`, documented: !!e.documented }));
}

export function calculateDocumentationReliability(modules: ModuleDoc[]): number {
  if (!modules.length) return 0;
  const covered = modules.filter((m) => m.hasReadme || m.hasInlineDocs).length;
  const owned = modules.filter((m) => m.owner).length;
  return clamp(((covered / modules.length) * 60) + ((owned / modules.length) * 40));
}

export function buildDocumentationPriorities(input: {
  gaps: ModuleDoc[]; reliability: number;
}): string[] {
  const out: string[] = [];
  if (input.reliability < 50) out.push("Critical: bootstrap module READMEs.");
  if (input.gaps.length) out.push(`Document ${input.gaps.length} undocumented module(s).`);
  if (input.reliability >= 50 && input.reliability < 80) out.push("Assign owners to remaining modules.");
  if (!out.length) out.push("Documentation reliability acceptable.");
  return out;
}
