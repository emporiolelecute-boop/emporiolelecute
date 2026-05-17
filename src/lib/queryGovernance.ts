/**
 * Query & Cache Governance — read-only analysis of React Query usage.
 */
const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

export interface QueryEntry { key: string; consumers: number; staleTimeMs?: number; refetchOnFocus?: boolean }
export interface InvalidationEntry { trigger: string; invalidates: string[] }

export function detectDuplicateQueries(queries: QueryEntry[]): QueryEntry[] {
  const seen = new Map<string, number>();
  for (const q of queries) seen.set(q.key, (seen.get(q.key) ?? 0) + 1);
  return queries.filter((q) => (seen.get(q.key) ?? 0) > 1);
}

export function detectCachePressure(queries: QueryEntry[]): number {
  if (!queries.length) return 0;
  const aggressive = queries.filter((q) => (q.staleTimeMs ?? 0) < 5000 || q.refetchOnFocus).length;
  return clamp((aggressive / queries.length) * 100);
}

export function estimateReactQueryLoad(queries: QueryEntry[], simultaneousMounts = 1): number {
  const total = queries.reduce((s, q) => s + Math.max(1, q.consumers), 0);
  return clamp((total * simultaneousMounts) / 6);
}

export function detectInefficientInvalidations(invalidations: InvalidationEntry[]): InvalidationEntry[] {
  return invalidations.filter((i) => i.invalidates.length > 6);
}

export function buildCacheOptimizationMap(queries: QueryEntry[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const q of queries) {
    if ((q.staleTimeMs ?? 0) < 5000) map[q.key] = "Raise staleTime to >=60s";
    else if (q.refetchOnFocus) map[q.key] = "Disable refetchOnFocus";
  }
  return map;
}

export function buildQueryGovernanceReport(input: {
  duplicates: number; pressure: number; load: number; inefficient: number;
}): string[] {
  const out: string[] = [];
  if (input.duplicates) out.push(`Deduplicate ${input.duplicates} query key(s).`);
  if (input.pressure > 50) out.push("Increase default staleTime in admin shells.");
  if (input.load > 70) out.push("Defer non-essential queries below the fold.");
  if (input.inefficient) out.push(`Narrow ${input.inefficient} broad invalidation(s).`);
  if (!out.length) out.push("Query layer within healthy envelope.");
  return out;
}

export function calculateCacheHealth(input: { pressure: number; load: number }): number {
  return clamp(100 - (input.pressure * 0.5 + input.load * 0.5));
}
